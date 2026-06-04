import { motionTokens } from "../tokens/motionTokens.js";
import { createFadeMotion } from "../factories/createFadeMotion.js";
import { createMaskMotion } from "../factories/createMaskMotion.js";
import { createScaleMotion } from "../factories/createScaleMotion.js";

const TARGETS_WITH_MOTION = "[data-motion]";

export const childMotions = {
  "fade-up": fadeUp,
  "mask-up": maskUp,
  "image-zoom-out": imageZoomOut,
  "image-parallax-soft": imageParallaxSoft,
  "text-stagger-up": textStaggerUp,
};

export function fadeUp({ targets, gsap, config = {} }) {
  const resolvedTargets = resolveTargets(targets);

  if (!gsap || resolvedTargets.length === 0) {
    return null;
  }

  if (isReducedMotion(config)) {
    return createReducedMotionTween(gsap, resolvedTargets, "enter");
  }

  return createEnterMotion(
    createFadeMotion({
      gsap,
      targets: resolvedTargets,
      y: motionTokens.distance.fadeUpY,
      duration: motionTokens.duration.fadeUp,
      ease: motionTokens.ease.fadeUp,
      stagger: motionTokens.stagger.fadeUp,
    })
  );
}

export function maskUp({ targets, gsap, config = {} }) {
  const resolvedTargets = filterByAnimateRole(resolveTargets(targets), [
    "title",
    "text",
  ]);

  if (!gsap || resolvedTargets.length === 0) {
    return null;
  }

  if (isReducedMotion(config)) {
    return createReducedMotionTween(gsap, resolvedTargets, "enter");
  }

  return createEnterMotion(
    createMaskMotion({
      gsap,
      targets: resolvedTargets,
      yPercent: motionTokens.distance.maskUpYPercent,
      duration: motionTokens.duration.maskUp,
      ease: motionTokens.ease.maskUp,
      stagger: motionTokens.stagger.maskUp,
    })
  );
}

export function imageZoomOut({ targets, gsap, config = {} }) {
  const resolvedTargets = filterByAnimateRole(resolveTargets(targets), [
    "media",
  ]);

  if (!gsap || resolvedTargets.length === 0) {
    return null;
  }

  if (isReducedMotion(config)) {
    return createReducedMotionTween(gsap, resolvedTargets, "enter");
  }

  return createEnterMotion(
    createScaleMotion({
      gsap,
      targets: resolvedTargets,
      initialScale: motionTokens.scale.imageZoomOutInitial,
      finalScale: motionTokens.scale.imageZoomOutFinal,
      duration: motionTokens.duration.imageZoomOut,
      ease: motionTokens.ease.imageZoomOut,
    })
  );
}

export function imageParallaxSoft({ targets, gsap, config = {} }) {
  const resolvedTargets = resolveMediaInnerTargets(targets);

  if (!gsap || resolvedTargets.length === 0) {
    return null;
  }

  if (isReducedMotion(config)) {
    return createReducedMotionTween(gsap, resolvedTargets, "pinned");
  }

  return createPinnedMotion(
    gsap.fromTo(
      resolvedTargets,
      { yPercent: motionTokens.parallaxRange.imageParallaxSoftFrom },
      {
        yPercent: motionTokens.parallaxRange.imageParallaxSoftTo,
        duration: motionTokens.duration.imageParallaxSoft,
        ease: motionTokens.ease.imageParallaxSoft,
        paused: true,
      }
    )
  );
}

export function textStaggerUp({ targets, gsap, config = {} }) {
  const resolvedTargets = filterByAnimateRole(resolveTargets(targets), [
    "title",
    "text",
    "cta",
  ]);

  if (!gsap || resolvedTargets.length === 0) {
    return null;
  }

  if (isReducedMotion(config)) {
    return createReducedMotionTween(gsap, resolvedTargets, "enter");
  }

  return createEnterMotion(
    createFadeMotion({
      gsap,
      targets: resolvedTargets,
      y: motionTokens.distance.textStaggerUpY,
      duration: motionTokens.duration.textStaggerUp,
      ease: motionTokens.ease.textStaggerUp,
      stagger: motionTokens.stagger.textStaggerUp,
    })
  );
}

export function getChildMotionTargets(sceneEl) {
  if (!sceneEl) {
    return [];
  }

  return Array.from(sceneEl.querySelectorAll(TARGETS_WITH_MOTION));
}

function createEnterMotion(animation) {
  return {
    phase: "enter",
    animation,
  };
}

function createPinnedMotion(animation) {
  return {
    phase: "pinned",
    animation,
  };
}

function createReducedMotionTween(gsap, targets, phase) {
  const animation = gsap.timeline({ paused: true }).set(targets, {
      opacity: 1,
      clearProps: "transform",
    });

  if (phase === "pinned") {
    return createPinnedMotion(animation);
  }

  return createEnterMotion(animation);
}

function resolveTargets(targets) {
  return Array.from(targets ?? []);
}

function filterByAnimateRole(targets, roles) {
  return targets.filter((target) =>
    roles.includes(target.getAttribute("data-animate"))
  );
}

function resolveMediaInnerTargets(targets) {
  return filterByAnimateRole(resolveTargets(targets), ["media"])
    .map((target) => target.querySelector?.(".scene__media-inner"))
    .filter(Boolean);
}

function isReducedMotion(config) {
  return Boolean(config.reducedMotion || config.prefersReducedMotion);
}
