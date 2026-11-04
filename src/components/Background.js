import { useEffect, useRef } from 'react';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロ0123456789{}<>/=;+*';
const FONT_SIZE = 16;

export function MatrixRain() {
  const canvas = useRef(null);

  useEffect(() => {
    const c = canvas.current;
    const x = c.getContext('2d');
    let w, h, drops, raf;

    function resize() {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
      drops = Array.from({ length: Math.ceil(w / FONT_SIZE) }, () => Math.random() * -h / FONT_SIZE);
      x.fillStyle = '#020603';
      x.fillRect(0, 0, w, h);
    }
    function frame() {
      x.fillStyle = 'rgba(2, 6, 3, 0.09)';
      x.fillRect(0, 0, w, h);
      x.font = FONT_SIZE + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * FONT_SIZE;
        if (y > 0) {
          x.fillStyle = Math.random() < 0.06 ? '#d8ffe9' : '#00ff88';
          x.fillText(CHARS[(Math.random() * CHARS.length) | 0], i * FONT_SIZE, y);
        }
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    }

    resize();
    window.addEventListener('resize', resize);
    if (reduceMotion()) {
      for (let i = 0; i < 60; i++) frame();
    } else {
      let last = 0;
      const loop = (ts) => {
        if (!document.hidden && ts - last > 50) { frame(); last = ts; }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas id="rain" ref={canvas} aria-hidden="true" />;
}

export function CursorGlow() {
  const glow = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    const g = glow.current;
    const ease = reduceMotion() ? 1 : 0.22;
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2, cx = tx, cy = ty, moving = false, raf;

    function tick() {
      cx += (tx - cx) * ease;
      cy += (ty - cy) * ease;
      g.style.transform = `translate3d(${cx - 150}px, ${cy - 150}px, 0)`;
      if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) raf = requestAnimationFrame(tick);
      else moving = false;
    }
    const onMove = (e) => {
      tx = e.clientX; ty = e.clientY;
      g.style.opacity = 1;
      if (!moving) { moving = true; raf = requestAnimationFrame(tick); }
    };
    const onLeave = () => { g.style.opacity = 0; };
    const root = document.documentElement;
    window.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div id="glow" ref={glow} aria-hidden="true" />;
}
