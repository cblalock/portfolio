import { useEffect, useRef } from 'react';

// Ouroboros background: a thick, braided, cable-wound serpent ring that slowly
// spins while its body slides back into its own mouth. The tail third cracks
// into faceted shards that break away as glinting fragments and embers.

const TAU = Math.PI * 2;

// ---- tuning knobs ----
const SPIN = 0.13;        // ring rotation (rad/s): the head chases the tail
const FLOW = 0.03;        // body material sliding toward the mouth (fraction of body/s)
const GAP = 0.14;         // angular gap between neck and tail tip: small, so the jaws close on the tail
const SPIRAL = 0.015;     // tail sits slightly inside the head's radius
const BODY = 0.075;       // body half-width as a fraction of ring radius
const BURN = 0.3;         // fraction of the body (from the tail tip) that is shattering
const PLATES = 46;        // shard columns along the shatter zone
const ROWS = 3;           // shard rows across the body
const RIBS = 34;          // sinew bands along the body
const SPAWN_RATE = 85;    // loose particles per second (plus a burst on every bite)
const BITE_BURST = 28;    // particles knocked loose each time the jaws close
const SAMPLES = 340;      // body resolution (the braid needs it)

// Fire ramp, hot -> cool. Swap for [[255,244,214],[255,140,40],[150,30,10]] for orange fire.
const FIRE = [[236, 255, 244], [0, 255, 136], [0, 120, 70]];
const LINE = '0, 255, 136';
const SKIN = '2, 14, 8';

const SPAN = TAU - GAP;

// Braid: helical strands wound both ways around the tube, plus a couple of slow thick cables.
const STRANDS = [];
for (let j = 0; j < 5; j++) STRANDS.push({ dir: 1, phase: (j * TAU) / 5, f: TAU * 13 });
for (let j = 0; j < 5; j++) STRANDS.push({ dir: -1, phase: (j * TAU) / 5 + 0.3, f: TAU * 13 });
STRANDS.push({ dir: 1, phase: 1, f: TAU * 5 }, { dir: -1, phase: 2.5, f: TAU * 6 });

// Jaw opening (rad): lingers open, then snaps shut on the tail.
const jawAt = (t) => 0.08 + 0.32 * Math.pow(0.5 + 0.5 * Math.sin(t * 1.9), 1.6);

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a, b, v) => { const k = clamp01((v - a) / (b - a)); return k * k * (3 - 2 * k); };
const hash = (n) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

function fire(k, a) {
  k = clamp01(k);
  const i = k < 0.5 ? 0 : 1;
  const f = k < 0.5 ? k * 2 : (k - 0.5) * 2;
  const c0 = FIRE[i], c1 = FIRE[i + 1];
  return `rgba(${(c0[0] + (c1[0] - c0[0]) * f) | 0},${(c0[1] + (c1[1] - c0[1]) * f) | 0},${(c0[2] + (c1[2] - c0[2]) * f) | 0},${a})`;
}

// Dark facet lit toward green by brightness b (0..1).
const facet = (b, a) => `rgba(${(2 + b * 60) | 0},${(14 + b * 220) | 0},${(8 + b * 130) | 0},${a})`;

function rotate(pts, a, px, py) {
  const c = Math.cos(a), s = Math.sin(a);
  return pts.map(([X, Y]) => [px + (X - px) * c - (Y - py) * s, py + (X - px) * s + (Y - py) * c]);
}

function tracePoly(x, pts) {
  x.beginPath();
  x.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) x.lineTo(pts[i][0], pts[i][1]);
  x.closePath();
}

function polyline(pts, path = new Path2D()) {
  path.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) path.lineTo(pts[i][0], pts[i][1]);
  return path;
}

// Head shapes in units of the neck half-width. Local +x points at the tail, -y is outside the ring.
const HINGE = [1.3, 0.15];
const UPPER = [[-0.4, -1.0], [0.0, -1.3], [0.25, -1.12], [0.55, -1.5], [0.8, -1.25], [1.15, -1.62], [1.4, -1.35],
  [2.3, -1.42], [3.1, -1.15], [3.9, -0.78], [4.5, -0.42], [4.78, -0.08], [4.4, 0.05], [3.4, 0.0], [2.3, 0.05],
  HINGE, [0.4, 0.25], [-0.4, 0.15]];
