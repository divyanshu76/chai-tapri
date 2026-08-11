/**
 * Shayari.jsx — v2
 * Ambient thought that appears in the environment. No box, no notification.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { shayariPool, randomFrom } from '../data/shayari';

export default function Shayari({ currentShayari, enabled = true }) {
  if (!enabled || !currentShayari) return null;

  return (
    <div
      style={{ pointerEvents: 'none', minWidth: 0, textAlign: 'center', marginTop: '1rem' }}
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentShayari}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <p style={{
              fontFamily: 'var(--font-shayari)',
              fontSize: 'clamp(1rem, 3.5vw, 1.4rem)',
              fontWeight: 400,
              lineHeight: 1.4,
              color: '#FFFFFF', // Pure white
              opacity: 1,
              whiteSpace: 'pre-line',
              textShadow: '0 2px 12px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.6)', // Strong shadow for contrast
              display: '-webkit-box',
              WebkitLineClamp: typeof window !== 'undefined' && window.innerWidth <= 768 ? 3 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {currentShayari}
            </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
