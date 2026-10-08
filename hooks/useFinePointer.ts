"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * True when the primary input is a fine, hover-capable pointer (mouse/trackpad).
 * Pointer-only decorative effects (tilt, magnetic buttons, glow) should check
 * this and no-op on touch devices rather than trying to emulate it there.
 */
export function useFinePointer() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
