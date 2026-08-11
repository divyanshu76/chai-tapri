/**
 * Radio.jsx — v2
 * Small decorative indicator integrated with the player.
 * Shows ON AIR / PAUSED with LED pulse.
 */

import React from 'react';
import { motion } from 'framer-motion';

export default function Radio({ playerState, isPlaying, onToggle }) {
  let statusText = 'READY';
  let isPlayingLED = false;
  let isBuffering = false;

  if (playerState === 1) { statusText = 'ON AIR'; isPlayingLED = true; }
  else if (playerState === 2) { statusText = 'PAUSED'; }
  else if (playerState === 3) { statusText = 'BUFFERING'; isBuffering = true; }
  else { statusText = 'READY'; }

  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        padding: 0,
      }}
    >
      {/* LED dot */}
      <span style={{
        display: 'inline-block',
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: isPlayingLED ? 'var(--c-warm)' : 'transparent',
        border: `1px solid ${isPlayingLED || isBuffering ? 'var(--c-warm)' : 'rgba(212,168,86,0.2)'}`,
        boxShadow: isPlayingLED ? '0 0 6px rgba(212,168,86,0.7)' : 'none',
        flexShrink: 0,
        animation: isPlayingLED ? 'led-pulse 2.2s ease-in-out infinite' : isBuffering ? 'led-pulse 1s ease-in-out infinite' : 'none',
        transition: 'background 0.4s, box-shadow 0.4s',
      }} />

      {/* Status text */}
      <span style={{
        fontSize: '0.5rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-sans)',
        fontWeight: 400,
        color: isPlayingLED ? 'var(--c-warm)' : 'rgba(232,217,188,0.28)',
        transition: 'color 0.4s',
      }}>
        {statusText}
      </span>
    </motion.button>
  );
}
