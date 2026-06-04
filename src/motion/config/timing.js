export const DEFAULT_TIMING = {
  scrollLength: "medium",
  transitionSoftness: "soft",
  overlap: false,
};

const SCROLL_LENGTHS = {
  short: "+=50%",
  medium: "+=75%",
  long: "+=100%",
};

const SOFTNESS = {
  none: {
    scrub: true,
    initialProgress: 0,
    enterStart: 0,
    enterEnd: 0.2,
    holdStart: 0.2,
    holdEnd: 0.4,
    exitStart: 0.4,
    exitEnd: 0.75,
    prepStart: 0.6,
    prepEnd: 1,
  },
  soft: {
    scrub: 0.25,
    initialProgress: 0.12,
    firstSceneInitialProgress: 0.04,
    firstSceneEnterProgress: 0.2,
    firstSceneEnterDuration: 0.45,
    enterStart: 0,
    enterEnd: 0.2,
    holdStart: 0.2,
    holdEnd: 0.4,
    exitStart: 0.36,
    exitEnd: 0.75,
    prepStart: 0.6,
    prepEnd: 1,
  },
  cinematic: {
    scrub: 0.45,
    initialProgress: 0.16,
    firstSceneInitialProgress: 0.04,
    firstSceneEnterProgress: 0.2,
    firstSceneEnterDuration: 0.55,
    enterStart: 0,
    enterEnd: 0.2,
    holdStart: 0.2,
    holdEnd: 0.4,
    exitStart: 0.3,
    exitEnd: 0.75,
    prepStart: 0.6,
    prepEnd: 1,
  },
};

export function resolveTransitionTiming(config = {}) {
  const scrollLength = hasOwn(SCROLL_LENGTHS, config.scrollLength)
    ? config.scrollLength
    : DEFAULT_TIMING.scrollLength;
  const transitionSoftness = hasOwn(SOFTNESS, config.transitionSoftness)
    ? config.transitionSoftness
    : DEFAULT_TIMING.transitionSoftness;
  const overlap = config.overlap ?? DEFAULT_TIMING.overlap;
  const phases = { ...SOFTNESS[transitionSoftness] };

  if (!overlap) {
    phases.exitStart = phases.holdEnd;
    phases.exitEnd = 1;
  }

  return {
    scrollLength,
    transitionSoftness,
    overlap,
    end: SCROLL_LENGTHS[scrollLength],
    ...phases,
    enterDuration: phases.enterEnd - phases.enterStart,
    holdDuration: phases.holdEnd - phases.holdStart,
    exitDuration: phases.exitEnd - phases.exitStart,
  };
}

export function validateTimingConfig(config = {}) {
  const warnings = [];

  if (
    config.scrollLength &&
    !hasOwn(SCROLL_LENGTHS, config.scrollLength)
  ) {
    warnings.push(
      `[Motion System] Unknown scroll length "${config.scrollLength}". Using "${DEFAULT_TIMING.scrollLength}".`
    );
  }

  if (
    config.transitionSoftness &&
    !hasOwn(SOFTNESS, config.transitionSoftness)
  ) {
    warnings.push(
      `[Motion System] Unknown transition softness "${config.transitionSoftness}". Using "${DEFAULT_TIMING.transitionSoftness}".`
    );
  }

  return warnings;
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}
