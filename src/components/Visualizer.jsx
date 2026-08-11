import React from 'react';
import { motion } from 'framer-motion';

export default function Visualizer({ isPlaying }) {
  // We simulate 12 frequency bars
  const bars = Array.from({ length: 24 });

  return (
    <div style={{
      position: 'absolute',
      bottom: '22%',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: '4px',
      height: '60px',
      opacity: isPlaying ? 0.35 : 0,
      transition: 'opacity 0.8s ease',
      pointerEvents: 'none',
      zIndex: 2,
    }}>
      {bars.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: isPlaying 
              ? [`${10 + Math.random() * 20}px`, `${20 + Math.random() * 40}px`, `${10 + Math.random() * 20}px`]
              : '4px'
          }}
          transition={{
            duration: 0.4 + Math.random() * 0.4,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: Math.random() * 0.5
          }}
          style={{
            width: '4px',
            backgroundColor: '#FFF4DF',
            borderRadius: '2px',
            transformOrigin: 'bottom',
            boxShadow: '0 0 8px rgba(255, 244, 223, 0.5)',
          }}
        />
      ))}
    </div>
  );
}