const LOWER = [[-0.4, 1.0], [0.3, 1.3], [1.0, 1.22], [1.6, 1.42], [2.6, 1.18], [3.6, 0.78], [4.25, 0.48],
  [4.35, 0.27], [3.4, 0.25], [2.3, 0.22], HINGE, [0.4, 0.35]];
const UPPER_LIP = [[4.78, -0.08], [4.4, 0.05], [3.4, 0.0], [2.3, 0.05], HINGE];
const LOWER_LIP = [HINGE, [2.3, 0.22], [3.4, 0.25], [4.35, 0.27]];
const HORN = [[1.6, -1.38], [2.3, -1.42], [1.2, -1.85], [0.35, -2.3], [0.95, -1.7]];
const UPPER_LINES = [
  [[1.3, -1.08], [2.4, -1.02], [3.3, -0.72]],
  [[3.0, -0.95], [4.0, -0.55], [4.5, -0.3]],
  [[0.4, -0.45], [1.3, -0.6], [2.1, -0.4], [2.6, -0.3]],
  [[0.6, -1.15], [0.75, -0.55]],
  [[1.25, -1.3], [1.4, -0.62]],
  [[1.0, -1.7], [1.7, -1.5]],
];
const LOWER_LINES = [
  [[0.2, 0.75], [1.5, 0.95], [2.8, 0.75], [3.7, 0.5]],
  [[0.8, 1.15], [0.95, 0.6]],
  [[1.8, 1.25], [1.9, 0.7]],
  [[2.7, 1.08], [2.75, 0.62]],
];
const tooth = (bx, by, len, dir) => [[bx - 0.09, by], [bx + 0.09, by], [bx - 0.04, by + len * dir]];
const UPPER_TEETH = [4.1, 3.75, 3.4, 3.05, 2.7, 2.35, 2.0].map((tx, i) => tooth(tx, 0.03, i === 0 ? 0.62 : 0.24 + 0.06 * (i % 2), 1));
const LOWER_TEETH = [4.0, 3.6, 3.2, 2.8, 2.4, 2.0].map((tx, i) => tooth(tx, 0.24, i === 0 ? 0.5 : 0.2 + 0.06 * (i % 2), -1));

