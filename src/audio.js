// All sound is synthesized with Web Audio. There are no audio files, and nothing plays before a click.
let actx = null;
const audio = () => {
  if (!actx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    actx = new AC();
  }
  if (actx.state === 'suspended') actx.resume();
  return actx;
};

export let userGestured = false;
['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { userGestured = true; }, { once: true, capture: true }));

// creaky "door open" (and a shorter close)
export function doorSound(open) {
  const ctx = audio(); if (!ctx) return;
  const t = ctx.currentTime;
  const out = ctx.createGain(); out.gain.value = 0.18; out.connect(ctx.destination);
  const osc = ctx.createOscillator(); osc.type = 'sawtooth';
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 6;
  const g = ctx.createGain();
  const dur = open ? 0.55 : 0.3;
  const [f0, f1] = open ? [95, 180] : [170, 90];
  osc.frequency.setValueAtTime(f0, t);
  for (let i = 1; i <= 10; i++) osc.frequency.setValueAtTime(f0 + (f1 - f0) * (i / 10) + (i % 2 ? 25 : -15), t + dur * (i / 10));
  bp.frequency.setValueAtTime(900, t); bp.frequency.linearRampToValueAtTime(1600, t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1, t + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(bp).connect(g).connect(out); osc.start(t); osc.stop(t + dur + 0.05);
  if (open) { // little "knock" at the end
    const k = ctx.createOscillator(); const kg = ctx.createGain();
    k.type = 'sine'; k.frequency.setValueAtTime(140, t + dur); k.frequency.exponentialRampToValueAtTime(60, t + dur + 0.12);
    kg.gain.setValueAtTime(0.0001, t + dur); kg.gain.exponentialRampToValueAtTime(0.9, t + dur + 0.01); kg.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.15);
    k.connect(kg).connect(out); k.start(t + dur); k.stop(t + dur + 0.2);
  }
}

export function imBlip() {
  const ctx = audio(); if (!ctx) return;
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'triangle'; o.frequency.setValueAtTime(880, t); o.frequency.setValueAtTime(1320, t + 0.06);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.2);
}

// Am - F - C - G, one bar each, 8 steps per bar
const BPM = 96, STEP = 60 / BPM / 2; // eighth notes
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const CHORDS = [[45, [0, 3, 7, 12]], [41, [0, 4, 7, 12]], [48, [0, 4, 7, 12]], [43, [0, 4, 7, 12]]];
const ARP = [0, 1, 2, 3, 2, 1, 2, 3];

let master = null, timer = null, step = 0, next = 0, playing = false, volume = 0.45;
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

function voice(ctx, freq, t, dur, type, vol, cutoff) {
  const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
  o.type = type; o.frequency.value = freq; f.type = 'lowpass'; f.frequency.value = cutoff;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(f).connect(g).connect(master); o.start(t); o.stop(t + dur + 0.02);
}
function hat(ctx, t) {
  const len = Math.floor(ctx.sampleRate * 0.04), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = buf; f.type = 'highpass'; f.frequency.value = 7000; g.gain.value = 0.12;
  s.connect(f).connect(g).connect(master); s.start(t);
}
function schedule() {
  const ctx = actx;
  while (next < ctx.currentTime + 0.12) {
    const bar = Math.floor(step / 8) % 4, s = step % 8, [root, iv] = CHORDS[bar];
    voice(ctx, mtof(root + 24 + iv[ARP[s]]), next, STEP * 0.9, 'square', 0.09, 1900);
    if (s === 0 || s === 3 || s === 6) voice(ctx, mtof(root), next, STEP * 2.2, 'triangle', 0.35, 600);
    if (s % 2 === 1) hat(ctx, next);
    next += STEP; step++;
  }
}

export const music = {
  isPlaying: () => playing,
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  setVolume(v) { volume = v; if (master) master.gain.value = v * 0.5; },
  start() {
    const ctx = audio(); if (!ctx || playing) return;
    if (!master) { master = ctx.createGain(); master.connect(ctx.destination); }
    music.setVolume(volume);
    playing = true; step = 0; next = ctx.currentTime + 0.05;
    schedule(); timer = setInterval(schedule, 25);
    notify();
  },
  stop() { playing = false; clearInterval(timer); notify(); },
  toggle() { if (playing) music.stop(); else music.start(); },
};
