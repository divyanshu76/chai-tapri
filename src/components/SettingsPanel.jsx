/**
 * SettingsPanel.jsx — v2
 * Clean minimal settings. Playlist IDs completely removed from UI.
 * Only user-facing controls: Ambient, Shayari, Reduced Motion.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X } from 'lucide-react';

function Toggle({ value, onToggle, label }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={value}
      aria-label={label}
      style={{
        width: 30,
        height: 16,
        borderRadius: 8,
        border: '1px solid',
        borderColor: value ? 'rgba(212,168,86,0.45)' : 'rgba(212,168,86,0.15)',
        background: value ? 'rgba(212,168,86,0.25)' : 'rgba(28,18,8,0.4)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.25s, border-color 0.25s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        top: 2,
        left: value ? 14 : 2,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: value ? 'var(--c-warm)' : 'rgba(180,150,100,0.35)',
        transition: 'left 0.22s, background 0.22s',
      }} />
    </button>
  );
}

function Row({ label, children }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
    }}>
      <span style={{
        fontSize: '0.58rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--c-cream)',
        opacity: 0.5,
        fontFamily: 'var(--font-sans)',
      }}>
        {label}
      </span>
      {children}
    </div>
  );
}

export default function SettingsPanel({
  ambientEnabled,
  onToggleAmbient,
  ambientVolume,
  onAmbientVolumeChange,
  chaiVolume,
  onChaiVolumeChange,
  reducedMotion,
  onReducedMotionChange,
  shayariEnabled,
  onShayariEnabledChange,
  weatherOverride,
  onWeatherOverrideChange,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Gear button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ rotate: 45, scale: 1.1, opacity: 0.7 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.25 }}
        aria-label="Open settings"
        style={{ color: 'var(--c-cream)', opacity: 0.3 }}
      >
        <Settings size={15} strokeWidth={1.4} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                zIndex: 'var(--z-modal)',
                background: 'rgba(5,2,1,0.35)',
                backdropFilter: 'blur(2px)',
              }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'fixed',
                top: '3rem',
                right: '1rem',
                zIndex: 'calc(var(--z-modal) + 1)',
                width: 'min(88vw, 240px)',
                background: 'rgba(20,11,4,0.96)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                border: '1px solid rgba(212,168,86,0.12)',
                borderRadius: 10,
                padding: '1.1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.9rem',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--c-warm)',
                  opacity: 0.65,
                  fontFamily: 'var(--font-sans)',
                }}>
                  Settings
                </span>
                <button onClick={() => setOpen(false)} aria-label="Close settings"
                  style={{ color: 'var(--c-cream)', opacity: 0.35 }}>
                  <X size={13} />
                </button>
              </div>

              <div style={{ height: 1, background: 'rgba(212,168,86,0.08)' }} />

              {/* Ambient sound */}
              <Row label="Ambient Sound">
                <Toggle value={ambientEnabled} onToggle={onToggleAmbient} label="Toggle ambient sound" />
              </Row>

              {/* Ambient volume slider */}
              <AnimatePresence>
                {ambientEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <span style={{
                        fontSize: '0.52rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--c-cream)',
                        opacity: 0.32,
                        fontFamily: 'var(--font-sans)',
                      }}>
                        Ambient Volume
                      </span>
                      <input
                        type="range"
                        min={0} max={1} step={0.05}
                        value={ambientVolume}
                        onChange={(e) => onAmbientVolumeChange(Number(e.target.value))}
                        aria-label="Ambient volume"
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chai Sound volume slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span style={{
                  fontSize: '0.52rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--c-cream)',
                  opacity: 0.32,
                  fontFamily: 'var(--font-sans)',
                }}>
                  Chai Sound Volume
                </span>
                <input
                  type="range"
                  min={0} max={1} step={0.05}
                  value={chaiVolume}
                  onChange={(e) => onChaiVolumeChange(Number(e.target.value))}
                  aria-label="Chai Sound volume"
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>

              {/* Shayari */}
              <Row label="Shayari">
                <Toggle value={shayariEnabled} onToggle={() => onShayariEnabledChange(!shayariEnabled)} label="Toggle shayari" />
              </Row>

              {/* Reduced motion */}
              <Row label="Reduce Motion">
                <Toggle value={reducedMotion} onToggle={() => onReducedMotionChange(!reducedMotion)} label="Toggle reduced motion" />
              </Row>

              {/* Weather Override */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{
                  fontSize: '0.52rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--c-cream)',
                  opacity: 0.32,
                  fontFamily: 'var(--font-sans)',
                }}>
                  Atmosphere
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['auto', 'rain', 'dust'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => onWeatherOverrideChange(opt)}
                      style={{
                        flex: 1,
                        padding: '4px 0',
                        fontSize: '0.55rem',
                        textTransform: 'uppercase',
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: weatherOverride === opt ? 'rgba(212,168,86,0.45)' : 'rgba(212,168,86,0.15)',
                        background: weatherOverride === opt ? 'rgba(212,168,86,0.25)' : 'rgba(28,18,8,0.4)',
                        color: weatherOverride === opt ? 'var(--c-warm)' : 'rgba(180,150,100,0.45)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: 'rgba(212,168,86,0.06)' }} />

              <div style={{
                fontSize: '0.48rem',
                color: 'var(--c-cream)',
                opacity: 0.18,
                textAlign: 'center',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.06em',
              }}>
                Chai Tapri Radio · v2
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
