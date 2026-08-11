/**
 * FilmGrain.jsx — v2
 * Subtle warm-tinted film grain overlay.
 */

import React from 'react';

export default function FilmGrain({ intensity = 0.04 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: '-5%',
        zIndex: 'var(--z-grain)',
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '160px 160px',
        opacity: intensity,
        animation: 'grain-anim 0.35s steps(1) infinite',
        mixBlendMode: 'overlay',
      }}
    />
  );
}
