/**
 * App.jsx — Chai Tapri Radio v2
 *
 * Layout: warm cream/chai-brown composition
 * - Full-screen background with parallax
 * - Top bar: branding ← → time + settings
 * - Center: Radio ON AIR indicator + MusicPlayer (unified)
 * - Bottom: Shayari (left) ← → ChaiGlass + interactive items (right)
 * - Bulb brightness control (no dark mode)
 * - Proper mobile layout at 375px
 */

import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import BackgroundScene from './components/BackgroundScene';
import AmbientLayer from './components/AmbientLayer';
import FilmGrain from './components/FilmGrain';
import IntroScreen from './components/IntroScreen';
import MusicPlayer from './components/MusicPlayer';
import Radio from './components/Radio';
import ChaiGlass from './components/ChaiGlass';
import TimeDisplay from './components/TimeDisplay';
import SettingsPanel from './components/SettingsPanel';
import ToastMessage from './components/ToastMessage';
import Shayari from './components/Shayari';

import { useShayariLoop } from './hooks/useShayariLoop';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { songIndexToSceneId } from './data/scenes';
import { tapriNews, shayariPool } from './data/shayari';

/* ── Helpers ─────────────────────────────────────────────────── */
const randomTapriNews = () => tapriNews[Math.floor(Math.random() * tapriNews.length)];

const BENCH_QUOTES = [
  'Yahan baithne waale sab sukoon dhoondh rahe hain.',
  'Is bench ne hazaron kahaniyan suni hain.',
  'Thak gaye ho? Baith jao. Chai aati hai.',
  'Ek bench, kai rishte, ek hi chai.',
];

