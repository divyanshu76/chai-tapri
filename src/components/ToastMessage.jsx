/**
 * ToastMessage.jsx — v2
 * Minimal warm-cream toast, bottom-left default.
 */

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const POSITIONS = {
  'bottom-left':   { bottom: '1.5rem', left: '1.5rem' },
  'bottom-right':  { bottom: '1.5rem', right: '1.5rem' },
  'top-center':    { top: '1.5rem', left: '50%', transform: 'translateX(-50%)' },
  'bottom-center': { bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)' },
};

export default function ToastMessage({ message, visible, position = 'bottom-left' }) {
  const posStyle = POSITIONS[position] ?? POSITIONS['bottom-left'];

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="alert"
          aria-live="polite"
          style={{
            position: 'fixed',
            zIndex: 'var(--z-toast)',
            ...posStyle,
            maxWidth: 'min(80vw, 280px)',
            background: 'rgba(20,11,4,0.9)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(212,168,86,0.14)',
            borderRadius: 6,
            padding: '0.45rem 0.8rem',
            fontFamily: 'var(--font-deva)',
            fontSize: 'clamp(0.68rem, 2vw, 0.78rem)',
            fontWeight: 300,
            color: 'var(--c-cream)',
            lineHeight: 1.55,
            letterSpacing: '0.01em',
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
