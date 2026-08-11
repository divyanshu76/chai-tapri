/**
 * BackgroundScene.jsx — v2
 *
 * IMAGE SWAP ARCHITECTURE (unchanged):
 * ─────────────────────────────────────────────────────────────
 * Set imageUrl in src/data/scenes.js to switch from CSS → photo:
 *   imageUrl: '/scenes/evening.webp'
 * Everything else stays the same. Song→scene logic in App.jsx
 * only ever passes sceneId (1|2|3).
 * ─────────────────────────────────────────────────────────────
 *
 * v2 improvements:
 * - Warm beige/cream palette throughout
 * - Richer layered gradients — no flat black sky
 * - More detailed tapri silhouette
 * - Natural warm glow pools
 * - Smooth scene transition (no harsh mid-page band)
 */

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getSceneById } from '../data/scenes';
import AmbientLayer from './AmbientLayer';

/* ── Window Size Hook for Responsive Cropping ────────────────── */
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/* ──────────────────────────────────────────────────────────────
   SCENE 1 — EVENING TAPRI
   Warm amber/cream sky, long golden hour, dusty atmosphere
────────────────────────────────────────────────────────────── */
function EveningScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Sky gradient — warm amber horizon */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          linear-gradient(180deg,
            #2a1a08 0%,
            #3d2208 18%,
            #5c320e 32%,
            #7a4214 45%,
            #8c5218 56%,
            #6b3c10 68%,
            #3d2008 80%,
            #1e1005 100%
          )
        `,
      }} />

      {/* Sun/horizon glow haze */}
      <div style={{
        position: 'absolute',
        bottom: '35%', left: '50%',
        transform: 'translateX(-50%)',
        width: '75%', height: '40%',
        background: 'radial-gradient(ellipse at 50% 80%, rgba(200,140,40,0.38) 0%, rgba(160,90,20,0.18) 40%, transparent 75%)',
        pointerEvents: 'none',
      }} />

      {/* Horizon golden line */}
      <div style={{
        position: 'absolute',
        bottom: '35%', left: 0, right: 0,
        height: 2,
        background: 'linear-gradient(90deg, transparent, rgba(200,150,60,0.35), rgba(220,170,80,0.5), rgba(200,150,60,0.35), transparent)',
      }} />

      {/* Distant city skyline — warm brown silhouette */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', bottom: '32%', left: 0, width: '100%', height: '22%' }}
        viewBox="0 0 1400 160" preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="sky-ev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(45,22,6,0.92)" />
            <stop offset="100%" stopColor="rgba(35,16,4,0.95)" />
          </linearGradient>
        </defs>
        <path fill="url(#sky-ev)" d="
          M0,160 L0,100 L35,100 L35,70 L55,70 L55,90 L90,90 L90,55
          L115,55 L115,80 L155,80 L155,40 L175,40 L175,60 L215,60
          L215,75 L255,75 L255,45 L285,45 L285,68 L330,68 L330,85
          L375,85 L375,48 L410,48 L410,70 L455,70 L455,42 L490,42
          L490,65 L540,65 L540,88 L585,88 L585,50 L625,50 L625,72
          L670,72 L670,88 L720,88 L720,50 L760,50 L760,35 L790,35
          L790,55 L835,55 L835,78 L880,78 L880,48 L920,48 L920,70
          L965,70 L965,90 L1010,90 L1010,58 L1048,58 L1048,80
          L1095,80 L1095,60 L1130,60 L1130,82 L1175,82 L1175,100
          L1220,100 L1220,78 L1265,78 L1265,95 L1310,95 L1310,110
          L1400,110 L1400,160 Z
        " />
        {/* Warm lit windows */}
        {[170, 250, 385, 465, 600, 680, 795, 875, 965, 1055, 1140].map((x, i) => (
          <rect key={i} x={x + (i%3)*8} y={50 + (i%2)*18} width={5} height={7}
            fill={`rgba(220,170,80,${0.18 + (i%3)*0.08})`} />
        ))}
      </svg>

      {/* Mid-ground: electric pole */}
      <div style={{
        position: 'absolute', bottom: '32%', left: '15%',
        width: 2, height: '18%',
        background: 'rgba(30,14,4,0.8)',
      }} />
      <div style={{
        position: 'absolute', bottom: '50%', left: '14.2%',
        width: '1.7%', height: 1,
        background: 'rgba(30,14,4,0.5)',
      }} />

      {/* Tapri structure — warm, detailed */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '68%', maxWidth: 820 }}
        viewBox="0 0 820 340" preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="tapri-wall-ev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(40,20,6,0.96)" />
            <stop offset="100%" stopColor="rgba(28,12,3,0.98)" />
          </linearGradient>
          <radialGradient id="bulb-glow-ev" cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="rgba(210,150,50,0.55)" />
            <stop offset="100%" stopColor="rgba(210,150,50,0)" />
          </radialGradient>
        </defs>
        {/* Awning / roof — slanted */}
        <path d="M0,95 L820,95 L820,135 L0,135 Z" fill="rgba(55,25,8,0.97)" />
        <path d="M-20,80 L840,80 L840,100 L-20,100 Z" fill="rgba(70,32,10,0.96)" />
        {/* Awning stripes — subtle */}
        {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
          <rect key={i} x={i*82} y="80" width="41" height="20" fill="rgba(80,38,12,0.3)" />
        ))}
        {/* Back wall */}
        <rect x="30" y="100" width="760" height="100" fill="url(#tapri-wall-ev)" />
        {/* Wall texture lines */}
        <line x1="30" y1="130" x2="790" y2="130" stroke="rgba(50,24,7,0.4)" strokeWidth="0.5" />
        <line x1="30" y1="160" x2="790" y2="160" stroke="rgba(50,24,7,0.3)" strokeWidth="0.5" />
        {/* Shelf */}
        <rect x="80" y="116" width="180" height="3" fill="rgba(80,38,12,0.7)" />
        <rect x="320" y="112" width="120" height="3" fill="rgba(80,38,12,0.7)" />
        <rect x="520" y="118" width="200" height="3" fill="rgba(80,38,12,0.7)" />
        {/* Jars on shelf */}
        {[95, 118, 140, 162].map((x, i) => (
          <ellipse key={i} cx={x} cy="115" rx={i===1?10:7} ry={i===1?13:10}
            fill="rgba(90,45,12,0.65)" stroke="rgba(120,65,18,0.3)" strokeWidth="0.5" />
        ))}
        {/* Chai kettle */}
        <ellipse cx="680" cy="113" rx="18" ry="14" fill="rgba(45,22,6,0.9)" />
        <rect x="670" y="100" width="20" height="5" rx="2" fill="rgba(60,30,8,0.8)" />
        {/* Counter top */}
        <rect x="60" y="198" width="700" height="10" rx="1" fill="rgba(65,30,8,0.95)" />
        <rect x="60" y="206" width="700" height="2" fill="rgba(90,45,12,0.5)" />
        {/* Counter front */}
        <rect x="60" y="208" width="700" height="60" fill="rgba(35,16,4,0.95)" />
        {/* Poles */}
        <rect x="50" y="135" width="10" height="205" fill="rgba(28,13,4,0.92)" />
        <rect x="760" y="135" width="10" height="205" fill="rgba(28,13,4,0.92)" />
        {/* Hanging bulb wire */}
        <line x1="410" y1="0" x2="410" y2="80" stroke="rgba(40,20,6,0.5)" strokeWidth="1" />
        {/* Bulb glow pool on counter */}
        <ellipse cx="410" cy="200" rx="130" ry="60" fill="url(#bulb-glow-ev)" />
        {/* Chai glass on counter */}
        <path d="M380,202 L388,196 L422,196 L430,202 Z" fill="rgba(180,120,40,0.3)" stroke="rgba(180,120,40,0.5)" strokeWidth="0.8" />
        <rect x="388" y="196" width="34" height="6" fill="rgba(150,90,25,0.45)" />
      </svg>

      {/* Warm ground / road */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '5%',
        background: 'linear-gradient(180deg, rgba(25,12,3,0.9) 0%, rgba(16,8,2,1) 100%)',
      }} />

      {/* Road reflections — subtle warm */}
      {[20, 45, 68].map((l, i) => (
        <div key={i} style={{
          position: 'absolute',
          bottom: '1.5%', left: `${l}%`,
          width: '8%', height: 1.5,
          background: 'linear-gradient(90deg, transparent, rgba(200,150,60,0.08), transparent)',
          borderRadius: 1,
        }} />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   SCENE 2 — RAINY NIGHT
   Deep blue-slate sky, wet road, cool green lamp light
────────────────────────────────────────────────────────────── */
function RainyScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          linear-gradient(180deg,
            #050810 0%,
            #080d1c 22%,
            #0c1428 40%,
            #101a30 55%,
            #0c1424 68%,
            #080e1c 80%,
            #050810 100%
          )
        `,
      }} />

      {/* Rain-diffused city glow — low on horizon */}
      <div style={{
        position: 'absolute',
        bottom: '30%', left: '50%',
        transform: 'translateX(-50%)',
        width: '80%', height: '30%',
        background: 'radial-gradient(ellipse at 50% 80%, rgba(60,110,80,0.22) 0%, rgba(40,80,60,0.1) 45%, transparent 75%)',
      }} />

      {/* Distant buildings */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', bottom: '28%', left: 0, width: '100%', height: '24%' }}
        viewBox="0 0 1400 180" preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="bldg-rain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(8,14,26,0.93)" />
            <stop offset="100%" stopColor="rgba(6,10,20,0.96)" />
          </linearGradient>
        </defs>
        <path fill="url(#bldg-rain)" d="
          M0,180 L0,90 L50,90 L50,60 L80,60 L80,85 L120,85 L120,45
          L155,45 L155,68 L200,68 L200,30 L235,30 L235,52 L285,52
          L285,78 L330,78 L330,40 L370,40 L370,65 L420,65 L420,28
          L460,28 L460,50 L510,50 L510,75 L565,75 L565,38 L610,38
          L610,58 L660,58 L660,80 L720,80 L720,40 L760,40 L760,22
          L800,22 L800,45 L850,45 L850,68 L900,68 L900,35 L945,35
          L945,58 L995,58 L995,82 L1050,82 L1050,48 L1090,48 L1090,70
          L1140,70 L1140,52 L1180,52 L1180,75 L1230,75 L1230,92
          L1290,92 L1290,68 L1340,68 L1340,88 L1400,88 L1400,180 Z
        " />
        {/* Blue-tinted lit windows */}
        {[200, 310, 430, 545, 665, 780, 905, 1010, 1140].map((x, i) => (
          <rect key={i} x={x} y={35 + (i%3)*15} width={5} height={7}
            fill={`rgba(140,180,220,${0.1 + (i%4)*0.04})`} />
        ))}
      </svg>

      {/* Tapri — darker, rainy atmosphere */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '65%', maxWidth: 780 }}
        viewBox="0 0 780 320" preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="lamp-rain" cx="50%" cy="0%" r="70%">
            <stop offset="0%" stopColor="rgba(90,160,110,0.4)" />
            <stop offset="100%" stopColor="rgba(90,160,110,0)" />
          </radialGradient>
        </defs>
        {/* Awning */}
        <path d="M0,90 L780,90 L780,130 L0,130 Z" fill="rgba(12,20,36,0.97)" />
        <path d="M-15,76 L795,76 L795,95 L-15,95 Z" fill="rgba(16,26,45,0.96)" />
        {/* Rain drips from awning edge */}
        {[30,80,130,200,270,340,420,500,580,650,720].map((x, i) => (
          <line key={i} x1={x} y1="130" x2={x+(i%3-1)} y2="145"
            stroke="rgba(140,180,220,0.25)" strokeWidth="0.8" />
        ))}
        {/* Back wall */}
        <rect x="25" y="95" width="730" height="100" fill="rgba(8,14,26,0.95)" />
        {/* Counter */}
        <rect x="55" y="193" width="670" height="10" fill="rgba(10,18,32,0.97)" />
        <rect x="55" y="203" width="670" height="55" fill="rgba(7,12,22,0.97)" />
        {/* Street lamp post */}
        <rect x="370" y="0" width="6" height="95" fill="rgba(15,24,42,0.8)" />
        {/* Lamp glow pool */}
        <ellipse cx="373" cy="200" rx="150" ry="65" fill="url(#lamp-rain)" />
        {/* Poles */}
        <rect x="40" y="130" width="9" height="190" fill="rgba(8,12,22,0.93)" />
        <rect x="731" y="130" width="9" height="190" fill="rgba(8,12,22,0.93)" />
      </svg>

      {/* Wet road */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '6%',
        background: 'linear-gradient(180deg, rgba(8,14,26,0.9) 0%, rgba(5,9,18,1) 100%)',
      }} />

      {/* Road wet reflections */}
      <div style={{
        position: 'absolute', bottom: '1%', left: '44%',
        width: 4, height: '4%',
        background: 'linear-gradient(180deg, transparent, rgba(90,160,110,0.3), transparent)',
        borderRadius: 2,
      }} />
      <div style={{
        position: 'absolute', bottom: '0.5%', left: '25%',
        width: 3, height: '2.5%',
        background: 'linear-gradient(180deg, transparent, rgba(140,180,220,0.15), transparent)',
        borderRadius: 2,
      }} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   SCENE 3 — MIDNIGHT TAPRI
   Near-black, single warm tungsten bulb, sparse stars
