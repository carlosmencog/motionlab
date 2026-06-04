export { initMotionSystem } from "./core/initMotionSystem.js";
export { parseSceneConfig } from "./core/parseSceneConfig.js";
export { createScene } from "./core/createScene.js";
export { inspectMotionSystem } from "./debug/inspectMotionSystem.js";
export { validateSceneConfig } from "./validation/validateSceneConfig.js";
export { compositionMetadata } from "./metadata/compositionMetadata.js";
export { templateMetadata } from "../composition/metadata/templateMetadata.js";
export { templateRegistry } from "../composition/registries/templates.js";
export { validateTemplateConfig } from "../composition/validation/validateTemplateConfig.js";

export { sceneRegistry } from "./registries/scenes.js";
export { enterAnimations } from "./registries/enterAnimations.js";
export { exitAnimations } from "./registries/exitAnimations.js";
export { childMotions } from "./registries/childMotions.js";
export { transitions } from "./registries/transitions.js";
