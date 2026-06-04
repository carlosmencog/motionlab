import { createScene } from "./createScene.js";
import { parseSceneConfig } from "./parseSceneConfig.js";
import { sceneRegistry } from "../registries/scenes.js";
import { enterAnimations } from "../registries/enterAnimations.js";
import { exitAnimations } from "../registries/exitAnimations.js";
import { childMotions } from "../registries/childMotions.js";
import { transitions } from "../registries/transitions.js";
import { getReducedMotionPreference } from "../utils/reducedMotion.js";
import { ensureGsap, ensureScrollTrigger } from "../utils/ensureGsap.js";
import { inspectMotionSystem } from "../debug/inspectMotionSystem.js";

const DEFAULT_SELECTOR = "section.scene[data-scene]";
const rootInstances = new WeakMap();

export function initMotionSystem(options = {}) {
  const {
    root = typeof document !== "undefined" ? document : null,
    selector = DEFAULT_SELECTOR,
    registries = {},
    debug = false,
  } = options;

  if (!root?.querySelectorAll) {
    const message = "[Motion System] No valid root was provided for scene discovery.";
    console.warn(message);

    return {
      scenes: [],
      warnings: [message],
      refresh() {},
      destroy() {},
    };
  }

  rootInstances.get(root)?.destroy?.();

  const resolvedRegistries = {
    scenes: registries.scenes ?? sceneRegistry,
    enterAnimations: registries.enterAnimations ?? enterAnimations,
    exitAnimations: registries.exitAnimations ?? exitAnimations,
    childMotions: registries.childMotions ?? childMotions,
    transitions: registries.transitions ?? transitions,
  };

  const elements = Array.from(root.querySelectorAll(selector));
  const scenes = [];
  const warnings = [];

  elements.forEach((element, index) => {
    try {
      const config = parseSceneConfig(element, index);
      const scene = createScene({
        element,
        nextElement: elements[index + 1] ?? null,
        index,
        config: {
          ...config,
          hasNextScene: Boolean(elements[index + 1]),
        },
        registries: resolvedRegistries,
        reducedMotion: getReducedMotionPreference(),
      });

      scenes.push(scene);
      warnings.push(...scene.warnings);
    } catch (error) {
      const message = `[Motion System] Scene ${index} could not be initialized.`;
      warnings.push(message);
      console.warn(message, error);
    }
  });

  const motionSystem = {
    scenes,
    warnings,
    inspect: inspectMotionSystem,
    refresh() {
      scenes.forEach((scene) => scene.refresh?.());
      refreshScrollTrigger();
    },
    destroy() {
      scenes.forEach((scene) => scene.destroy?.());
      rootInstances.delete(root);
      refreshScrollTrigger();
    },
  };

  rootInstances.set(root, motionSystem);
  requestMotionRefresh(motionSystem);

  if (debug) {
    console.info("[Motion System] initialized", {
      sceneCount: scenes.length,
      warnings,
    });
  }

  return motionSystem;
}

function requestMotionRefresh(motionSystem) {
  const refresh = () => motionSystem.refresh();

  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(refresh);
  } else {
    setTimeout(refresh, 0);
  }

  if (typeof window !== "undefined") {
    window.addEventListener("load", refresh, { once: true });
  }
}

function refreshScrollTrigger() {
  const gsap = ensureGsap();
  const ScrollTrigger = gsap ? ensureScrollTrigger(gsap) : null;

  ScrollTrigger?.refresh?.();
}
