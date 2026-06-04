export function createScaleMotion({
  gsap,
  targets,
  initialScale,
  finalScale,
  duration,
  ease,
}) {
  return gsap.fromTo(
    targets,
    { opacity: 0, scale: initialScale },
    {
      opacity: 1,
      scale: finalScale,
      duration,
      ease,
      paused: true,
    }
  );
}
