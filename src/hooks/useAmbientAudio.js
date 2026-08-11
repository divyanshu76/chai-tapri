/**
 * useAmbientAudio.js
 *
 * Web Audio API — synthesised ambient sounds.
 * No external audio files required.
 *
 * Sounds:
 *  'rain'     — pink noise filtered through a bandpass
 *  'evening'  — very low drone + occasional cricket chirps
 *  'midnight' — deep filtered hum
 *
 * Volume: ambient is kept at 10–18% of music volume.
 */

import { useRef, useState, useCallback, useEffect } from 'react';

const BASE_GAIN = 0.08; // 8% baseline

export function useAmbientAudio() {
  const ctxRef = useRef(null);
  const masterGainRef = useRef(null);
  const nodesRef = useRef([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [ambientType, setAmbientTypeState] = useState('evening');
  const [ambientVolume, setAmbientVolumeState] = useState(0.5);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      try {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        masterGainRef.current = ctxRef.current.createGain();
        masterGainRef.current.gain.value = BASE_GAIN;
        masterGainRef.current.connect(ctxRef.current.destination);
      } catch (e) {
        return null; // Handle missing support or strict policies gracefully
      }
    }
    if (ctxRef.current && ctxRef.current.state === 'suspended') {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  const stopAll = useCallback(() => {
    nodesRef.current.forEach((n) => {
      try { n.stop?.(); n.disconnect?.(); } catch (_) {}
    });
    nodesRef.current = [];
  }, []);

  // ── Build a pink noise buffer ────────────────────────────────
  const createNoise = useCallback((ctx) => {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + white * 0.5362) * 0.11;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    return src;
  }, []);

  // ── Rain scene: filtered pink noise (hiss) ───────────────────
  const startRain = useCallback((ctx) => {
    const noise = createNoise(ctx);
    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 3200;
    bpf.Q.value = 0.3;

    const gain = ctx.createGain();
    gain.gain.value = 1.4;

    noise.connect(bpf);
    bpf.connect(gain);
    gain.connect(masterGainRef.current);
    noise.start();

    nodesRef.current = [noise, bpf, gain];
  }, [createNoise]);

  // ── Evening scene: low drone + faint hiss ───────────────────
  const startEvening = useCallback((ctx) => {
    const noise = createNoise(ctx);
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 800;
    lpf.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0.7;

    noise.connect(lpf);
    lpf.connect(gain);
    gain.connect(masterGainRef.current);
    noise.start();

    nodesRef.current = [noise, lpf, gain];
  }, [createNoise]);

  // ── Midnight scene: deep sub hum ────────────────────────────
  const startMidnight = useCallback((ctx) => {
    const noise = createNoise(ctx);
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 400;

    const gain = ctx.createGain();
    gain.gain.value = 0.5;

    noise.connect(lpf);
    lpf.connect(gain);
    gain.connect(masterGainRef.current);
    noise.start();

    nodesRef.current = [noise, lpf, gain];
  }, [createNoise]);

  // ── Radio static burst (one-shot) ───────────────────────────
  const playStaticBurst = useCallback(() => {
    try {
      const ctx = getCtx();
      if (!ctx) return;
      
      const noise = createNoise(ctx);
      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.value = 2000;
      bpf.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      noise.connect(bpf);
      bpf.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 0.36);
    } catch (_) {}
  }, [getCtx, createNoise]);

  // ── Cup clink sound (one-shot) ───────────────────────────────
  const playChaiClink = useCallback(() => {
    try {
      const ctx = getCtx();
      if (!ctx) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (_) {}
  }, [getCtx]);

  // ── Set ambient scene ────────────────────────────────────────
  const setAmbientScene = useCallback((type) => {
    setAmbientTypeState(type);
    if (!isEnabled) return;

    try {
      const ctx = getCtx();
      if (!ctx) return;
      stopAll();
      if (type === 'rain') startRain(ctx);
      else if (type === 'evening') startEvening(ctx);
      else if (type === 'midnight') startMidnight(ctx);
    } catch (_) {}
  }, [isEnabled, getCtx, stopAll, startRain, startEvening, startMidnight]);

  // ── Toggle ambient on/off ────────────────────────────────────
  const toggleAmbient = useCallback(() => {
    setIsEnabled((prev) => {
      const next = !prev;
      if (!next) {
        masterGainRef.current?.gain.setValueAtTime(0, ctxRef.current?.currentTime ?? 0);
        stopAll();
      } else {
        masterGainRef.current?.gain.setValueAtTime(BASE_GAIN * ambientVolume * 2, ctxRef.current?.currentTime ?? 0);
        setAmbientScene(ambientType);
      }
      return next;
    });
  }, [ambientType, ambientVolume, stopAll, setAmbientScene]);

  // ── Set ambient volume ───────────────────────────────────────
  const setAmbientVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v));
    setAmbientVolumeState(clamped);
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        BASE_GAIN * clamped * 2,
        ctxRef.current.currentTime
      );
    }
  }, []);

  // ── Boost ambient when music pauses ─────────────────────────
  const onMusicPause = useCallback(() => {
    if (!masterGainRef.current || !ctxRef.current) return;
    masterGainRef.current.gain.setTargetAtTime(
      BASE_GAIN * ambientVolume * 3.5,
      ctxRef.current.currentTime,
      0.5
    );
  }, [ambientVolume]);

  const onMusicPlay = useCallback(() => {
    if (!masterGainRef.current || !ctxRef.current) return;
    masterGainRef.current.gain.setTargetAtTime(
      BASE_GAIN * ambientVolume * 2,
      ctxRef.current.currentTime,
      0.5
    );
  }, [ambientVolume]);

  useEffect(() => () => {
    stopAll();
    ctxRef.current?.close?.();
  }, [stopAll]);

  return {
    isEnabled,
    ambientVolume,
    toggleAmbient,
    setAmbientScene,
    setAmbientVolume,
    playStaticBurst,
    playChaiClink,
    onMusicPause,
    onMusicPlay,
  };
}
