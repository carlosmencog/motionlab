import { motionTokens } from "../tokens/motionTokens.js";
import { createFadeMotion } from "../factories/createFadeMotion.js";
import { createMaskMotion } from "../factories/createMaskMotion.js";
import { createScaleMotion } from "../factories/createScaleMotion.js";

const ALL_ANIMATED_TARGETS = "[data-animate]";

export const enterAnimations = {
  "fade-up": fadeUp,
  "fade-up-top": fadeUpTop,
  "mask-up": maskUp,
  "scale-in": scaleIn,
};

export function fadeUp({ sceneEl, targets, gsap, config = {} }) {
  const resolvedTargets = resolveTargets(sceneEl, targets);

  if (!gsap || resolvedTargets.length === 0) {
    return null;
  }

  if (isReducedMotion(config)) {
    return createReducedMotionTimeline(gsap, resolvedTargets);
  }

  return createFadeMotion({
    gsap,
    targets: resolvedTargets,
    y: motionTokens.distance.fadeUpY,
    duration: motionTokens.duration.fadeUp,
    ease: motionTokens.ease.fadeUp,
    stagger: motionTokens.stagger.fadeUp,
  });
}

export function fadeUpTop({ sceneEl, targets, gsap, config = {} }) {
  const resolvedTargets = resolveTargets(sceneEl, targets);

  if (!gsap || resolvedTargets.length === 0) {
    return null;
  }

  if (isReducedMotion(config)) {
    return createReducedMotionTimeline(gsap, resolvedTargets);
  }

  return createFadeMotion({
    gsap,
    targets: resolvedTargets,
    y: motionTokens.distance.fadeUpTopY,
    duration: motionTokens.duration.fadeUpTop,
    ease: motionTokens.ease.fadeUpTop,
    stagger: motionTokens.stagger.fadeUpTop,
  });
}

export function maskUp({ sceneEl, targets, gsap, config = {} }) {
  const resolvedTargets = filterByAnimateRole(
    resolveTargets(sceneEl, targets),
    ["title", "text"]
  );

  if (!gsap || resolvedTargets.length === 0) {
    return null;
  }

  if (isReducedMotion(config)) {
    return createReducedMotionTimeline(gsap, resolvedTargets);
  }

  return createMaskMotion({
    gsap,
    targets: resolvedTargets,
    yPercent: motionTokens.distance.maskUpYPercent,
    duration: motionTokens.duration.maskUp,
    ease: motionTokens.ease.maskUp,
    stagger: motionTokens.stagger.maskUp,
  });
}

export function scaleIn({ sceneEl, targets, gsap, config = {} }) {
  const resolvedTargets = filterByAnimateRole(resolveTargets(sceneEl, targets), [
    "media",
  ]);

  if (!gsap || resolvedTargets.length === 0) {
    return null;
  }

  if (isReducedMotion(config)) {
    return createReducedMotionTimeline(gsap, resolvedTargets);
  }

  return createScaleMotion({
    gsap,
    targets: resolvedTargets,
    initialScale: motionTokens.scale.scaleInInitial,
    finalScale: motionTokens.scale.scaleInFinal,
    duration: motionTokens.duration.scaleIn,
    ease: motionTokens.ease.scaleIn,
  });
}

function resolveTargets(sceneEl, targets) {
  if (targets) {
    return Array.from(targets);
  }

  if (!sceneEl) {
    return [];
  }

  return Array.from(sceneEl.querySelectorAll(ALL_ANIMATED_TARGETS));
}

function filterByAnimateRole(targets, roles) {
  return targets.filter((target) =>
    roles.includes(target.getAttribute("data-animate"))
  );
}

function isReducedMotion(config) {
  return Boolean(config.reducedMotion || config.prefersReducedMotion);
}

function createReducedMotionTimeline(gsap, targets) {
  return gsap.timeline({ paused: true }).set(targets, {
    opacity: 1,
    clearProps: "transform",
  });
}
