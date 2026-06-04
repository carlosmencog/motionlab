export function createFadeMotion({
  gsap,
  targets,
  y,
  duration,
  ease,
  stagger,
}) {
  const toVars = {
    opacity: 1,
    y: 0,
    duration,
    ease,
    paused: true,
  };

  if (stagger !== undefined) {
    toVars.stagger = stagger;
  }

  return gsap.fromTo(targets, { opacity: 0, y }, toVars);
}
