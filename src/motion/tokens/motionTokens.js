export const motionTokens = {
  duration: {
    fadeUp: 0.9,
    fadeUpTop: 1,
    maskUp: 1.1,
    scaleIn: 1.2,
    imageZoomOut: 1.2,
    textStaggerUp: 0.9,
    imageParallaxSoft: 1,
  },

  ease: {
    fadeUp: "power3.out",
    fadeUpTop: "power4.out",
    maskUp: "power4.out",
    scaleIn: "power3.out",
    imageZoomOut: "power3.out",
    textStaggerUp: "power3.out",
    imageParallaxSoft: "none",
  },

  stagger: {
    fadeUp: 0.08,
    fadeUpTop: 0.08,
    maskUp: 0.06,
    textStaggerUp: 0.08,
  },

  distance: {
    fadeUpY: 48,
    fadeUpTopY: -48,
    textStaggerUpY: 40,
    maskUpYPercent: 100,
  },

  scale: {
    scaleInInitial: 1.12,
    scaleInFinal: 1,
    imageZoomOutInitial: 1.15,
    imageZoomOutFinal: 1,
  },

  parallaxRange: {
    imageParallaxSoftFrom: 6,
    imageParallaxSoftTo: -6,
  },
};
