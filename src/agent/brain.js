// Runs the embedding model off the main thread. The model and library download on first use,
// come from public CDNs, and never see anything but the text being matched, inside the browser.
import { TARGETS } from './respond';

const CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1/+esm';
const MODEL = 'Xenova/all-MiniLM-L6-v2';

const WORKER = `
  let embed, vecs = [], owners = [];
  const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };
  self.onmessage = async ({ data: d }) => {
    try {
      if (d.type === 'init') {
        const { pipeline, env } = await import('${CDN}');
        env.allowLocalModels = false;
        const ex = await pipeline('feature-extraction', '${MODEL}', { dtype: 'q8', device: 'wasm',
          progress_callback: (p) => { if (p.status === 'progress' && /onnx$/.test(p.file || '')) postMessage({ type: 'progress', pct: p.progress }); } });
        embed = async (texts) => (await ex(texts, { pooling: 'mean', normalize: true })).tolist();
        const items = d.targets.flatMap((t) => t.anchors.map((a) => [t.key, a]));
        for (let i = 0; i < items.length; i += 16) {
          const batch = items.slice(i, i + 16);
          vecs.push(...await embed(batch.map((x) => x[1])));
          owners.push(...batch.map((x) => x[0]));
          postMessage({ type: 'indexing', pct: 100 * (i + batch.length) / items.length });
        }
        postMessage({ type: 'ready' });
      } else {
        const [v] = await embed([d.text]);
        const best = {};
        vecs.forEach((u, i) => { const s = dot(u, v); if (!(best[owners[i]] >= s)) best[owners[i]] = s; });
        postMessage({ type: 'result', id: d.id, hits: Object.entries(best).sort((a, b) => b[1] - a[1]).slice(0, 3) });
      }
    } catch (e) { postMessage({ type: 'error', id: d.id, message: String(e) }); }
  };`;

let worker = null;
let state = 'idle';
let seq = 0;
let onReady = [];
let onMode = () => {};
const pending = new Map();

const settleReady = () => { onReady.forEach((r) => r()); onReady = []; };

function fail(why) {
  state = 'off';
  console.warn('brain unavailable, staying on keywords:', why);
  onMode('keyword brain');
  pending.forEach((r) => r(null));
  pending.clear();
  settleReady();
}

function handle({ data: d }) {
  if (d.type === 'progress') onMode(`loading brain ${Math.floor(d.pct)}%`);
  else if (d.type === 'indexing') onMode(`indexing answers ${Math.floor(d.pct)}%`);
  else if (d.type === 'ready') {
    state = 'ready';
    onMode('semantic brain');
    settleReady();
  } else if (d.type === 'result') {
    pending.get(d.id)?.(d.hits);
    pending.delete(d.id);
  } else if (d.type === 'error') {
    if (d.id != null) {
      pending.get(d.id)?.(null);
      pending.delete(d.id);
    } else fail(d.message);
  }
}

export const brain = {
  subscribe(fn) { onMode = fn; },
  wake() {
    if (state !== 'idle') return;
    if (navigator.connection?.saveData) { state = 'off'; return; } // respect data saver
    state = 'loading';
    onMode('loading brain...');
    try {
      worker = new Worker(URL.createObjectURL(new Blob([WORKER], { type: 'text/javascript' })));
    } catch (e) { fail(e); return; }
    worker.onerror = (e) => fail(e.message);
    worker.onmessage = handle;
    worker.postMessage({ type: 'init', targets: TARGETS.map(({ key, anchors }) => ({ key, anchors })) });
  },
  // Resolves to [[key, score], ...], or null if the brain can't answer within waitMs.
  async search(text, waitMs = 0) {
    brain.wake();
    if (state === 'loading' && waitMs > 0) {
      await Promise.race([new Promise((r) => onReady.push(r)), new Promise((r) => setTimeout(r, waitMs))]);
    }
    if (state !== 'ready') return null;
    return new Promise((resolve) => {
      const id = ++seq;
      pending.set(id, resolve);
      worker.postMessage({ type: 'query', id, text });
    });
  },
};
