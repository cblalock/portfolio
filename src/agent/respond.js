// Two layers. Keyword rules answer instantly. Anything they can't place confidently goes to a ~23MB
// embedding model running in a Web Worker, which picks the closest answer Connor wrote, or admits it can't.
import { LINKS } from '../data/site';
import { PROJECTS } from '../data/projects';
import { SKILLS, INTENTS, PARAPHRASES, PROJECT_PARAPHRASES, SKILL_PARAPHRASES } from './content';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const norm = (s) => ' ' + s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9+#\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
const stem = (w) => (w.length > 3 && /[^s]s$/.test(w) ? w.slice(0, -1) : w);
const toks = (s) => new Set(norm(s).trim().split(' ').map(stem));
const prepped = INTENTS.map((it) => ({ ...it, pt: it.p.map((ph) => [...toks(ph)]) }));

function matchProject(n) {
  let best = null, bestLen = 0;
  for (const p of PROJECTS) for (const a of p.aliases) {
    if (n.includes(' ' + a + ' ') || n.includes(' ' + a + 's ')) { if (a.length > bestLen) { best = p; bestLen = a.length; } }
  }
  return best ? { p: best, len: bestLen } : null;
}
function matchIntent(t) {
  let best = null, score = 0;
  for (const it of prepped) for (const ph of it.pt) {
    if (ph.every((w) => t.has(w)) && ph.length > score) { best = it; score = ph.length; }
  }
  return best ? { it: best, score } : null;
}
function matchSkills(n) { return Object.entries(SKILLS).filter(([, s]) => s.re.test(n)).map(([k]) => k); }

// Common tech that appears nowhere on the page: say so plainly rather than let the model pick a near neighbor.
const NOT_LISTED = [['Rust', 'rust'], ['Go', 'golang'], ['Kotlin', 'kotlin'], ['Swift', 'swift'], ['Ruby', 'ruby|rails'], ['PHP', 'php'], ['C#', 'c#|csharp|dotnet|net core'],
  ['Scala', 'scala'], ['Perl', 'perl'], ['TypeScript', 'typescript'], ['Vue', 'vue|vuejs'], ['Angular', 'angular'], ['Svelte', 'svelte'], ['Django', 'django'], ['Flask', 'flask'], ['Spring', 'spring boot'],
  ['AWS', 'aws'], ['Azure', 'azure'], ['GCP', 'gcp|google cloud'], ['Kubernetes', 'kubernetes|k8s'], ['Terraform', 'terraform'], ['MongoDB', 'mongo|mongodb'], ['Redis', 'redis'], ['Kafka', 'kafka'], ['Spark', 'pyspark'],
  ['PyTorch', 'pytorch'], ['TensorFlow', 'tensorflow'], ['Excel', 'excel'], ['Power BI', 'power bi|powerbi']]
  .map(([label, w]) => ({ label, re: new RegExp(`\\s(${w})\\s`) }));

const projectReply = (p) => ({ text: `opening <b>${esc(p.title)}</b>. ${esc(p.desc.split('. ')[0].replace(/\.$/, ''))}.`, act: { type: 'project', id: p.id } });
function skillReply(k) {
  const label = SKILLS[k].label;
  const hits = PROJECTS.filter((p) => p.skills.includes(k));
  if (!hits.length) return { text: `he lists <b>${esc(label)}</b> in his interests, but none of the top 8 lean on it. try asking about Python, AI or data instead.`, act: { type: 'flash', target: '#interests' } };
  const names = hits.map((p) => `<b>${esc(p.name)}</b>`);
  const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names.at(-1) : names[0];
  return { text: `${esc(label)} shows up in ${list}. lighting ${hits.length > 1 ? 'them' : 'it'} up.`, act: { type: 'highlight', ids: hits.map((p) => p.id) } };
}
const intentReply = (it) => ({ text: it.r, act: it.a, chips: it.chips });
const MISS = 'hmm, i didn’t catch that. i only know about connor and his builds (on purpose, so i never make stuff up). try one of these:';

