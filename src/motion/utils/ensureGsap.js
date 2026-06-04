export function ensureGsap() {
  const gsap = globalThis.gsap;

  if (!gsap) {
    console.warn("[Motion System] GSAP was not found on globalThis.gsap.");
    return null;
  }

  return gsap;
}

export function ensureScrollTrigger(gsap = ensureGsap()) {
  const ScrollTrigger =
    globalThis.ScrollTrigger ??
    gsap?.plugins?.ScrollTrigger ??
    gsap?.core?.globals?.().ScrollTrigger ??
    null;

  if (!ScrollTrigger) {
    console.warn("[Motion System] ScrollTrigger was not found.");
    return null;
  }

  gsap?.registerPlugin?.(ScrollTrigger);

  return ScrollTrigger;
}
