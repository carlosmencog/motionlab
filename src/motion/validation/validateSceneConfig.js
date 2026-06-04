import { compositionMetadata } from "../metadata/compositionMetadata.js";

export function validateSceneConfig({
  sceneEl,
  nextSceneEl = null,
  config,
  metadata,
}) {
  const warnings = [];
  const errors = [];

  if (!sceneEl || !config || !metadata) {
    return {
      valid: false,
      warnings,
      errors: ["[Motion System] validateSceneConfig() requires sceneEl, config, and metadata."],
    };
  }

  const sceneMetadata = metadata.scenes?.[config.scene];
  const enterMetadata = metadata.enterAnimations?.[config.enter];
  const transitionMetadata = metadata.transitions?.[config.transition];

  validateRequiredPreset({
    presetName: config.scene,
    presetMetadata: sceneMetadata,
    type: "scene",
    config,
    errors,
  });
  validateOptionalPreset({
    presetName: config.enter,
    presetMetadata: enterMetadata,
    type: "enter animation",
    config,
    warnings,
    errors,
  });
  validateRequiredPreset({
    presetName: config.transition,
    presetMetadata: transitionMetadata,
    type: "transition",
    config,
    errors,
  });

  validateStatus({ presetMetadata: sceneMetadata, config, warnings, errors });
  validateStatus({ presetMetadata: enterMetadata, config, warnings, errors });
  validateStatus({ presetMetadata: transitionMetadata, config, warnings, errors });
  validateRequires({ sceneEl, presetMetadata: sceneMetadata, config, warnings });

  if (config.transition === "pinned-scroll" && !sceneEl.querySelector("[data-animate]")) {
    warnings.push(
      `[Motion System] Scene "${config.scene}" (#${config.id}) uses pinned-scroll but has no visible [data-animate] targets.`
    );
  }

  validateExit({ config, metadata, warnings, errors });
  validateChildMotions({ sceneEl, config, metadata, warnings, errors });
  validateComposition({ sceneEl, nextSceneEl, config, warnings });

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

function validateComposition({ sceneEl, nextSceneEl, config, warnings }) {
  const composition = compositionMetadata[config.transition];

  if (!composition) {
    warnings.push(
      `[Motion System] No composition metadata found for transition "${config.transition}" in scene "${config.scene}" (#${config.id}).`
    );
    return;
  }

  if (composition.status === "reserved") {
    warnings.push(
      `[Motion System] Transition "${composition.name}" is reserved for future composition work and has no stable runtime implementation.`
    );
  }

  if (composition.status === "experimental") {
    warnings.push(
      `[Motion System] Transition "${composition.name}" is experimental and should only be used in isolated demos.`
    );
  }

  if (composition.requiresNextScene && config.hasNextScene === false) {
    warnings.push(
      `[Motion System] Transition "${composition.name}" requires a next scene in scene "${config.scene}" (#${config.id}).`
    );
  }

  if (composition.requiresViewportCoverage) {
    warnings.push(
      `[Motion System] Transition "${composition.name}" requires viewport coverage from the next scene.`
    );
  }

  validateCoverSafeCloneRisks({
    cloneSourceEl: nextSceneEl ?? sceneEl,
    config,
    warnings,
  });
}

function validateCoverSafeCloneRisks({ cloneSourceEl, config, warnings }) {
  if (config.transition !== "cover-safe" || !cloneSourceEl?.querySelectorAll) {
    return;
  }

  const checks = [
    {
      selector: "[id]",
      message: "duplicate-id risk: cover-safe clone source contains id attributes.",
    },
    {
      selector:
        'a[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]',
      message:
        "interactive-controls risk: cover-safe clone source contains focusable or interactive elements.",
    },
    {
      selector: "video",
      message: "video risk: cover-safe clone source contains video media.",
    },
    {
      selector: "iframe",
      message:
        "iframe risk: cover-safe clone source contains embedded iframe content.",
    },
    {
      selector: "canvas",
      message:
        "canvas risk: cover-safe clone source contains canvas content that may not clone rendered pixels.",
    },
  ];

  checks.forEach(({ selector, message }) => {
    if (cloneSourceEl.querySelector(selector)) {
      warnings.push(
        `[Motion System] ${message} Scene "${config.scene}" (#${config.id}).`
      );
    }
  });
}

function validateRequiredPreset({
  presetName,
  presetMetadata,
  type,
  config,
  errors,
}) {
  if (!presetName || !presetMetadata) {
    errors.push(
      `[Motion System] Unknown ${type} "${presetName || "(missing)"}" in scene "${config.scene}" (#${config.id}).`
    );
  }
}

function validateOptionalPreset({
  presetName,
  presetMetadata,
  type,
  config,
  warnings,
  errors,
}) {
  if (!presetName) {
    return;
  }

  if (!presetMetadata) {
    warnings.push(
      `[Motion System] Unknown ${type} "${presetName}" in scene "${config.scene}" (#${config.id}).`
    );
    return;
  }

  if (presetMetadata.status === "disabled") {
    errors.push(
      `[Motion System] Disabled ${type} "${presetName}" is used in scene "${config.scene}" (#${config.id}).`
    );
  }
}

function validateStatus({ presetMetadata, config, warnings, errors }) {
  if (!presetMetadata) {
    return;
  }

  if (presetMetadata.status === "experimental") {
    warnings.push(
      `[Motion System] Experimental ${presetMetadata.type} "${presetMetadata.name}" is used in scene "${config.scene}" (#${config.id}).`
    );
  }

  if (presetMetadata.status === "disabled") {
    errors.push(
      `[Motion System] Disabled ${presetMetadata.type} "${presetMetadata.name}" is used in scene "${config.scene}" (#${config.id}).`
    );
  }
}

function validateRequires({ sceneEl, presetMetadata, config, warnings }) {
  presetMetadata?.requires?.forEach((selector) => {
    if (!isDomSelector(selector)) {
      return;
    }

    if (!sceneEl.querySelector(selector)) {
      warnings.push(
        `[Motion System] Preset "${presetMetadata.name}" requires "${selector}" in scene "${config.scene}" (#${config.id}).`
      );
    }
  });
}

function validateExit({ config, metadata, warnings, errors }) {
  if (!config.exit) {
    return;
  }

  const exitMetadata = metadata.exitAnimations?.[config.exit];

  if (!exitMetadata) {
    warnings.push(
      `[Motion System] Unknown exit animation "${config.exit}" in scene "${config.scene}" (#${config.id}).`
    );
    return;
  }

  if (exitMetadata.status === "disabled") {
    errors.push(
      `[Motion System] Disabled exit animation "${config.exit}" is used in scene "${config.scene}" (#${config.id}).`
    );
  }
}

function validateChildMotions({ sceneEl, config, metadata, warnings, errors }) {
  const motionTargets = Array.from(sceneEl.querySelectorAll("[data-motion]"));

  motionTargets.forEach((target) => {
    const motionName = target.dataset.motion?.trim();
    const motionMetadata = metadata.childMotions?.[motionName];

    if (!motionMetadata) {
      warnings.push(
        `[Motion System] Unknown child motion "${motionName || "(missing)"}" in scene "${config.scene}" (#${config.id}).`
      );
      return;
    }

    validateStatus({
      presetMetadata: motionMetadata,
      config,
      warnings,
      errors,
    });
    validateChildRequires({
      target,
      motionMetadata,
      config,
      warnings,
    });
    validateMediaChildMotion({
      sceneEl,
      target,
      motionMetadata,
      config,
      warnings,
    });
  });
}

function validateChildRequires({ target, motionMetadata, config, warnings }) {
  motionMetadata.requires?.forEach((selector) => {
    if (!isDomSelector(selector)) {
      return;
    }

    if (!target.querySelector(selector)) {
      warnings.push(
        `[Motion System] Child motion "${motionMetadata.name}" requires "${selector}" in scene "${config.scene}" (#${config.id}).`
      );
    }
  });
}

function validateMediaChildMotion({
  sceneEl,
  target,
  motionMetadata,
  config,
  warnings,
}) {
  const targetsMedia =
    motionMetadata.targets?.some((selector) => selector.includes("media")) ||
    motionMetadata.name.includes("image");

  if (!targetsMedia) {
    return;
  }

  if (!sceneEl.querySelector('[data-animate="media"]')) {
    warnings.push(
      `[Motion System] Child motion "${motionMetadata.name}" targets media but scene "${config.scene}" (#${config.id}) has no [data-animate="media"].`
    );
  }

  if (target.getAttribute("data-animate") !== "media") {
    warnings.push(
      `[Motion System] Child motion "${motionMetadata.name}" should be placed on [data-animate="media"] in scene "${config.scene}" (#${config.id}).`
    );
  }
}

function isDomSelector(value) {
  return typeof value === "string" && /^[.#\[]/.test(value);
}
