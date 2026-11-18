'use client';

import { useEffect, useRef } from 'react';

import s from './ServicesTiles.module.css';

type Tile = {
  kind: 'light' | 'dark' | 'red';
  // position / size in a 100 × 75 grid
  x: number;
  y: number;
  w: number;
  h: number;
  delay: number;
  from: [number, number];
};

// Light modules settle first, black tiles slide in from different sides one
// after another, the red square arrives last into the free cell.
const TILES: Tile[] = [
  { kind: 'light', x: 0, y: 0, w: 36, h: 24, delay: 0, from: [0, 14] },
  { kind: 'light', x: 37, y: 0, w: 34, h: 24, delay: 0.07, from: [0, 14] },
  { kind: 'light', x: 74, y: 19, w: 26, h: 16, delay: 0.14, from: [0, 14] },
  { kind: 'light', x: 0, y: 44, w: 35, h: 18, delay: 0.21, from: [0, 14] },
  { kind: 'light', x: 64, y: 36, w: 36, h: 22, delay: 0.28, from: [0, 14] },
  { kind: 'light', x: 37, y: 50, w: 27, h: 25, delay: 0.35, from: [0, 14] },
  { kind: 'light', x: 65, y: 59, w: 35, h: 16, delay: 0.42, from: [0, 14] },
  { kind: 'dark', x: 0, y: 25, w: 35, h: 18, delay: 0.55, from: [-36, 0] },
  { kind: 'dark', x: 72, y: 0, w: 28, h: 18, delay: 0.69, from: [36, 0] },
  { kind: 'dark', x: 37, y: 25, w: 26, h: 24, delay: 0.83, from: [0, 32] },
  { kind: 'dark', x: 0, y: 63, w: 35, h: 12, delay: 0.97, from: [-28, 24] },
  { kind: 'red', x: 64, y: 25, w: 9, h: 9, delay: 1.15, from: [-22, -22] },
];

const NOSCRIPT_CSS = `.${s.tile}{animation:none!important;opacity:1!important}`;

export default function ServicesTiles({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  // Start the assembly when the block first scrolls into view.
  useEffect(() => {
    const node = rootRef.current;

    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      node.setAttribute('data-play', '');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.setAttribute('data-play', '');
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  // Very light cursor tilt (≤ 1.5°), only for a fine pointer with hover.
  useEffect(() => {
    const node = rootRef.current;
    const tilt = tiltRef.current;

    if (!node || !tilt) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!fine.matches || reduced.matches) return;

    const MAX = 1.5;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;

      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      tilt.style.setProperty('--ty', `${(px * 2 * MAX).toFixed(2)}deg`);
      tilt.style.setProperty('--tx', `${(-py * 2 * MAX).toFixed(2)}deg`);
    };

    const onLeave = () => {
      tilt.style.setProperty('--tx', '0deg');
      tilt.style.setProperty('--ty', '0deg');
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);

    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`${s.frame} ${s.root} ${className ?? ''}`}
    >
      <noscript>
        <style>{NOSCRIPT_CSS}</style>
      </noscript>

      <div ref={tiltRef} className={s.tilt}>
        <div className={s.plane}>
          {TILES.map((tile, index) => (
            <div
              key={index}
              className={`${s.tile} ${s[tile.kind]}`}
              style={
                {
                  '--x': tile.x,
                  '--y': tile.y,
                  '--w': tile.w,
                  '--h': tile.h,
                  '--d': `${tile.delay}s`,
                  '--fx': `${tile.from[0]}px`,
                  '--fy': `${tile.from[1]}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