export default function Ouroboros() {
  const canvas = useRef(null);

  useEffect(() => {
    const c = canvas.current;
    const x = c.getContext('2d');
    const parts = [];
    let w, h, cx, cy, R, scale, maxParts, tubeGrad, lightGrad, raf;
    let t = 0, phi = -Math.PI * 0.9, flow = 0, spawnAcc = 0, last = 0, jaw = jawAt(0);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      // Big enough that the ring shows in the gutters beside the 960px content column.
      R = Math.min(w * 0.4, h * 0.6);
      scale = Math.max(0.5, R / 500);
      maxParts = w < 700 ? 260 : 620;

      // Round-tube shading: the body is (almost) a circle, so a radial gradient shades it like a cylinder.
      const hw = R * BODY;
      tubeGrad = x.createRadialGradient(cx, cy, R - hw * 1.3, cx, cy, R + hw * 1.15);
      tubeGrad.addColorStop(0, '#010603');
      tubeGrad.addColorStop(0.3, '#062012');
      tubeGrad.addColorStop(0.55, '#0d3a22');
      tubeGrad.addColorStop(0.78, '#06190e');
      tubeGrad.addColorStop(1, '#010402');
      // Key light from the top left.
      lightGrad = x.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      lightGrad.addColorStop(0, 'rgba(120, 255, 190, 0.16)');
      lightGrad.addColorStop(0.5, 'rgba(120, 255, 190, 0.03)');
      lightGrad.addColorStop(1, 'rgba(120, 255, 190, 0)');
    }

    // Position, tangent (toward head), outward normal and half-width at body point s (0 = tail tip, 1 = neck).
    function geom(s) {
      const th = phi + s * SPAN;
      const r = R * (1 - SPIRAL * (1 - s));
      const cos = Math.cos(th), sin = Math.sin(th);
      const dr = R * SPIRAL;
      let tx = dr * cos - r * sin * SPAN, ty = dr * sin + r * cos * SPAN;
      const len = Math.hypot(tx, ty);
      tx /= len; ty /= len;
      const hw = R * BODY * (0.88 + 0.12 * smooth(0, 0.6, s)); // no pinch at the neck
      return { x: cx + r * cos, y: cy + r * sin, tx, ty, nx: ty, ny: -tx, hw, s, m: s + flow };
    }

    function strokeNeon(path, width = 1.4, alpha = 0.85) {
      x.save();
      x.globalCompositeOperation = 'lighter';
      x.lineJoin = 'round';
      x.lineCap = 'round';
      x.strokeStyle = `rgba(${LINE},${alpha * 0.12})`;
      x.lineWidth = width * 5;
      x.stroke(path);
      x.strokeStyle = `rgba(${LINE},${alpha})`;
      x.lineWidth = width;
      x.stroke(path);
      x.restore();
    }

    function drawBody() {
      const start = BURN * 0.95;
      const G = [];
      // Run the body a little past the neck so it tucks under the head (no seam).
      const end = 1 + (0.8 * BODY) / SPAN;
      for (let i = 0; i <= SAMPLES; i++) G.push(geom(start + (end - start) * (i / SAMPLES)));

      // Silhouette with a rough, knotted outer edge.
      const outer = G.map((g) => {
        const bump = 1 + 0.07 * Math.pow(Math.abs(Math.sin(g.m * Math.PI * 46)), 3);
        return [g.x + g.nx * g.hw * bump, g.y + g.ny * g.hw * bump];
      });
      const inner = G.map((g) => {
        const bump = 1 + 0.035 * Math.pow(Math.abs(Math.sin(g.m * Math.PI * 31 + 1)), 3);
        return [g.x - g.nx * g.hw * bump, g.y - g.ny * g.hw * bump];
      });
      const body = polyline(outer);
      for (let i = inner.length - 1; i >= 0; i--) body.lineTo(inner[i][0], inner[i][1]);
      body.closePath();

      x.fillStyle = tubeGrad;
      x.fill(body);
      x.save();
      x.clip(body);
      x.globalCompositeOperation = 'lighter';
      x.fillStyle = lightGrad;
      x.fillRect(0, 0, w, h);
      x.restore();

      // Braided strands: dim where they wrap behind, dark-cased where they cross in front.
      const back = new Path2D(), front = new Path2D(), top = new Path2D();
      const from = Math.round(SAMPLES * 0.02);
      for (const st of STRANDS) {
        let px = 0, py = 0, pd = 0;
        for (let i = from; i <= SAMPLES; i++) {
          const g = G[i];
          const th = st.dir * g.m * st.f + st.phase + 0.5 * Math.sin(g.m * 9 + st.phase * 2);
          const v = Math.sin(th) * 0.9, d = Math.cos(th);
          const X = g.x + g.nx * g.hw * v, Y = g.y + g.ny * g.hw * v;
          if (i > from) {
            const dm = (d + pd) / 2;
            const p = dm < 0 ? back : dm < 0.6 ? front : top;
            p.moveTo(px, py);
            p.lineTo(X, Y);
          }
          px = X; py = Y; pd = d;
        }
      }
      x.save();
      x.lineCap = 'round';
      x.globalCompositeOperation = 'lighter';
      x.strokeStyle = `rgba(${LINE},0.1)`;
      x.lineWidth = 1 * scale;
      x.stroke(back);
      x.globalCompositeOperation = 'source-over';
      x.strokeStyle = `rgba(${SKIN},0.9)`;
      x.lineWidth = 3.6 * scale;
      x.stroke(front);
      x.stroke(top);
      x.globalCompositeOperation = 'lighter';
      x.strokeStyle = `rgba(${LINE},0.42)`;
      x.lineWidth = 1.3 * scale;
      x.stroke(front);
      x.strokeStyle = 'rgba(170, 255, 210, 0.85)';
      x.lineWidth = 1.5 * scale;
      x.stroke(top);
      x.restore();

      // Sinew bands wrapping the tube, bowed toward the head so they read as round.
      const ribs = new Path2D();
      for (let k = 0; k < RIBS; k++) {
        const s = (((k / RIBS - flow) % 1) + 1) % 1;
        if (s < BURN || s > 0.96) continue;
        const g = geom(s);
        ribs.moveTo(g.x + g.nx * g.hw * 0.97, g.y + g.ny * g.hw * 0.97);
        ribs.quadraticCurveTo(g.x + g.tx * g.hw * 0.55, g.y + g.ty * g.hw * 0.55, g.x - g.nx * g.hw * 0.97, g.y - g.ny * g.hw * 0.97);
      }
      x.save();
      x.strokeStyle = `rgba(${SKIN},0.95)`;
      x.lineWidth = 3 * scale;
      x.stroke(ribs);
      x.restore();
      strokeNeon(ribs, 0.9 * scale, 0.35);

      const edges = polyline(outer);
      polyline(inner, edges);
      strokeNeon(edges, 1.5 * scale);

      // Hot glow where the solid body starts to crack.
      const glow = new Path2D();
      for (const side of [1, -1]) {
        const pts = [];
        for (let i = 0; i <= 16; i++) {
          const g = geom(start + BURN * 0.45 * (i / 16));
          pts.push([g.x + g.nx * g.hw * side, g.y + g.ny * g.hw * side]);
        }
        polyline(pts, glow);
      }
      x.save();
      x.globalCompositeOperation = 'lighter';
      x.strokeStyle = fire(0.15, 0.3 + 0.12 * Math.sin(t * 9));
      x.lineWidth = 2.5 * scale;
      x.stroke(glow);
      x.restore();
    }

    // The tail: a jittered triangle mesh in body-material space, so cracks travel into the mouth.
    // Toward the tip, triangles drift apart, tumble, glint, and go missing.
    function drawShatter() {
      const seg = BURN / PLATES;
      const k0 = Math.floor(flow / seg) - 1;
      const cols = PLATES + 3;
      const verts = new Array(cols * (ROWS + 1));
      for (let ci = 0; ci < cols; ci++) {
        const k = k0 + ci;
        for (let r = 0; r <= ROWS; r++) {
          const jt = (hash(k * 13.1 + r * 1.7) - 0.5) * 0.7 * seg;
          const jv = r === 0 || r === ROWS ? 0 : ((hash(k * 7.3 + r * 3.9) - 0.5) * 0.6) / ROWS;
          const g = geom(k * seg - flow + jt);
          const v = -1 + (2 * r) / ROWS + jv;
          verts[ci * (ROWS + 1) + r] = [g.x + g.nx * g.hw * v, g.y + g.ny * g.hw * v, g.s];
        }
      }
      const V = (ci, r) => verts[ci * (ROWS + 1) + r];

      x.lineJoin = 'round';
      for (let ci = 0; ci < cols - 1; ci++) {
        const k = k0 + ci;
        for (let r = 0; r < ROWS; r++) {
          const A = V(ci, r), B = V(ci + 1, r), C = V(ci + 1, r + 1), D = V(ci, r + 1);
          const tris = hash(k * 3.7 + r) > 0.5 ? [[A, B, C], [A, C, D]] : [[A, B, D], [B, C, D]];
          for (let ti = 0; ti < 2; ti++) {
            const tri = tris[ti];
            const sc = (tri[0][2] + tri[1][2] + tri[2][2]) / 3;
            if (sc < 0 || sc > BURN) continue;
            const id = k * 8 + r * 2 + ti;
            const loose = 1 - sc / BURN;
            if (hash(id * 1.31) < Math.pow(loose, 1.5) * 0.72) continue; // already broken off (some chunks stay for the jaws to crush)

            const L = Math.pow(loose, 1.6);
            const g = geom(sc);
            const dn = L * g.hw * (0.4 + 2.6 * hash(id * 2.1)) * (hash(id * 5.3) > 0.2 ? 1 : -1)
              + Math.sin(t * 0.9 + id) * g.hw * 0.15 * L;
            const dt = -L * g.hw * 2 * hash(id * 4.7);
            const ang = (hash(id * 6.1) - 0.5) * 3.2 * L + Math.sin(t * 0.7 + id * 1.3) * 0.25 * L;
            const shrink = 1 - 0.25 * L;
            const mx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, my = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
            const ox = mx + g.nx * dn + g.tx * dt, oy = my + g.ny * dn + g.ty * dt;
            const ca = Math.cos(ang), sa = Math.sin(ang);
            const pts = tri.map(([px, py]) => {
              const rx = (px - mx) * shrink, ry = (py - my) * shrink;
              return [ox + rx * ca - ry * sa, oy + rx * sa + ry * ca];
            });

            const glint = Math.pow(Math.max(0, Math.sin(t * 1.3 + hash(id) * 30 + ang * 2)), 12) * 0.8 * loose;
            const b = (0.06 + 0.35 * Math.pow(hash(id * 3.3), 2)) * (0.4 + 0.6 * loose) + glint;
            tracePoly(x, pts);
            x.fillStyle = facet(b, 0.96);
            x.fill();
            x.save();
            x.globalCompositeOperation = 'lighter';
            x.strokeStyle = loose > 0.25 ? fire(1 - loose, 0.25 + 0.6 * loose) : `rgba(${LINE},${0.2 + loose})`;
            x.lineWidth = scale;
            x.stroke();
            x.restore();
          }
        }
      }
    }

    function spawn(burst = false) {
      if (parts.length >= maxParts) return;
      const s = burst ? BURN * 0.12 * Math.random() : BURN * Math.pow(Math.random(), 1.3);
      const g = geom(s);
      const side = Math.random() * 2 - 1;
      const out = Math.random() < 0.75 ? 1 : -1;
      const sp = (burst ? 35 + Math.random() * 60 : 6 + Math.random() * 32) * scale;
      const shard = Math.random() < 0.5;
      const n = Math.random() < 0.5 ? 3 : 4;
      parts.push({
        x: g.x + g.nx * g.hw * side,
        y: g.y + g.ny * g.hw * side,
        vx: g.nx * sp * out - g.tx * Math.random() * 12 * scale,
        vy: g.ny * sp * out - g.ty * Math.random() * 12 * scale,
        age: 0,
        life: shard ? 1.6 + Math.random() * 2.2 : 0.8 + Math.random() * 2,
        size: (shard ? 2 + Math.pow(Math.random(), 2) * 9 : 0.7 + Math.random() * 1.8) * scale,
        shard,
        rot: Math.random() * TAU,
        vr: (Math.random() - 0.5) * 6,
        seed: Math.random() * 100,
        pts: shard
          ? Array.from({ length: n }, (_, i) => {
            const a = (i / n) * TAU + (Math.random() - 0.5) * 1.2;
            const r = 0.5 + Math.random() * 0.6;
            return [Math.cos(a) * r, Math.sin(a) * r * (0.4 + Math.random() * 0.5)];
          })
          : null,
      });
    }

    function updateParticles(dt) {
      spawnAcc += SPAWN_RATE * dt;
      while (spawnAcc >= 1) { spawn(); spawnAcc -= 1; }
      const drag = Math.pow(0.55, dt);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.age += dt / p.life;
        if (p.age >= 1) { parts[i] = parts[parts.length - 1]; parts.pop(); continue; }
        p.vx = p.vx * drag + Math.sin(p.y * 0.025 + t * 1.6 + p.seed) * 16 * scale * dt;
        p.vy = p.vy * drag - (p.shard ? 6 : 14) * scale * dt; // embers rise faster than shards
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
      }
    }

    function drawParticles() {
      x.lineJoin = 'round';
      for (const p of parts) {
        if (!p.shard) continue;
        const a = Math.pow(1 - p.age, 1.3);
        const sz = p.size * (1 - p.age * 0.5);
        const cos = Math.cos(p.rot), sin = Math.sin(p.rot);
        const pts = p.pts.map(([X, Y]) => [p.x + (X * cos - Y * sin) * sz, p.y + (X * sin + Y * cos) * sz]);
        const glint = 0.06 + 0.9 * Math.pow(Math.abs(Math.sin(p.rot * 1.5 + p.seed)), 8);
        tracePoly(x, pts);
        x.fillStyle = facet(glint, a * 0.9);
        x.fill();
        x.save();
        x.globalCompositeOperation = 'lighter';
        x.strokeStyle = fire(0.1 + p.age * 0.8, a * 0.9);
        x.lineWidth = 0.9 * scale;
        x.stroke();
        x.restore();
      }
      x.save();
      x.globalCompositeOperation = 'lighter';
      for (const p of parts) {
        if (p.shard) continue;
        const a = Math.pow(1 - p.age, 1.2) * (0.65 + 0.35 * Math.sin(t * 22 + p.seed));
        const r = p.size * (1 - 0.5 * p.age);
        x.fillStyle = fire(p.age * 0.9, a * 0.14);
        x.beginPath(); x.arc(p.x, p.y, r * 3.5, 0, TAU); x.fill();
        x.fillStyle = fire(p.age * 0.9, a);
        x.beginPath(); x.arc(p.x, p.y, r, 0, TAU); x.fill();
      }
      x.restore();
    }

    function drawHead() {
      const g = geom(1);
      const H = g.hw * 1.05;
// jaw comes from step(): a chomp cycle that bursts debris each time it bites down
      const up = -jaw * 0.35;
      const hx = HINGE[0] * H, hy = HINGE[1] * H;
      const P = (pts, a) => rotate(pts.map(([X, Y]) => [X * H, Y * H]), a, hx, hy);
      const lw = 1.4 * scale;

      x.save();
      x.translate(g.x, g.y);
      x.rotate(Math.atan2(g.ty, g.tx));

      // No collar: the body runs under the head (see drawBody), so the jaws sit on it with no seam.

      // Mouth: dark throat lit by the burning tail it's biting.
      const mouth = [...P(UPPER_LIP, up), ...P(LOWER_LIP, jaw).slice(1)];
      tracePoly(x, mouth);
      x.fillStyle = 'rgba(0, 0, 0, 0.92)';
      x.fill();
      x.save();
      x.clip();
      x.globalCompositeOperation = 'lighter';
      const grad = x.createRadialGradient(4.3 * H, 0.1 * H, 0, 4.3 * H, 0.1 * H, 3.2 * H);
      grad.addColorStop(0, fire(0.05, 0.55 + 0.15 * Math.sin(t * 7)));
      grad.addColorStop(1, fire(0.7, 0));
      x.fillStyle = grad;
      x.fillRect(0, -3 * H, 6 * H, 6 * H);
      x.restore();

      const jawPart = (outline, lines, teeth, a) => {
        const pts = P(outline, a);
        tracePoly(x, pts);
        const sh = x.createLinearGradient(0, -1.6 * H, 0, 1.4 * H);
        sh.addColorStop(0, '#0b3520');
        sh.addColorStop(0.5, '#04170c');
        sh.addColorStop(1, '#010603');
        x.fillStyle = sh;
        x.fill();
        for (const l of lines) strokeNeon(polyline(P(l, a)), lw * 0.75, 0.45);
        for (const tt of teeth) {
          tracePoly(x, P(tt, a));
          x.fillStyle = 'rgba(216, 255, 233, 0.9)';
          x.fill();
        }
        strokeNeon(polyline(pts), lw); // open outline: no neon line across the back where it meets the neck
      };

      jawPart(LOWER, LOWER_LINES, LOWER_TEETH, jaw);
      const horn = P(HORN, up);
      tracePoly(x, horn);
      x.fillStyle = `rgb(${SKIN})`;
      x.fill();
      strokeNeon(polyline([...horn, horn[0]]), lw);
      jawPart(UPPER, UPPER_LINES, UPPER_TEETH, up);

      // Eye: a solid glowing green almond (tight glow, no halo), and the nostril.
      const [[ex, ey], [nx, ny]] = P([[2.15, -0.7], [3.95, -0.5]], up);
      x.save();
      x.globalCompositeOperation = 'lighter';
      x.shadowColor = `rgba(${LINE},0.9)`;
      x.shadowBlur = 7 * scale;
      x.fillStyle = `rgb(${LINE})`;
      x.beginPath(); x.ellipse(ex, ey, 0.3 * H, 0.14 * H, up - 0.25, 0, TAU); x.fill();
      x.shadowBlur = 0;
      x.fillStyle = 'rgba(170, 255, 210, 0.7)';
      x.beginPath(); x.ellipse(ex, ey, 0.13 * H, 0.06 * H, up - 0.25, 0, TAU); x.fill();
      x.fillStyle = `rgba(${LINE},0.55)`;
      x.beginPath(); x.ellipse(nx, ny, 0.12 * H, 0.06 * H, up - 0.4, 0, TAU); x.fill();
      x.restore();

      x.restore();
    }

    function step(dt) {
      t += dt;
      phi += SPIN * dt;
      const prev = jaw;
      jaw = jawAt(t);
      if (prev > 0.14 && jaw <= 0.14) for (let i = 0; i < BITE_BURST; i++) spawn(true);
      flow += FLOW * dt;
      updateParticles(dt);
    }

    function draw() {
      x.clearRect(0, 0, w, h);
      drawBody();
      drawShatter();
      drawHead();
      drawParticles();
    }

    resize();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (let i = 0; i < 180; i++) step(1 / 60); // let the debris develop, then hold a still frame
      draw();
      const redraw = () => { resize(); draw(); };
      window.addEventListener('resize', redraw);
      return () => window.removeEventListener('resize', redraw);
    }

    window.addEventListener('resize', resize);
    const loop = (ts) => {
      if (!document.hidden) {
        const dt = last ? Math.min((ts - last) / 1000, 0.05) : 1 / 60;
        step(dt);
        draw();
      }
      last = document.hidden ? 0 : ts;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas id="ouroboros" ref={canvas} aria-hidden="true" />;
}