/* ── System reduced motion ───────────────────────────────────── */
function useSystemReducedMotion() {
  const [rm, setRm] = useState(
    () => typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const h = () => setRm(mq.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return rm;
}

/* ── Window Size Hook ────────────────────────────────────────── */
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
}

/* ── Smooth parallax ─────────────────────────────────────────── */
function useParallax(enabled) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const frame = useRef(null);
  const raw = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const handle = (e) => {
      raw.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handle, { passive: true });
    const tick = () => {
      setPos((p) => ({
        x: p.x + (raw.current.x - p.x) * 0.05,
        y: p.y + (raw.current.y - p.y) * 0.05,
      }));
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', handle);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [enabled]);

  return pos;
}

/* ── Bulb brightness overlay ─────────────────────────────────── */
function BulbOverlay({ brightness }) {
  // brightness: 1 = normal, 0.7 = dim
  if (brightness >= 1) return null;
  const alpha = (1 - brightness) * 0.28;
  return (
    <div aria-hidden="true" style={{
      position: 'fixed', inset: 0,
      zIndex: 9,
      background: `rgba(5,2,0,${alpha})`,
      pointerEvents: 'none',
      transition: 'background 0.7s ease',
    }} />
  );
}

/* ── Main ────────────────────────────────────────────────────── */
export default function App() {
  const systemRM = useSystemReducedMotion();
  const [userRM, setUserRM] = useState(false);
  const reducedMotion = systemRM || userRM;
  const parallax = useParallax(!reducedMotion);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const [entered, setEntered] = useState(false);
  const [sceneId, setSceneId] = useState(1);
  const [shayariEnabled, setShayariEnabled] = useState(true);
  const [weatherOverride, setWeatherOverride] = useState('auto'); // 'auto', 'rain', 'dust'
  const [bulbBrightness, setBulbBrightness] = useState(1);
  const [chaiVolume, setChaiVolume] = useState(0.70);
  const [toast, setToast] = useState({ message: null, visible: false, position: 'bottom-left' });
  const toastTimer = useRef(null);

  /* ── Ambient audio ─────────────────────────────────────────── */
  const {
    isEnabled: ambientEnabled,
    ambientVolume,
    toggleAmbient,
    setAmbientScene,
    setAmbientVolume,
    playStaticBurst,
    playChaiClink,
    onMusicPause,
    onMusicPlay,
  } = useAmbientAudio();

  /* ── Shayari Loop ──────────────────────────────────────────── */
  const { currentShayari, triggerNewShayari } = useShayariLoop({
    shayariPool,
    interval: 5000
  });

  /* ── Song change (Centralized Handler) ─────────────────────── */
  const handleTrackChange = useCallback((index) => {
    playStaticBurst();
    const nextScene = songIndexToSceneId(index);
    setSceneId(nextScene);
    // setSongIndex(index);
    const sceneToAudio = { 1: 'evening', 2: 'rain', 3: 'midnight' };
    setAmbientScene(sceneToAudio[nextScene] ?? 'evening');
    
    // Immediately trigger a new shayari when song changes
    triggerNewShayari();
  }, [playStaticBurst, setAmbientScene, triggerNewShayari]);

  /* ── YouTube player ────────────────────────────────────────── */
  const {
    isReady, isPlaying, currentSong, currentIndex,
    currentTime, duration, playerState, volume, error,
    togglePlay, nextTrack, prevTrack, seekTo, setVolume,
  } = useYouTubePlayer({
    onSongChange: handleTrackChange,
    enabled: true, // MUST be true so it can initialize and set isReady=true
  });

  /* ── Sync ambient ↔ music ──────────────────────────────────── */
  useEffect(() => {
    if (!entered) return;
    if (isPlaying) onMusicPlay();
    else onMusicPause();
  }, [isPlaying, entered, onMusicPlay, onMusicPause]);

  /* ── Toast ─────────────────────────────────────────────────── */
  const showToast = useCallback((message, position = 'bottom-left', dur = 3200) => {
    clearTimeout(toastTimer.current);
    setToast({ message, visible: true, position });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })), dur
    );
  }, []);

  /* ── Enter ─────────────────────────────────────────────────── */
  const handleEnter = useCallback(() => {
    setEntered(true);
    setAmbientScene('evening');
  }, [setAmbientScene]);

  /* ── Interactive env elements ──────────────────────────────── */
  const handleBulbClick = useCallback(() => {
    setBulbBrightness((b) => {
      const next = b >= 1 ? 0.68 : 1;
      if (next < 1) showToast('Roshni thodi kam kar di…', 'top-center', 2200);
      return next;
    });
  }, [showToast]);

  const handleBenchClick = useCallback(() => {
    showToast(
      BENCH_QUOTES[Math.floor(Math.random() * BENCH_QUOTES.length)],
      'bottom-left', 3000
    );
  }, [showToast]);

  const handleNewspaperClick = useCallback(() => {
    showToast(randomTapriNews(), 'bottom-left', 4000);
  }, [showToast]);

  /* ── Keyboard shortcuts ────────────────────────────────────── */
  useEffect(() => {
    const h = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.code === 'ArrowRight' && e.shiftKey) nextTrack();
      if (e.code === 'ArrowLeft' && e.shiftKey) prevTrack();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [togglePlay, nextTrack, prevTrack]);

  /* ── Parallax transforms ───────────────────────────────────── */
  const bgStyle = useMemo(() => ({
    position: 'absolute', inset: '-3%',
    transform: reducedMotion ? 'none'
      : `translate(${parallax.x * -5}px, ${parallax.y * -5}px) scale(1.02)`,
    transition: 'transform 0.1s linear',
  }), [parallax, reducedMotion]);

  const fgStyle = useMemo(() => ({
    transform: reducedMotion ? 'none'
      : `translate(${parallax.x * 2.5}px, ${parallax.y * 2.5}px)`,
    transition: 'transform 0.1s linear',
  }), [parallax, reducedMotion]);

  /* ══════════════════════════════════════════════════════════ */
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Hidden YouTube container */}
      <div id="yt-player" style={{ display: 'none' }} />

      {/* ── Background & Ambient Layer ── */}
      <div style={bgStyle}>
        <BackgroundScene sceneId={sceneId} reducedMotion={reducedMotion} weatherOverride={weatherOverride} />
      </div>

      {/* ── Bulb brightness overlay ───────────────────────── */}
      <BulbOverlay brightness={bulbBrightness} />

      {/* ── Film grain ────────────────────────────────────── */}
      <FilmGrain intensity={0.038} />

      {/* ── Main UI ───────────────────────────────────────── */}
      <AnimatePresence>
        {entered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 'var(--z-ui)',
              display: 'flex',
              flexDirection: 'column',
              padding: 'clamp(0.8rem, 2.5vw, 1.6rem)',
              ...fgStyle,
            }}
          >
            {/* ── Top bar ─────────────────────────────────── */}
            <header style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              {/* Branding */}
              <div style={{
                background: 'rgba(28,18,8,0.2)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                padding: '8px 12px',
                borderRadius: '12px',
                border: '1px solid rgba(255,244,223,0.1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.2rem',
                }}>
                  <span style={{
                    fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
                    filter: `brightness(${bulbBrightness}) drop-shadow(0 0 6px rgba(180,120,25,${0.6 * bulbBrightness}))`,
                    transition: 'filter 0.7s',
                  }} aria-hidden="true">☕</span>
                  <span style={{
                    fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: '#FFF4DF',
                    opacity: 0.95,
                    fontFamily: 'var(--font-sans)',
                    textShadow: '0 1px 4px rgba(0,0,0,0.6)'
                  }}>
                    Chai Tapri Radio
                  </span>
                  <div style={{ marginLeft: '1rem' }}>
                    <Radio playerState={playerState} isPlaying={isPlaying} onToggle={togglePlay} />
                  </div>
                </div>
                <div style={{
                  fontSize: 'clamp(0.5rem, 1.4vw, 0.6rem)',
                  fontFamily: 'var(--font-deva)',
                  color: '#FFF4DF',
                  opacity: 0.8,
                  letterSpacing: '0.03em',
                  paddingLeft: 'calc(clamp(0.9rem, 2.2vw, 1.1rem) + 0.5rem + 2px)',
                  textShadow: '0 1px 4px rgba(0,0,0,0.6)'
                }}>
                  Ek chai. Ek gaana. Ek kahaani.
                </div>
              </div>

              {/* Time + Settings */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <TimeDisplay />
                <SettingsPanel
                  ambientEnabled={ambientEnabled}
                  onToggleAmbient={toggleAmbient}
                  ambientVolume={ambientVolume}
                  onAmbientVolumeChange={setAmbientVolume}
                  chaiVolume={chaiVolume}
                  onChaiVolumeChange={setChaiVolume}
                  reducedMotion={userRM}
                  onReducedMotionChange={setUserRM}
                  shayariEnabled={shayariEnabled}
                  onShayariEnabledChange={setShayariEnabled}
                  weatherOverride={weatherOverride}
                  onWeatherOverrideChange={setWeatherOverride}
                />
              </div>
            </header>

            {/* ── Center: Empty to emphasize background ─────────────────── */}
            <main style={{
              flex: 1,
              pointerEvents: 'none',
            }}>
            </main>

            {/* ── Bottom bar ──────────────────────────────── */}
            <footer style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: isMobile ? '0 12px calc(12px + env(safe-area-inset-bottom))' : '0 clamp(1.2rem, 3vw, 2.5rem) clamp(28px, 4vh, 36px)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              pointerEvents: 'none',
              zIndex: 'var(--z-top-ui)',
            }}>
              {/* Bottom-left: env items */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
                pointerEvents: 'auto',
                marginBottom: isMobile ? '90px' : 0, 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  {/* Bulb */}
                  <motion.button
                    onClick={handleBulbClick}
                    whileHover={{ scale: 1.14 }}
                    whileTap={{ scale: 0.88 }}
                    aria-label="Toggle bulb brightness"
                    title="Bulb"
                    style={{
                      fontSize: 'clamp(0.9rem, 2.2vw, 1.05rem)',
                      filter: `brightness(${bulbBrightness}) drop-shadow(0 0 ${bulbBrightness >= 1 ? 8 : 2}px rgba(200,140,30,${bulbBrightness >= 1 ? 0.65 : 0.2}))`,
                      transition: 'filter 0.65s',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >💡</motion.button>
                </div>

                {/* Instagram Handle */}
                <motion.a
                  href="https://www.instagram.com/truly_divyanshu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram — @truly_divyanshu"
                  whileHover={{ scale: 1.05, y: -2, opacity: 1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    color: '#FFF4DF',
                    opacity: 0.85,
                    fontSize: '13px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 400,
                    textShadow: '0 1px 4px rgba(60,30,10,0.6)',
                    padding: '4px 0',
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.textDecoration = 'underline'; }}
                  onBlur={(e) => { e.currentTarget.style.opacity = 0.85; e.currentTarget.style.textDecoration = 'none'; }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  @truly_divyanshu
                </motion.a>
              </div>

              {/* Bottom Center: Bottom-Stage (Shayari + Player) */}
              <div style={{
                position: 'absolute',
                left: '50%',
                bottom: isMobile ? 'calc(12px + env(safe-area-inset-bottom))' : 'clamp(28px, 4vh, 36px)',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: isMobile ? '16px' : '24px',
                width: isMobile ? 'calc(100vw - 24px)' : '100%',
                maxWidth: '680px',
                pointerEvents: 'none',
              }}>
                <div style={{ zIndex: 'var(--z-shayari)', width: '100%' }}>
                  <Shayari currentShayari={currentShayari} enabled={shayariEnabled} />
                </div>
                
                <div style={{ zIndex: 'var(--z-player)', width: '100%', pointerEvents: 'auto' }}>
                  <MusicPlayer
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    isReady={isReady}
                    onPlayPause={togglePlay}
                    onNext={nextTrack}
                    onPrev={prevTrack}
                  />
                </div>
              </div>

              {/* Bottom-right: chai */}
              <div style={{
                pointerEvents: 'auto',
                marginBottom: isMobile ? '100px' : 0, // Lift above player on mobile safely
                background: 'rgba(28,18,8,0.3)',
                padding: '8px',
                borderRadius: '50%',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 244, 223, 0.15)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ChaiGlass onClink={playChaiClink} volume={chaiVolume} />
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Intro ─────────────────────────────────────────── */}
      <AnimatePresence>
        {!entered && <IntroScreen key="intro" onEnter={handleEnter} isReady={isReady} />}
      </AnimatePresence>

      {/* ── Toast ─────────────────────────────────────────── */}
      <ToastMessage
        message={toast.message}
        visible={toast.visible}
        position={toast.position}
      />
    </div>
  );
}
