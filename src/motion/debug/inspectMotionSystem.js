import { presetMetadata } from "../metadata/presetMetadata.js";
import { compositionMetadata } from "../metadata/compositionMetadata.js";
import { validateSceneConfig } from "../validation/validateSceneConfig.js";
import { templateMetadata } from "../../composition/metadata/templateMetadata.js";
import { validateTemplateConfig } from "../../composition/validation/validateTemplateConfig.js";

const VERSION = "2.0-alpha.2";
const DEFAULT_SELECTOR = "section.scene[data-scene]";
const SCENE_DEFAULTS = {
  "hero-side-by-side": {
    enter: "fade-up",
    transition: "normal-scroll",
  },
  "hero-centered": {
    enter: "mask-up",
    transition: "normal-scroll",
  },
  "image-fullscreen": {
    enter: "scale-in",
    transition: "pinned-scroll",
  },
  "text-media-scroll": {
    enter: "fade-up",
    transition: "pinned-scroll",
  },
};

export function inspectMotionSystem() {
  const root = typeof document !== "undefined" ? document : null;
  const warnings = [];
  const errors = [];

  if (!root?.querySelectorAll) {
    return {
      version: VERSION,
      scenes: [],
      warnings: ["[Motion System] inspect() could not find a document root."],
      errors: [],
    };
  }

  const elements = Array.from(root.querySelectorAll(DEFAULT_SELECTOR));
  const template = inspectTemplate(root, warnings, errors);
  const scenes = elements.map((element, index) =>
    inspectScene(element, index, elements, warnings, errors)
  );

  return {
    version: VERSION,
    template,
    scenes,
    warnings,
    errors,
  };
}

function inspectTemplate(root, globalWarnings, globalErrors) {
  const templateEl = root.querySelector?.("[data-template]") ?? null;
  const templateName = readData(templateEl, "template");

  if (!templateName) {
    return null;
  }

  const blocks = Array.from(
    templateEl.querySelectorAll?.("[data-template-block]") ?? []
  ).map((element, index) => ({
    index,
    element,
    block: readData(element, "templateBlock"),
  }));
  const validation = validateTemplateConfig({
    templateName,
    blockNames: blocks.map((block) => block.block).filter(Boolean),
    metadata: templateMetadata,
  });

  globalWarnings.push(...validation.warnings);
  globalErrors.push(...validation.errors);

  return {
    name: templateName,
    element: templateEl,
    blocks,
    warnings: validation.warnings,
    errors: validation.errors,
    valid: validation.valid,
    metadata: templateMetadata[templateName] ?? null,
  };
}

function inspectScene(element, index, elements, globalWarnings, globalErrors) {
  const warnings = [];
  const errors = [];
  const scene = readData(element, "scene");
  const defaults = SCENE_DEFAULTS[scene] ?? {};
  const enter = readData(element, "enter") || defaults.enter;
  const transition = readData(element, "transition") || defaults.transition;
  const exit = readData(element, "exit");
  const config = {
    id: element.id || `scene-${index + 1}`,
    index,
    scene,
    enter,
    exit,
    transition,
    hasNextScene: Boolean(elements[index + 1]),
  };
  const sceneMetadata = presetMetadata.scenes[scene] ?? null;
  const enterMetadata = presetMetadata.enterAnimations[enter] ?? null;
  const transitionMetadata = presetMetadata.transitions[transition] ?? null;
  const composition = compositionMetadata[transition] ?? null;
  const childMotions = inspectChildMotions(element);
  const validation = validateSceneConfig({
    sceneEl: element,
    nextSceneEl: elements[index + 1] ?? null,
    config,
    metadata: presetMetadata,
  });
  const cloneRiskLevel = getCloneRiskLevel({
    transition,
    cloneSourceEl: elements[index + 1] ?? null,
  });
  const transitionDiagnostics = inspectTransitionDiagnostics({
    transition,
    currentSceneIndex: index,
    nextSceneEl: elements[index + 1] ?? null,
    composition,
    cloneRiskLevel,
  });

  warnings.push(...validation.warnings);
  warnings.push(...transitionDiagnostics.warnings);
  errors.push(...validation.errors);
  errors.push(...transitionDiagnostics.errors);

  globalWarnings.push(...warnings);
  globalErrors.push(...errors);

  return {
    index,
    element,
    scene,
    enter,
    transition,
    cloneRiskLevel,
    transitionDiagnostics,
    childMotions,
    warnings,
    errors,
    valid: validation.valid,
    metadata: {
      scene: sceneMetadata,
      enter: enterMetadata,
      transition: transitionMetadata,
      composition,
    },
  };
}

function inspectChildMotions(sceneEl) {
  return Array.from(sceneEl.querySelectorAll("[data-motion]")).map((target) => {
    const motion = readData(target, "motion");
    const animate = readData(target, "animate");
    const metadata = presetMetadata.childMotions[motion] ?? null;

    return {
      target,
      animate,
      motion,
      status: metadata?.status ?? "unknown",
      requires: metadata?.requires ?? [],
      metadata,
    };
  });
}

function getCloneRiskLevel({ transition, cloneSourceEl }) {
  if (transition !== "cover-safe") {
    return "low";
  }

  if (!cloneSourceEl?.querySelectorAll) {
    return "high";
  }

  if (cloneSourceEl.querySelector("video, iframe, canvas, form")) {
    return "high";
  }

  if (
    cloneSourceEl.querySelector(
      '[id], a[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]'
    )
  ) {
    return "medium";
  }

  return "low";
}

function inspectTransitionDiagnostics({
  transition,
  currentSceneIndex,
  nextSceneEl,
  composition,
  cloneRiskLevel,
}) {
  const warnings = [];
  const errors = [];
  const hasNextScene = Boolean(nextSceneEl);
  const requiresNextScene = Boolean(composition?.requiresNextScene);
  const cloneStrategy = transition === "cover-safe";
  const nextSceneIndex = hasNextScene ? currentSceneIndex + 1 : null;

  if (requiresNextScene && !hasNextScene) {
    errors.push(
      `[Motion System] Transition "${transition}" requires a next scene but scene #${currentSceneIndex} is last.`
    );
  }

  if (cloneStrategy) {
    warnings.push(...getCloneRiskWarnings(nextSceneEl));
  }

  const canRunSafely =
    errors.length === 0 && (!cloneStrategy || cloneRiskLevel !== "high");

  return {
    transition,
    currentSceneIndex,
    nextSceneIndex,
    hasNextScene,
    requiresNextScene,
    cloneStrategy,
    cloneRiskLevel,
    canRunSafely,
    warnings,
    errors,
  };
}

function getCloneRiskWarnings(cloneSourceEl) {
  if (!cloneSourceEl?.querySelector) {
    return [
      "[Motion System] cover-safe clone source is missing; clone cannot be evaluated.",
    ];
  }

  const checks = [
    {
      selector: "[id]",
      message: "[Motion System] cover-safe clone source contains id attributes.",
    },
    {
      selector:
        'a[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]',
      message:
        "[Motion System] cover-safe clone source contains interactive or focusable elements.",
    },
    {
      selector: "video",
      message: "[Motion System] cover-safe clone source contains video media.",
    },
    {
      selector: "iframe",
      message:
        "[Motion System] cover-safe clone source contains iframe content.",
    },
    {
      selector: "canvas",
      message:
        "[Motion System] cover-safe clone source contains canvas content.",
    },
  ];

  return checks
    .filter(({ selector }) => cloneSourceEl.querySelector(selector))
    .map(({ message }) => message);
}

function readData(element, key) {
  return element?.dataset?.[key]?.trim() || "";
}
