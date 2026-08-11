/**
 * TimeDisplay.jsx — v2
 * Cleaner typography, warm cream palette.
 */

import React, { useState, useEffect } from 'react';
import { moodByHour } from '../data/shayari';

function getMood(hour) {
  return moodByHour?.[hour] ?? moodByHour?.default ?? 'Tapri Waqt';
}

export default function TimeDisplay() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = time.getHours();
  const m = String(time.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const mood = getMood(h);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', gap: '12px' }}>
      {/* Instagram Icon */}
      <a
        href="https://www.instagram.com/truly_divyanshu/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram — @truly_divyanshu"
        style={{
          color: '#FFF4DF',
          opacity: 0.7,
          marginTop: '2px', // align visually with the time text
          outline: 'none',
          transition: 'opacity 0.2s, transform 0.2s',
          display: 'block'
        }}
        onFocus={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'scale(1.05)'; }}
        onBlur={(e) => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.transform = 'scale(1)'; }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </a>

      {/* Time & Mood */}
      <div style={{ textAlign: 'right' }}>
      {/* Time */}
      <div style={{
        fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 400,
        letterSpacing: '0.08em',
        color: '#FFF4DF',
        opacity: 0.95,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
        textShadow: '0 2px 8px rgba(0,0,0,0.6)',
      }}>
        {h12}:{m}
        <span style={{
          marginLeft: '0.3rem',
          fontSize: '0.6em',
          opacity: 0.55,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          {ampm}
        </span>
      </div>

      {/* Mood */}
      <div style={{
        marginTop: '0.2rem',
        fontSize: 'clamp(0.45rem, 1.4vw, 0.52rem)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#FFF4DF',
        opacity: 0.8,
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        textShadow: '0 1px 6px rgba(0,0,0,0.6)',
      }}>
        {mood}
      </div>
      </div>
    </div>
  );
}
