/**
 * useYouTubePlayer.js
 *
 * ARCHITECTURE:
 * - Module-level singleton guard prevents double-init from React StrictMode.
 * - playerRef.current = event.target (set in onReady) is the ONE canonical ref.
 * - requestAnimationFrame loop reads real YouTube time — no fake progress.
 * - All controls (play/pause/seek/next/prev) call playerRef.current methods directly.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const YT_API_SRC = 'https://www.youtube.com/iframe_api';
const PLAYLIST_ID = 'PLAK5uy_kWKAcJROkxDk9mOVmfDSv9cycK_-Ci2yA';
const FIRST_VIDEO  = '3QhajVg6SjE';

// Module-level flag: ensures we only ever call new YT.Player() once,
// even when React StrictMode mounts the component twice.
let _playerCreated = false;

export function useYouTubePlayer({ onSongChange, enabled = true }) {
  // ─── Single canonical player reference ───────────────────────
  const playerRef       = useRef(null);
  const rafRef          = useRef(null);          // requestAnimationFrame id
  const lastTrackKey    = useRef('');            // "videoId:index" change detection
  const onSongChangeRef = useRef(onSongChange);  // stable ref so callbacks never go stale

  // Keep onSongChangeRef up-to-date without re-creating closures
  useEffect(() => { onSongChangeRef.current = onSongChange; }, [onSongChange]);

  // ─── React state (UI only — YouTube is the source of truth) ──
  const [isReady,     setIsReady]     = useState(false);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentIndex,setCurrentIndex]= useState(0);
  const [playerState, setPlayerState] = useState(-1);
  const [error,       setError]       = useState(null);

  // ─── rAF progress loop ────────────────────────────────────────
  const stopRaf = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startRaf = useCallback(() => {
    stopRaf();
    const tick = () => {
      const p = playerRef.current;
      if (p && typeof p.getPlayerState === 'function') {
        try {
          const ct  = p.getCurrentTime() ?? 0;
          const dur = p.getDuration()    ?? 0;
          setCurrentTime(ct);
          setDuration(dur);
        } catch (_) {}
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopRaf]);

  // ─── Track sync (called only when PLAYING state fires) ────────
  const syncTrack = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      const data  = p.getVideoData?.();
      const idx   = p.getPlaylistIndex?.() ?? 0;
      const dur   = p.getDuration?.()      ?? 0;
      const ct    = p.getCurrentTime?.()   ?? 0;
      const vid   = data?.video_id ?? '';
      const title = data?.title    ?? '';

      if (!vid) return;

      const key = `${vid}:${idx}`;
      if (key === lastTrackKey.current) return; // same track, skip
      lastTrackKey.current = key;

      console.log('[YT TRACK]', { videoId: vid, playlistIndex: idx, title });

      setCurrentIndex(idx);
      setDuration(dur);
      setCurrentTime(ct);
      setCurrentSong({
        id:        vid,
        youtubeId: vid,
        title:     title,
        artist:    data?.author ?? '',
      });
      onSongChangeRef.current?.(idx);
    } catch (_) {}
  }, []);

  // ─── YouTube event handlers ───────────────────────────────────
  const onReady = useCallback((event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(75);
    setIsReady(true);
    setError(null);
    console.log('[YT READY]', {
      playerExists:  !!playerRef.current,
      state:         playerRef.current?.getPlayerState?.(),
      videoId:       playerRef.current?.getVideoData?.()?.video_id,
      playlistIndex: playerRef.current?.getPlaylistIndex?.(),
      playlist:      playerRef.current?.getPlaylist?.(),
      methodCheck: {
        playVideo:       typeof playerRef.current?.playVideo,
        pauseVideo:      typeof playerRef.current?.pauseVideo,
        seekTo:          typeof playerRef.current?.seekTo,
        nextVideo:       typeof playerRef.current?.nextVideo,
        previousVideo:   typeof playerRef.current?.previousVideo,
        getCurrentTime:  typeof playerRef.current?.getCurrentTime,
        getDuration:     typeof playerRef.current?.getDuration,
        getVideoData:    typeof playerRef.current?.getVideoData,
        getPlaylistIndex:typeof playerRef.current?.getPlaylistIndex,
        getPlaylist:     typeof playerRef.current?.getPlaylist,
      }
    });
  }, []);

  const onStateChange = useCallback((event) => {
    const PS = window.YT?.PlayerState;
    if (!PS) return;

    const state = event.data;
    setPlayerState(state);

    if (state === PS.PLAYING) {
      console.log('[YT PLAYING]');
      setIsPlaying(true);
      setError(null);
      syncTrack();
      startRaf();
    } else if (state === PS.PAUSED) {
      console.log('[YT PAUSED]');
      setIsPlaying(false);
      // keep rAF running so UI stays accurate during scrub
    } else if (state === PS.BUFFERING) {
      console.log('[YT BUFFERING]');
      setIsPlaying(false);
    } else if (state === PS.ENDED) {
      console.log('[YT ENDED]');
      setIsPlaying(false);
      // Playlist auto-advances; next PLAYING event will call syncTrack()
    } else if (state === PS.CUED) {
      console.log('[YT CUED]');
      setIsPlaying(false);
    }
  }, [syncTrack, startRaf]);

  const onError = useCallback((event) => {
    console.error('[YT ERROR]', event.data);
    if (event.data === 150 || event.data === 101) {
      console.warn('[YT] Restricted video — skipping.');
      playerRef.current?.nextVideo?.();
    } else {
      setError('Radio thoda rooth gaya...');
      setIsPlaying(false);
    }
  }, []);

  // ─── Load API + create player (ONCE) ─────────────────────────
  useEffect(() => {
    if (!enabled) return;

    const createPlayer = () => {
      // Guard: never create more than one player
      if (_playerCreated) {
        console.warn('[YT] initPlayer skipped — already created');
        return;
      }
      const container = document.getElementById('yt-player');
      if (!container) return;

      _playerCreated = true;
      console.log('[YT] Creating player…');

      new window.YT.Player('yt-player', {
        videoId: FIRST_VIDEO,
        height:  '0',
        width:   '0',
        playerVars: {
          autoplay:       0,
          controls:       0,
          disablekb:      1,
          fs:             0,
          iv_load_policy: 3,
          listType:       'playlist',
          list:           PLAYLIST_ID,
          modestbranding: 1,
          origin:         window.location.origin,
          playsinline:    1,
          rel:            0,
        },
        events: {
          onReady:       onReady,
          onStateChange: onStateChange,
          onError:       onError,
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      // Inject script only once
      if (!document.getElementById('yt-api-script')) {
        const tag = document.createElement('script');
        tag.id  = 'yt-api-script';
        tag.src = YT_API_SRC;
        document.head.appendChild(tag);
      }
      // If a previous onYouTubeIframeAPIReady exists, don't overwrite blindly
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
    }

    // Cleanup: cancel rAF; do NOT destroy the player or reset _playerCreated
    // because React StrictMode will remount the component, and we want the
    // already-running player to survive across that remount.
    return () => {
      stopRaf();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // ─── Public controls ──────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    const state = p.getPlayerState?.();
    if (state === window.YT?.PlayerState?.PLAYING) {
      console.log('[YT CONTROL] PAUSE');
      p.pauseVideo();
    } else {
      console.log('[YT CONTROL] PLAY');
      p.playVideo();
    }
  }, []);

  const nextTrack = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    console.log('[YT CONTROL] NEXT', {
      playerExists:  !!p,
      videoId:       p.getVideoData?.()?.video_id,
      playlistIndex: p.getPlaylistIndex?.(),
      playlist:      p.getPlaylist?.(),
    });
    p.nextVideo();
  }, []);

  const prevTrack = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    // Read live time — never trust stale React state
    const liveTime = p.getCurrentTime?.() ?? 0;
    console.log('[YT CONTROL] PREVIOUS', {
      playerExists:  !!p,
      liveTime,
      videoId:       p.getVideoData?.()?.video_id,
      playlistIndex: p.getPlaylistIndex?.(),
    });
    if (liveTime > 5) {
      p.seekTo(0, true);
    } else {
      p.previousVideo();
    }
  }, []);

  const seekTo = useCallback((time) => {
    const p = playerRef.current;
    if (!p) return;
    const before = p.getCurrentTime?.() ?? 0;
    console.log('[YT CONTROL] SEEK', { before, target: time });
    p.seekTo(time, true);
    // Read back after a brief moment to confirm
    setTimeout(() => {
      const after = p.getCurrentTime?.() ?? 0;
      console.log('[YT SEEK CONFIRM]', { before, target: time, after });
    }, 500);
  }, []);

  const setVolume = useCallback((val) => {
    const v = Math.max(0, Math.min(100, val));
    playerRef.current?.setVolume?.(v);
  }, []);

  return {
    isReady,
    isPlaying,
    currentSong,
    currentIndex,
    currentTime,
    duration,
    playerState,
    error,
    volume: 75,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
  };
}
