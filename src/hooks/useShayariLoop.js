import { useState, useEffect, useCallback, useRef } from 'react';

// Helper to shuffle an array
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useShayariLoop({ shayariPool = [], interval = 3000 }) {
  const [currentShayari, setCurrentShayari] = useState(null);
  
  // We use refs to avoid re-triggering useEffect unnecessarily
  const poolRef = useRef([]);
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  // Initialize pool on mount
  useEffect(() => {
    if (shayariPool.length > 0) {
      poolRef.current = shuffleArray(shayariPool);
      indexRef.current = 0;
      setCurrentShayari(poolRef.current[0]);
    }
  }, [shayariPool]);

  // Function to get the next shayari
  const getNextShayari = useCallback(() => {
    if (poolRef.current.length === 0) return null;
    
    indexRef.current += 1;
    
    // Reshuffle if we've exhausted the pool
    if (indexRef.current >= poolRef.current.length) {
      // Ensure the first item of the new shuffle isn't the same as the last item
      const lastShayari = poolRef.current[poolRef.current.length - 1];
      let nextPool = shuffleArray(poolRef.current);
      
      // If the new first is the same as the old last, swap it with the second
      if (nextPool.length > 1 && nextPool[0] === lastShayari) {
        [nextPool[0], nextPool[1]] = [nextPool[1], nextPool[0]];
      }
      
      poolRef.current = nextPool;
      indexRef.current = 0;
    }
    
    return poolRef.current[indexRef.current];
  }, []);

  // Set up the continuous loop
  useEffect(() => {
    if (shayariPool.length === 0) return;
    
    const tick = () => {
      setCurrentShayari(getNextShayari());
    };
    
    timerRef.current = setInterval(tick, interval);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [shayariPool, interval, getNextShayari]);

  // Immediately jump to a new shayari, resetting the timer
  const triggerNewShayari = useCallback(() => {
    if (shayariPool.length === 0) return;
    
    // Clear the existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Set the new shayari immediately
    setCurrentShayari(getNextShayari());
    
    // Restart the timer exactly once
    const tick = () => {
      setCurrentShayari(getNextShayari());
    };
    timerRef.current = setInterval(tick, interval);
  }, [shayariPool, interval, getNextShayari]);

  return {
    currentShayari,
    triggerNewShayari,
  };
}
