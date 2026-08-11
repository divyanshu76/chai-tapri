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
  );
}
