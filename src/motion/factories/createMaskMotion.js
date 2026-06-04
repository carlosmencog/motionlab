export function createMaskMotion({
  gsap,
  targets,
  yPercent,
  opacity,
  duration,
  ease,
  stagger,
}) {
  const fromVars = { yPercent };
  const toVars = {
    yPercent: 0,
    duration,
    ease,
    paused: true,
  };

  if (opacity !== undefined) {
    fromVars.opacity = opacity.from;
    toVars.opacity = opacity.to;
  }

  if (stagger !== undefined) {
    toVars.stagger = stagger;
  }

  return gsap.fromTo(targets, fromVars, toVars);
}
