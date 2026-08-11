/**
 * IntroScreen.jsx — v2
 * Light cream intro gate, state-driven (waits for YouTube readiness).
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroScreen({ isReady, onEnter }) {
  const [showTapPrompt, setShowTapPrompt] = useState(false);

  useEffect(() => {
    // If YouTube is ready, we show the prompt to tap to enter
    // This handles any autoplay restrictions gracefully
    if (isReady) {
      const timer = setTimeout(() => {
        setShowTapPrompt(true);
      }, 300); // Small delay to ensure smooth transition
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-intro)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--c-bg)', // Warm cream
        gap: 0,
        padding: '2rem',
        cursor: showTapPrompt ? 'pointer' : 'default',
      }}
      onClick={() => {
        if (showTapPrompt) onEnter();
      }}
    >
      {/* Cup emoji */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontSize: 'clamp(2rem, 5vw, 2.6rem)',
          marginBottom: '1rem',
          filter: 'drop-shadow(0 4px 12px rgba(107, 74, 53, 0.15))',
        }}
      >
        ☕
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--c-deep)',
          textAlign: 'center',
          marginBottom: '0.3rem',
        }}
      >
        Chai Tapri Radio
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          fontFamily: 'var(--font-deva)',
          fontSize: 'clamp(0.75rem, 2.2vw, 0.9rem)',
          color: 'var(--c-brown-mid)',
          opacity: 0.85,
          letterSpacing: '0.04em',
          textAlign: 'center',
          marginBottom: 'clamp(2rem, 5vh, 3rem)',
        }}
      >
        Ek chai. Ek gaana. Ek kahaani.
      </motion.p>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 'clamp(40px, 10vw, 80px)',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(139, 107, 82, 0.3), transparent)',
          marginBottom: 'clamp(2rem, 5vh, 3rem)',
        }}
      />

      {/* Status indicator */}
      <div style={{ height: '30px' }}>
        <AnimatePresence mode="wait">
          {!showTapPrompt ? (
            <motion.p
              key="loading"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.85rem',
                color: 'var(--c-brown-mid)',
                opacity: 0.7,
                animation: 'pulse 1.5s infinite',
              }}
            >
              Tapri khul rahi hai...
            </motion.p>
          ) : (
            <motion.p
              key="ready"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--c-brown)',
                background: 'rgba(107, 74, 53, 0.08)',
                padding: '0.4rem 1.2rem',
                borderRadius: '20px',
                border: '1px solid rgba(107, 74, 53, 0.15)',
              }}
            >
              Radio ko ek tap chahiye.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}} />
    </motion.div>
  );
}