// Keyword layer. `weak` / `miss` mean the embedding model is allowed to do better.
export function respond(raw) {
  const n = norm(raw), t = toks(raw);
  if (/^ (write|generate|draft|translate|summarize|solve|debug)\b/.test(n)) return { text: 'i can’t write or generate anything: every answer i give is one connor wrote ahead of time. ask me about his builds instead.', chips: true };
  if (/\s(clearance|clearances|cleared|ts sci|top secret|classified)\s/.test(n)) return intentReply(INTENTS.find((it) => it.id === 'clearance'));
  if (/\bscanner\b/.test(n) && /\b(agent|trader|trading bot)\b/.test(n)) return intentReply(INTENTS.find((it) => it.id === 'system'));
  if (/\s(profit|profitable|make money|made money|lose money|lost money|real money|win rate|paper trad\w*|paper account|how many trades)\s/.test(n)) return intentReply(INTENTS.find((it) => it.id === 'results'));
  if (/\b(trading|agent)\b/.test(n) && /\b(what happened|stop|stopped|end|ended|did (it|the trading \w+|the agent) work)\b/.test(n)) return intentReply(INTENTS.find((it) => it.id === 'results'));
  const proj = matchProject(n), intent = matchIntent(t), skills = matchSkills(n);
  const listy = /\b(which|projects|what|show|all|used|use|uses|know|knows|experience|good at|skills?|with)\b/.test(n);

  // 1. a specific project by name ("tell me about the drone")
  if (proj && !(intent && intent.score >= 2 && proj.len < 6)) {
    return projectReply(proj.p);
  }
  // 2. a strong multi-word intent ("what's he best at", "who is connor")
  if (intent && intent.score >= 2 && !(skills.length && listy && intent.it.id === 'projects')) return intentReply(intent.it);
  // 3. a skill / tech ("python projects", "does he know react")
  if (skills.length) return { ...skillReply(skills[0]), weak: true, skill: true };
  // 4. tech he doesn't list
  const absent = NOT_LISTED.find((x) => x.re.test(n));
  if (absent) return { text: `i don’t see <b>${esc(absent.label)}</b> in his top 8 or his interests, and i won’t guess. <a href="mailto:${LINKS.email}">ask him directly</a> if it matters for your role.` };
  // 5. a weak single-word intent
  if (intent) return { ...intentReply(intent.it), weak: true };
  // 6. nothing: the model may still place it, otherwise say so, never guess
  return { text: MISS, chips: true, miss: true };
}

export const TARGETS = [
  ...INTENTS.map((it) => {
    const q = PARAPHRASES[it.id] || [];
    return { key: 'intent:' + it.id, ask: q[0] || it.p[0], anchors: [...q, ...it.p.filter((x) => x.split(' ').length >= (it.id === 'job' ? 3 : 2))], reply: () => intentReply(it) };
  }),
  ...PROJECTS.map((p) => ({
    key: 'project:' + p.id, ask: `show me ${p.title}`,
    anchors: [`tell me about ${p.title}`, p.desc.split('. ')[0], ...(PROJECT_PARAPHRASES[p.id] || [])],
    reply: () => projectReply(p),
  })),
  ...Object.keys(SKILLS).map((k) => ({
    key: 'skill:' + k, ask: `${SKILLS[k].label} projects`,
    anchors: [`what has he built with ${SKILLS[k].label}`, ...(SKILL_PARAPHRASES[k] || [])],
    reply: () => skillReply(k),
  })),
];

const SURE = 0.62, MAYBE = 0.48, GAP = 0.03; // cosine thresholds, calibrated against test questions
const targetBy = Object.fromEntries(TARGETS.map((t) => [t.key, t]));
// `search` is the embedding lookup: (text, waitMs) => [[key, score], ...] or null.
export async function answer(raw, search) {
  const r = respond(raw);
  if (!r.weak && !r.miss) return r;
  const hits = await search(norm(raw).trim(), r.miss ? 8000 : 0);
  if (!hits || !hits.length) return r;
  const [[key, score], second] = hits;
  if (score >= SURE && (!second || score - second[1] >= GAP) && !(r.skill && !key.startsWith('project:'))) return targetBy[key].reply();
  if (r.weak) return r;
  if (score >= MAYBE) {
    const asks = hits.filter(([, s]) => s >= MAYBE).slice(0, 3).map(([k]) => targetBy[k].ask);
    return { text: 'not totally sure what you mean. did you mean one of these?', chips: asks };
  }
  return r;
}
