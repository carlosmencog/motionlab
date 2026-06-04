import { ensureGsap, ensureScrollTrigger } from "../utils/ensureGsap.js";
import { validateTimingConfig } from "../config/timing.js";

export function createScene({
  element,
  nextElement = null,
  index,
  config,
  registries,
  reducedMotion = false,
}) {
  const warnings = [];
  const scenePreset = resolveRegistryItem({
    registry: registries.scenes,
    key: config.scene,
    type: "scene",
    config,
    warnings,
  });
  const sceneDefinition = scenePreset?.({
    sceneEl: element,
    config,
  }) ?? {
    name: config.scene,
    config,
    warnings: [],
  };
  const resolvedConfig = sceneDefinition.config;

  sceneDefinition.warnings.forEach((message) => {
    warnings.push(message);
    console.warn(message);
  });
  validateTimingConfig(resolvedConfig).forEach((message) => {
    warnings.push(message);
    console.warn(message);
  });

  const enterAnimation = resolveRegistryItem({
    registry: registries.enterAnimations,
    key: resolvedConfig.enter,
    type: "enter animation",
    config: resolvedConfig,
    warnings,
  });
  const exitAnimation = null;
  const transition = resolveRegistryItem({
    registry: registries.transitions,
    key: resolvedConfig.transition,
    type: "transition",
    config: resolvedConfig,
    warnings,
  });

  const context = {
    element,
    nextElement,
    index,
    config: resolvedConfig,
    reducedMotion,
    scene: sceneDefinition,
    enter: enterAnimation,
    exit: exitAnimation,
    transition,
    getAll(role) {
      return Array.from(element.querySelectorAll(`[data-animate="${role}"]`));
    },
    get(role) {
      return element.querySelector(`[data-animate="${role}"]`);
    },
  };
  const gsap = ensureGsap();
  const ScrollTrigger = gsap ? ensureScrollTrigger(gsap) : null;
  const motionConfig = { ...resolvedConfig, reducedMotion };
  const targets = Array.from(
    element.querySelectorAll("[data-animate]:not([data-motion])")
  );
  const childAnimations = createChildAnimations({
    sceneEl: element,
    config: motionConfig,
    registry: registries.childMotions,
    gsap,
    warnings,
  });
  const enter = enterAnimation?.({
    sceneEl: element,
    targets,
    gsap,
    config: motionConfig,
  });
  const enterWithChildren = createEnterTimeline(gsap, [
    enter,
    ...childAnimations.enter,
  ]);
  const exit = null;
  let instance = null;

  try {
    instance = transition?.({
      sceneEl: element,
      nextSceneEl: nextElement,
      config: motionConfig,
      enterAnimation: enterWithChildren,
      exitAnimation: exit,
      pinnedAnimations: childAnimations.pinned,
      gsap,
      ScrollTrigger,
    }) ?? null;
  } catch (error) {
    const message = `[Motion System] Transition "${resolvedConfig.transition}" failed in scene "${resolvedConfig.scene}" (#${resolvedConfig.id}).`;
    warnings.push(message);
    console.warn(message, error);
  }

  return {
    element,
    index,
    config: resolvedConfig,
    context,
    instance,
    warnings,
    isValid: warnings.length === 0,
    refresh() {
      instance?.refresh?.();
    },
    destroy() {
      instance?.destroy?.();
      enterWithChildren?.kill?.();
      exit?.kill?.();
    },
  };
}

function createChildAnimations({
  sceneEl,
  config,
  registry,
  gsap,
  warnings,
}) {
  const groupedTargets = groupTargetsByMotion(sceneEl);
  const animations = {
    enter: [],
    pinned: [],
  };

  Object.entries(groupedTargets).forEach(([motionName, targets]) => {
    const preset = resolveRegistryItem({
      registry,
      key: motionName,
      type: "child motion",
      config,
      warnings,
    });

    if (!preset) {
      return;
    }

    if (
      !validateChildMotion({
        motionName,
        targets,
        config,
        warnings,
      })
    ) {
      return;
    }

    const result = preset({
      sceneEl,
      targets,
      gsap,
      config,
    });

    if (!result?.animation) {
      return;
    }

    if (result.phase === "pinned") {
      animations.pinned.push(result.animation);
      return;
    }

    animations.enter.push(result.animation);
  });

  return animations;
}

function validateChildMotion({ motionName, targets, config, warnings }) {
  if (motionName !== "image-parallax-soft") {
    return true;
  }

  if (config.transition !== "pinned-scroll") {
    const message = `[Motion System] Child motion "image-parallax-soft" only runs inside pinned-scroll scenes (#${config.id}).`;
    warnings.push(message);
    console.warn(message);
    return false;
  }

  const missingInner = targets.some(
    (target) =>
      target.getAttribute?.("data-animate") === "media" &&
      !target.querySelector?.(".scene__media-inner")
  );

  if (missingInner) {
    const message = `[Motion System] Child motion "image-parallax-soft" requires .scene__media-inner inside [data-animate="media"] (#${config.id}). Parallax skipped.`;
    warnings.push(message);
    console.warn(message);
    return false;
  }

  return true;
}

function groupTargetsByMotion(sceneEl) {
  const groups = {};

  sceneEl.querySelectorAll("[data-motion]").forEach((target) => {
    const motionName = target.dataset.motion?.trim();

    if (!motionName) {
      return;
    }

    groups[motionName] ??= [];
    groups[motionName].push(target);
  });

  return groups;
}

function createEnterTimeline(gsap, animations) {
  const resolvedAnimations = animations.filter(Boolean);

  if (!gsap || resolvedAnimations.length === 0) {
    return null;
  }

  if (resolvedAnimations.length === 1) {
    return resolvedAnimations[0];
  }

  const timeline = gsap.timeline({ paused: true });

  resolvedAnimations.forEach((animation) => {
    animation.pause?.(0);
    animation.paused?.(false);
    timeline.add(animation, 0);
  });

  return timeline;
}

function resolveRegistryItem({ registry, key, type, config, warnings }) {
  if (!key) {
    return null;
  }

  const item = registry[key];

  if (!item) {
    const message = `[Motion System] Unknown ${type} "${key}" in scene "${config.scene}" (#${config.id}).`;
    warnings.push(message);
    console.warn(message);
    return null;
  }

  return item;
}
