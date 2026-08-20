/**
 * MusicPlayer.jsx
 *
 * Pill-shaped glassmorphic player inspired by the provided reference image.
 * Syncs directly with the YouTube iframe state.
 */

import React from 'react';
import { motion } from 'framer-motion';

// SVG Icons
const ShuffleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8"></polyline>
    <line x1="4" y1="20" x2="21" y2="3"></line>
    <polyline points="21 16 21 21 16 21"></polyline>
    <line x1="15" y1="15" x2="21" y2="21"></line>
    <line x1="4" y1="4" x2="9" y2="9"></line>
  </svg>
);

const PrevIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
  </svg>
);

const NextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 3 }}>
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

const PlaylistIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 15h14v-2H3v2zm0 4h14v-2H3v2zm0-8h14V9H3v2zm16-6v4.01h-2V7h-4v2h4v4.01h2V11h2V7h-2z"/>
  </svg>
);

export default function MusicPlayer({
  isReady,
  isPlaying,
  currentSong,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onPrev,
  onSeek
}) {
  const [isSeeking, setIsSeeking] = React.useState(false);
  const [seekValue, setSeekValue] = React.useState(0);

  if (!isReady) return null;

  const displayTime = isSeeking ? seekValue : (currentTime || 0);
  const progressPct = duration > 0 ? (displayTime / duration) * 100 : 0;
  
  const handleSeekChange = (e) => {
    setIsSeeking(true);
    setSeekValue(parseFloat(e.target.value));
  };
  
  const handleSeekEnd = (e) => {
    setIsSeeking(false);
    onSeek?.(parseFloat(e.target.value));
  };
  
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const thumbnailUrl = currentSong?.youtubeId 
    ? `https://i.ytimg.com/vi/${currentSong.youtubeId}/hqdefault.jpg`
    : null;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px 12px 12px',
        background: 'rgba(125, 45, 35, 0.7)', // Reddish-brown translucent
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '9999px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        gap: '24px',
      }}
    >
      {/* Left side: Artwork and Track Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
        
        <style>
          {`
            @keyframes vinylSpin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .seek-slider {
              -webkit-appearance: none;
              appearance: none;
              background: transparent;
            }
            .seek-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 12px;
              height: 12px;
              background: #FFF;
              border-radius: 50%;
              cursor: pointer;
              box-shadow: 0 1px 3px rgba(0,0,0,0.4);
              opacity: 0;
              transition: opacity 0.2s;
            }
            .seek-slider:hover::-webkit-slider-thumb,
            .seek-slider:active::-webkit-slider-thumb {
              opacity: 1;
            }
            .seek-slider::-moz-range-thumb {
              width: 12px;
              height: 12px;
              background: #FFF;
              border-radius: 50%;
              cursor: pointer;
              box-shadow: 0 1px 3px rgba(0,0,0,0.4);
              border: none;
              opacity: 0;
              transition: opacity 0.2s;
            }
            .seek-slider:hover::-moz-range-thumb,
            .seek-slider:active::-moz-range-thumb {
              opacity: 1;
            }
          `}
        </style>
        {/* Spinning Vinyl Artwork */}
        <div style={{ position: 'relative', width: 68, height: 68, flexShrink: 0 }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              background: '#111',
              animation: 'vinylSpin 4s linear infinite',
              animationPlayState: isPlaying ? 'running' : 'paused'
            }}
          >
            {thumbnailUrl && (
              <img 
                src={thumbnailUrl} 
                alt="album art" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            
            {/* Vinyl Center Hole */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#222', 
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
            }} />
          </div>
        </div>

        {/* Text and Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, gap: '4px' }}>
          <h3 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {currentSong?.title || "Radio Tune Ho Raha Hai..."}
          </h3>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {currentSong?.artist || "Chai Tapri"}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '4px', gap: '4px' }}>
            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={displayTime}
              onChange={handleSeekChange}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              onKeyUp={(e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                  handleSeekEnd(e);
                }
              }}
              style={{
                width: '100%',
                height: '4px',
                background: `linear-gradient(to right, rgba(255, 255, 255, 0.5) ${progressPct}%, rgba(255, 255, 255, 0.2) ${progressPct}%)`,
                borderRadius: '2px',
                outline: 'none',
                cursor: 'pointer',
                touchAction: 'none'
              }}
              className="seek-slider"
              aria-label="Seek progress"
            />
            
            {/* Time */}
            <span style={{ 
              fontSize: '10px', 
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: 'monospace'
            }}>
              {formatTime(displayTime)} / {formatTime(duration || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        
        {/* Prev */}
        <button 
          onClick={onPrev}
          style={{
            background: 'none', border: 'none', padding: 4,
            color: '#FFF', cursor: 'pointer',
            opacity: 0.7, transition: 'opacity 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.opacity = 1}
          onMouseOut={e => e.currentTarget.style.opacity = 0.7}
        >
          <PrevIcon />
        </button>
        
        {/* Play/Pause */}
        <button 
          onClick={onPlayPause}
          style={{
            background: '#FFFFFF',
            border: 'none',
            width: 48, height: 48,
            borderRadius: '50%',
            color: '#000000',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.1s'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        
        {/* Next */}
        <button 
          onClick={onNext}
          style={{
            background: 'none', border: 'none', padding: 4,
            color: '#FFF', cursor: 'pointer',
            opacity: 0.7, transition: 'opacity 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.opacity = 1}
          onMouseOut={e => e.currentTarget.style.opacity = 0.7}
        >
          <NextIcon />
        </button>
      </div>
    </motion.div>
  );
}
