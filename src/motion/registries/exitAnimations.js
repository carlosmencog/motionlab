export const exitAnimations = {
  "fade-out": fadeOut,
  "slide-out-left": slideOutLeft,
  "slide-out-up": slideOutUp,
};

export function fadeOut({ sceneEl, gsap, config = {} }) {
  if (!gsap || !sceneEl) {
    return null;
  }

  return gsap.to(sceneEl, {
    opacity: 0,
    duration: getDuration(config, 0.6),
    ease: "power2.out",
    paused: true,
  });
}

export function slideOutLeft({ sceneEl, gsap, config = {} }) {
  if (!gsap || !sceneEl) {
    return null;
  }

  return gsap.to(sceneEl, {
    xPercent: -100,
    duration: getDuration(config, 1),
    ease: "power3.inOut",
    paused: true,
  });
}

export function slideOutUp({ sceneEl, gsap, config = {} }) {
  if (!gsap || !sceneEl) {
    return null;
  }

  return gsap.to(sceneEl, {
    yPercent: -100,
    duration: getDuration(config, 1),
    ease: "power3.inOut",
    paused: true,
  });
}

function getDuration(config, duration) {
  return config.reducedMotion || config.prefersReducedMotion ? 0 : duration;
}
