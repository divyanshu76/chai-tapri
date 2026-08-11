/**
 * AmbientLayer.jsx
 * Renders scene-specific particle systems: rain, dust, smoke.
 * Uses pure CSS animations — no canvas, minimal JS.
 */

import React, { useMemo } from 'react';

function RainParticles({ count, color }) {
  const drops = useMemo(() =>
    [...Array(count)].map((_, i) => ({
      id: i,
      left: `${(i * 1.65 + 0.5) % 100}%`,
      delay: `${(i * 0.07) % 2.5}s`,
      duration: `${0.55 + (i % 7) * 0.08}s`,
      width: i % 5 === 0 ? 2 : 1,
      height: `${10 + (i % 4) * 4}px`,
      opacity: 0.3 + (i % 4) * 0.08,
    })),
  [count]);

  return (
    <>
      {drops.map((d) => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            top: '-10vh',
            left: d.left,
            width: d.width,
            height: d.height,
            background: color,
            borderRadius: 1,
            opacity: d.opacity,
            animation: `rain-fall ${d.duration} linear ${d.delay} infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  );
}

function DustParticles({ count, color }) {
  const particles = useMemo(() =>
    [...Array(count)].map((_, i) => ({
      id: i,
      left: `${(i * 5.3 + 2) % 100}%`,
      top: `${(i * 4.7 + 5) % 70}%`,
      size: 1 + (i % 3),
      delay: `${(i * 0.4) % 6}s`,
      duration: `${5 + (i % 4) * 1.5}s`,
    })),
  [count]);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: color,
            animation: `dust-float ${p.duration} ease-in-out ${p.delay} infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  );
}

function SmokeParticles({ count, color }) {
  const wisps = useMemo(() =>
    [...Array(count)].map((_, i) => ({
      id: i,
      left: `${46 + (i % 4) * 2.5}%`,
      bottom: '30%',
      width: 4 + (i % 3) * 2,
      height: 4 + (i % 3) * 2,
      delay: `${i * 0.9}s`,
      duration: `${4 + (i % 3)}s`,
    })),
  [count]);

  return (
    <>
      {wisps.map((w) => (
        <div
          key={w.id}
          style={{
            position: 'absolute',
            left: w.left,
            bottom: w.bottom,
            width: w.width,
            height: w.height,
            borderRadius: '50%',
            background: color,
            filter: 'blur(3px)',
            animation: `smoke-rise ${w.duration} ease-in-out ${w.delay} infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </>
  );
}

/* Occasional headlights sweep (midnight) */
function HeadlightSweep() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '18%',
        left: 0,
        width: '30%',
        height: '3%',
        background: 'linear-gradient(90deg, transparent, rgba(196,182,120,0.15), transparent)',
        borderRadius: '0 50% 50% 0',
        animation: 'headlight 9s ease-in-out 4s infinite',
        willChange: 'transform, opacity',
      }}
    />
  );
}

export default function AmbientLayer({ scene, reducedMotion, weatherOverride }) {
  if (reducedMotion) return null;

  // Determine which particles to show based on override or scene defaults
  let type, count, color;
  
  if (weatherOverride === 'rain') {
    type = 'rain';
    count = 60;
    color = 'rgba(180, 200, 220, 0.4)';
  } else if (weatherOverride === 'dust') {
    type = 'dust';
    count = 18;
    color = 'rgba(232, 164, 74, 0.35)';
  } else if (scene?.particles) {
    type = scene.particles.type;
    count = scene.particles.count;
    color = scene.particles.color;
  }

  if (!type) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none',
        zIndex: 'var(--z-ambient)',
        overflow: 'hidden',
      }}
    >
      {type === 'rain' && <RainParticles count={count} color={color} />}
      {type === 'dust' && <DustParticles count={count} color={color} />}
      {type === 'smoke' && (
        <>
          <SmokeParticles count={count} color={color} />
          <HeadlightSweep />
        </>
      )}
    </div>
  );
}
