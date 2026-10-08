"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  // sessionStorage changes made by this tab don't fire the `storage` event,
  // and we only need a one-shot read on mount — no subscription needed.
  return () => {};
}

function getServerSnapshot() {
  return null;
}

/**
 * Reads a sessionStorage key in a hydration-safe way: returns null during
 * SSR/initial hydration (matching the server-rendered output) and the real
 * stored value once mounted in the browser, without calling setState inside
 * an effect.
 */
export function useSessionStorageValue(key: string): string | null {
  function getSnapshot() {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
