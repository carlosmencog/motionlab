export function getReducedMotionPreference() {
  if (!globalThis.matchMedia) {
    return false;
  }

  return globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

