'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { UI_MODE_EVENT, UI_MODE_STORAGE_KEY, type UiMode } from '@/lib/ui-mode';

function readUiMode(): UiMode {
  return document.documentElement.dataset.ui === 'classic'
    ? 'classic'
    : 'modern';
}

function applyUiMode(mode: UiMode) {
  if (mode === 'classic') {
    document.documentElement.dataset.ui = 'classic';
  } else {
    delete document.documentElement.dataset.ui;
  }

  try {
    if (mode === 'classic') {
      localStorage.setItem(UI_MODE_STORAGE_KEY, 'classic');
    } else {
      localStorage.removeItem(UI_MODE_STORAGE_KEY);
    }
  } catch {
    // Storage can be unavailable (private mode); the mode still applies for
    // this visit.
  }

  window.dispatchEvent(new Event(UI_MODE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(UI_MODE_EVENT, onChange);
  return () => window.removeEventListener(UI_MODE_EVENT, onChange);
}

export function useUiMode() {
  const mode = useSyncExternalStore<UiMode>(
    subscribe,
    readUiMode,
    () => 'modern',
  );

  const setMode = useCallback((next: UiMode) => applyUiMode(next), []);

  return [mode, setMode] as const;
}