────────────────────────────────────────────────────────────── */
function MidnightScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          linear-gradient(180deg,
            #030201 0%,
            #080502 18%,
            #100702 35%,
            #180a03 52%,
            #100702 68%,
            #080502 82%,
            #040201 100%
          )
        `,
      }} />

      {/* Stars — very sparse */}
      {[...Array(32)].map((_, i) => (
        <div key={i} aria-hidden="true" style={{
          position: 'absolute',
          width: i % 4 === 0 ? 1.5 : 1,
          height: i % 4 === 0 ? 1.5 : 1,
          borderRadius: '50%',
          background: `rgba(240,230,200,${0.15 + (i % 5) * 0.07})`,
          top: `${2 + Math.abs(Math.sin(i * 1.7)) * 38}%`,
          left: `${(i * 29 + 11) % 97}%`,
        }} />
      ))}

      {/* Faint Milky Way suggestion */}
      <div style={{
        position: 'absolute',
        top: '5%', left: '20%',
        width: '60%', height: '25%',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(200,185,150,0.04) 0%, transparent 70%)',
        transform: 'rotate(-12deg)',
      }} />

      {/* Distant buildings — barely visible */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', bottom: '33%', left: 0, width: '100%', height: '18%' }}
        viewBox="0 0 1400 130" preserveAspectRatio="none"
      >
        <path fill="rgba(8,4,1,0.88)" d="
          M0,130 L0,80 L60,80 L60,55 L95,55 L95,75 L140,75 L140,40
          L175,40 L175,62 L230,62 L230,80 L290,80 L290,45 L335,45
          L335,66 L390,66 L390,38 L435,38 L435,60 L490,60 L490,78
          L550,78 L550,42 L600,42 L600,65 L660,65 L660,80 L730,80
          L730,48 L775,48 L775,30 L818,30 L818,52 L870,52 L870,72
          L930,72 L930,42 L975,42 L975,60 L1030,60 L1030,80 L1090,80
          L1090,50 L1135,50 L1135,70 L1188,70 L1188,85 L1250,85
          L1250,65 L1300,65 L1300,82 L1400,82 L1400,130 Z
        " />
      </svg>

      {/* Tapri — midnight, minimal warm glow */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '70%', maxWidth: 840 }}
        viewBox="0 0 840 350" preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="bulb-mid" cx="50%" cy="2%" r="65%">
            <stop offset="0%" stopColor="rgba(200,140,35,0.48)" />
            <stop offset="40%" stopColor="rgba(180,110,25,0.22)" />
            <stop offset="100%" stopColor="rgba(180,110,25,0)" />
          </radialGradient>
        </defs>
        {/* Awning */}
        <path d="M0,100 L840,100 L840,140 L0,140 Z" fill="rgba(10,5,1,0.97)" />
        <path d="M-20,86 L860,86 L860,104 L-20,104 Z" fill="rgba(14,7,2,0.97)" />
        {/* Back wall */}
        <rect x="28" y="103" width="784" height="108" fill="rgba(7,3,1,0.96)" />
        {/* Counter */}
        <rect x="55" y="208" width="730" height="12" fill="rgba(10,5,1,0.97)" />
        <rect x="55" y="220" width="730" height="70" fill="rgba(6,3,0,0.98)" />
        {/* Bulb wire */}
        <line x1="420" y1="0" x2="420" y2="86" stroke="rgba(40,20,5,0.45)" strokeWidth="1" />
        {/* Bulb socket */}
        <circle cx="420" cy="88" r="4" fill="rgba(60,32,8,0.8)" />
        {/* Bulb glow — tungsten warm */}
        <ellipse cx="420" cy="210" rx="170" ry="80" fill="url(#bulb-mid)"
          style={{ animation: 'bulb-flicker 5s ease-in-out infinite' }} />
        {/* Poles */}
        <rect x="42" y="140" width="10" height="210" fill="rgba(7,3,1,0.94)" />
        <rect x="788" y="140" width="10" height="210" fill="rgba(7,3,1,0.94)" />
        {/* Shelf items (barely visible in dark) */}
        <rect x="85" y="124" width="160" height="3" fill="rgba(25,12,3,0.7)" />
        {[100, 122, 144].map((x, i) => (
          <ellipse key={i} cx={x} cy="123" rx="7" ry="9" fill="rgba(20,10,2,0.7)" />
        ))}
      </svg>

      {/* Ground */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '5%',
        background: 'linear-gradient(180deg, rgba(8,4,1,0.9) 0%, rgba(4,2,0,1) 100%)',
      }} />

      {/* Ground warm glow streak from bulb */}
      <div style={{
        position: 'absolute', bottom: '4.5%',
        left: '50%', transform: 'translateX(-50%)',
        width: '20%', height: '0.5%',
        background: 'linear-gradient(90deg, transparent, rgba(200,140,35,0.12), transparent)',
        borderRadius: 2,
      }} />
    </div>
  );
}

/* ── CSS scene selector ───────────────────────────────────────── */
function CSSScene({ variant }) {
  if (variant === 'rainy') return <RainyScene />;
  if (variant === 'midnight') return <MidnightScene />;
  return <EveningScene />;
}

/* ── Main component ────────────────────────────────────────── */
export default function BackgroundScene({ sceneId, reducedMotion = false }) {
  const scene = getSceneById(sceneId);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  // Apply scene CSS variables for theming
  useEffect(() => {
    if (!scene?.cssVars) return;
    const root = document.documentElement;
    Object.entries(scene.cssVars).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [scene]);

  // Preload all 3 images to avoid blank frames
  useEffect(() => {
    const urls = [
      '/assets/backgrounds/chai1.jpg',
      '/assets/backgrounds/chai2.jpg',
      '/assets/backgrounds/chai3.jpg'
    ];
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-bg)' }}>
      <AnimatePresence>
        <motion.div
          key={sceneId}
          style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%' }}
          initial={{ opacity: 0, scale: 1.0 }}
          animate={{ opacity: 1, scale: reducedMotion ? 1.0 : 1.08 }}
          exit={{ opacity: 0, scale: reducedMotion ? 1.0 : 1.08 }}
          transition={{
            opacity: { duration: 1.8, ease: 'linear' },
            scale: { duration: 60, ease: 'linear' },
          }}
        >
          {scene?.imageUrl ? (
            /* ─── PHOTO MODE ─── */
            <>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${scene.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: isMobile ? (scene.mobilePosition || 'center') : (scene.desktopPosition || 'center'),
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: scene.overlayColor,
              }} />
            </>
          ) : (
            /* ─── CSS/SVG MODE ─────────────────────────────── */
            <CSSScene variant={scene?.variant ?? 'evening'} />
          )}

          {/* Cinematic vignette — lightened */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.30) 100%)',
            pointerEvents: 'none',
          }} />

          {/* Bottom fade — lightened smooth floor blend */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '18%',
            background: 'linear-gradient(0deg, rgba(15,8,4,0.40) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Ambient particles */}
      <AmbientLayer scene={scene} reducedMotion={reducedMotion} />
    </div>
  );
}
