/**
 * ChaiGlass.jsx — v2
 *
 * Signature interaction:
 * Click → jiggle + steam + cup clink sound + voice audio + quote
 *
 * Audio architecture:
 * Each quote has a paired audio path (from shayari.js).
 * Audio plays via HTML Audio element. Falls back silently if file missing.
 * Replace /public/audio/*.mp3 files with real voice recordings at any time.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chaiQuotes } from '../data/shayari';

const STEAM_COUNT = 4;

// Persistent audio object to avoid recreating on every render
let chaiSoundAudio = null;

function getChaiSound() {
  if (typeof window === 'undefined') return null;
  if (!chaiSoundAudio) {
    chaiSoundAudio = new Audio('/audio/chai/freesound_community-tea-92800.mp3');
    chaiSoundAudio.preload = 'auto';
    chaiSoundAudio.volume = 0.70;
  }
  return chaiSoundAudio;
}

export default function ChaiGlass({ onClink, volume = 0.70 }) {
  useEffect(() => {
    const sound = getChaiSound();
    if (sound) sound.volume = volume;
  }, [volume]);
  const [animating, setAnimating] = useState(false);
  const [steamVisible, setSteamVisible] = useState(false);
  const [activeQuote, setActiveQuote] = useState(null);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const lastIdxRef = useRef(-1);

  const handleClick = useCallback(() => {
    if (animating) return;

    // Pick quote (avoid repeat)
    const available = chaiQuotes.filter((_, i) => i !== lastIdxRef.current);
    const idx = Math.floor(Math.random() * available.length);
    const quote = available[idx];
    lastIdxRef.current = chaiQuotes.indexOf(quote);

    // Visual
    setAnimating(true);
    setSteamVisible(true);
    setActiveQuote(quote.text);
    setQuoteVisible(true);

    // Audio — play the chai sound effect
    onClink?.(); // Web Audio clink from hook
    const sound = getChaiSound();
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {}); // Fail silently if blocked
    }

    // Reset
    setTimeout(() => setAnimating(false), 500);
    setTimeout(() => setSteamVisible(false), 2200);
    setTimeout(() => setQuoteVisible(false), 3800);
  }, [animating, onClink]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', position: 'relative' }}>

      {/* Quote popup — warm cream, no box */}
      <AnimatePresence>
        {quoteVisible && activeQuote && (
          <motion.div
            key={activeQuote}
            initial={{ opacity: 0, y: 5, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              bottom: '120%',
              right: 0,
              background: 'rgba(28,18,8,0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(212,168,86,0.18)',
              borderRadius: 6,
              padding: '0.4rem 0.7rem',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-deva)',
              fontWeight: 300,
              color: 'var(--c-cream)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              letterSpacing: '0.01em',
            }}
          >
            {activeQuote}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steam wisps */}
      <div style={{
        position: 'absolute',
        bottom: '95%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 44, height: 50,
        pointerEvents: 'none',
        overflow: 'visible',
      }}>
        <AnimatePresence>
          {steamVisible && [...Array(STEAM_COUNT)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 0, x: 0, scaleX: 1 }}
              animate={{
                opacity: [0, 0.55, 0.35, 0],
                y: -38,
                x: (i % 2 === 0 ? 6 : -6) * (i + 1) * 0.4,
                scaleX: [1, 1.5, 0.8],
              }}
              transition={{ duration: 1.4, delay: i * 0.18, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: `${18 + i * 8}%`,
                bottom: 0,
                width: 3,
                height: 14,
                borderRadius: 3,
                background: 'rgba(210,190,155,0.6)',
                filter: 'blur(2.5px)',
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Chai glass button */}
      <motion.button
        onClick={handleClick}
        animate={animating ? {
          x: [0, -2.5, 2.5, -1.5, 1.5, 0],
          rotate: [0, -1, 1, -0.5, 0.5, 0],
          transition: { duration: 0.45, ease: 'easeInOut' },
        } : {}}
        whileHover={{ scale: 1.08, filter: 'drop-shadow(0 0 12px rgba(255,244,223,0.6))' }}
        whileTap={{ scale: 0.92 }}
        aria-label="Play chai sound"
        style={{
          width: 'clamp(38px, 5vw, 52px)',
          cursor: 'pointer',
          border: 'none',
          background: 'none',
          padding: 0,
          display: 'block',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
          transition: 'filter 0.3s',
        }}
      >
        {/* SVG chai glass */}
        <svg viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}>
          {/* Glass body */}
          <path d="M9,16 L13,48 L31,48 L35,16 Z"
            fill="rgba(255,244,223,0.15)"
            stroke="rgba(255,244,223,0.8)" strokeWidth="1.2" />
          {/* Chai fill */}
          <path d="M10.5,26 L13,48 L31,48 L33.5,26 Z"
            fill="rgba(160,82,22,0.85)" />
          {/* Rim */}
          <line x1="9" y1="16" x2="35" y2="16"
            stroke="rgba(255,244,223,0.9)" strokeWidth="1.5" />
          {/* Saucer */}
          <ellipse cx="22" cy="49.5" rx="14" ry="2.5"
            fill="rgba(70,38,10,0.6)"
            stroke="rgba(255,244,223,0.6)" strokeWidth="0.9" />
          {/* Glass shine */}
          <line x1="12" y1="20" x2="12" y2="42"
            stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
        </svg>
      </motion.button>

      <span style={{
        fontSize: '0.5rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: '#FFF4DF',
        opacity: 0.9,
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        textShadow: '0 1px 4px rgba(0,0,0,0.6)'
      }}>
        Ek Chai
      </span>
    </div>
  );
}
