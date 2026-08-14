'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'verdict_has_seen_imdb_instruction';

export function useImdbImportInstruction() {
  const [hasSeenInstruction, setHasSeenInstruction] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const val = localStorage.getItem(STORAGE_KEY);
      setHasSeenInstruction(val === 'true');
    } catch {
      setHasSeenInstruction(false);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const markAsSeen = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore storage errors
    }
    setHasSeenInstruction(true);
  };

  const resetInstruction = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
    setHasSeenInstruction(false);
  };

  return {
    hasSeenInstruction,
    isLoaded,
    markAsSeen,
    resetInstruction,
  };
}
