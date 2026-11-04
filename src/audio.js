// The chat window's sounds, synthesized with Web Audio. There are no audio files, and nothing plays before a click.
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
