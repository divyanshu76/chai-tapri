/**
 * useYouTubePlayer.js
 *
 * Manages the YouTube IFrame Player API lifecycle.
 * Exposes: play, pause, next, prev, seek, volume,
 *          currentSong, isPlaying, duration, currentTime.
 *
 * The hidden iframe is mounted into a div with id="yt-player".
 * Song detection works via onVideoDataChange → title matching.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const YT_API_SRC = 'https://www.youtube.com/iframe_api';

export function useYouTubePlayer({ onSongChange, enabled = true }) {
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(75);
  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [playerState, setPlayerState] = useState(-1); // -1 = UNSTARTED
  
  const timerRef = useRef(null);
  const lastIndexRef = useRef(-1);
  const lastVideoIdRef = useRef(null);

  // ── Load YouTube IFrame API script ───────────────────────────
  useEffect(() => {
    if (!enabled) return;
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const existing = document.getElementById('yt-api-script');
    if (!existing) {
      const tag = document.createElement('script');
      tag.id = 'yt-api-script';
      tag.src = YT_API_SRC;
      document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => initPlayer();
    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const initPlayer = useCallback(() => {
    const container = document.getElementById('yt-player');
    if (!container || playerRef.current) return;

    try {
      playerRef.current = new window.YT.Player('yt-player', {
        height: '0',
        width: '0',
        videoId: 'Xi6BjmipH58', // First video of the new playlist
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: handleReady,
          onStateChange: handleStateChange,
          onError: handleError,
        },
      });
    } catch (e) {
      setError('YouTube player could not be initialised.');
    }
  }, []);

  const handleReady = useCallback((event) => {
    event.target.setVolume(volume);
    
    const playlistId = 'PLMRKdK25AuPVjHl9Kdb-gkBy0Cm7Zi2xo';
    event.target.loadPlaylist({ listType: 'playlist', list: playlistId });
    // Note: Do not pause immediately if we want to respect the first user gesture.
    
    setIsReady(true);
    setError(null);
  }, [volume]);

  const syncMetadata = useCallback(() => {
    if (!playerRef.current) return;
    
    try {
      const idx = playerRef.current.getPlaylistIndex?.() ?? 0;
      setCurrentIndex(idx);
      
      const data = playerRef.current.getVideoData?.();
      if (data && data.title) {
        setCurrentSong({
          id: data.video_id,
          title: data.title,
          artist: data.author,
          youtubeId: data.video_id
        });
      }

      // Only trigger onSongChange if the playlist index or video ID actually changed
      const currentVideoId = data?.video_id;
      if (idx !== lastIndexRef.current || (currentVideoId && currentVideoId !== lastVideoIdRef.current)) {
        lastIndexRef.current = idx;
        lastVideoIdRef.current = currentVideoId;
        onSongChange?.(idx);
      }
    } catch (_) {}
  }, [onSongChange]);

  const handleStateChange = useCallback((event) => {
    const YT = window.YT?.PlayerState;
    if (!YT) return;
    
    setPlayerState(event.data);

    if (event.data === YT.PLAYING || event.data === YT.UNSTARTED) {
      syncMetadata();
    }

    if (event.data === YT.PLAYING) {
      // Don't set isPlaying(true) here yet, wait for currentTime to actually increase in the timer
      setError(null);
      startTimer();
    } else if (event.data === YT.PAUSED || event.data === YT.BUFFERING) {
      setIsPlaying(false);
      stopTimer();
    } else if (event.data === YT.ENDED) {
      setIsPlaying(false);
      stopTimer();
      // YouTube automatically advances to the next track in a playlist
    }
  }, [syncMetadata]);

  const handleError = useCallback((event) => {
    console.error('YouTube player error code:', event.data);
    if (event.data === 150 || event.data === 101) {
      console.warn('Video restricted (Error 150/101). Skipping to next track...');
      playerRef.current?.nextVideo?.();
    } else if (event.data === 2) {
       // invalid parameter error
       console.warn('Invalid parameter error from YouTube');
    } else {
      setError('Radio thoda rooth gaya...');
      setIsPlaying(false);
    }
  }, []);

  // ── Progress timer ───────────────────────────────────────────
  const startTimer = useCallback(() => {
    stopTimer();
    let lastTime = -1;
    timerRef.current = setInterval(() => {
      if (!playerRef.current) return;
      try {
        const ct = playerRef.current.getCurrentTime?.() ?? 0;
        const dur = playerRef.current.getDuration?.() ?? 0;
        setCurrentTime(ct);
        setDuration(dur);
        
        // Verify actual playback by checking if currentTime is increasing
        if (ct > lastTime) {
          setIsPlaying(true);
        } else if (ct === lastTime && ct > 0) {
          // If time is stuck, it's not genuinely playing (e.g., buffering)
          setIsPlaying(false);
        }
        lastTime = ct;
      } catch (_) {}
    }, 500);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => stopTimer(), [stopTimer]);

  // ── Controls ─────────────────────────────────────────────────
  const play = useCallback(() => {
    playerRef.current?.playVideo?.();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo?.();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const nextTrack = useCallback(() => {
    playerRef.current?.nextVideo?.();
  }, []);

  const prevTrack = useCallback(() => {
    if (currentTime > 3) {
      playerRef.current?.seekTo?.(0, true);
      setCurrentTime(0);
    } else {
      playerRef.current?.previousVideo?.();
    }
  }, [currentTime]);

  const seekTo = useCallback((pct) => {
    if (!playerRef.current || !duration) return;
    const time = (pct / 100) * duration;
    playerRef.current.seekTo?.(time, true);
    setCurrentTime(time);
  }, [duration]);

  const setVolume = useCallback((val) => {
    const v = Math.max(0, Math.min(100, val));
    setVolumeState(v);
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
    volume,
    error,
    play,
    pause,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
  };
}
