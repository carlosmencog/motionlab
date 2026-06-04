export const sceneRegistry = {
  "hero-side-by-side": heroSideBySide,
  "hero-centered": heroCentered,
  "image-fullscreen": imageFullscreen,
  "text-media-scroll": textMediaScroll,
};

export function heroSideBySide({ sceneEl, config }) {
  return createScenePreset({
    sceneEl,
    config,
    name: "hero-side-by-side",
    requiredSelectors: [".scene__inner"],
    requiredRoles: ["title", "media"],
    defaults: {
      enter: "fade-up",
      transition: "normal-scroll",
    },
  });
}

export function heroCentered({ sceneEl, config }) {
  return createScenePreset({
    sceneEl,
    config,
    name: "hero-centered",
    requiredSelectors: [".scene__inner"],
    requiredRoles: ["title"],
    defaults: {
      enter: "mask-up",
      transition: "normal-scroll",
    },
  });
}

export function imageFullscreen({ sceneEl, config }) {
  return createScenePreset({
    sceneEl,
    config,
    name: "image-fullscreen",
    requiredSelectors: [".scene__inner"],
    requiredRoles: ["media"],
    defaults: {
      enter: "scale-in",
      transition: "pinned-scroll",
    },
  });
}

export function textMediaScroll({ sceneEl, config }) {
  return createScenePreset({
    sceneEl,
    config,
    name: "text-media-scroll",
    requiredSelectors: [".scene__inner"],
    requiredRoles: ["title", "media"],
    defaults: {
      enter: "fade-up",
      transition: "pinned-scroll",
    },
  });
}

function createScenePreset({
  sceneEl,
  config,
  name,
  requiredSelectors = [],
  requiredRoles,
  defaults,
}) {
  const warnings = [];

  sceneEl?.classList.add(`scene--${name}`);

  requiredSelectors.forEach((selector) => {
    if (!sceneEl?.querySelector(selector)) {
      warnings.push(
        `[Motion System] Scene "${config.scene}" (#${config.id}) is missing required element ${selector}.`
      );
    }
  });

  requiredRoles.forEach((roleRequirement) => {
    if (!hasRequiredRole(sceneEl, roleRequirement)) {
      warnings.push(createMissingRoleWarning(config, roleRequirement));
    }
  });

  return {
    name,
    config: {
      ...config,
      enter: config.enter || defaults.enter,
      exit: undefined,
      transition: config.transition || defaults.transition,
    },
    warnings,
  };
}

function hasRequiredRole(sceneEl, roleRequirement) {
  const roles = Array.isArray(roleRequirement)
    ? roleRequirement
    : [roleRequirement];

  return roles.some((role) =>
    sceneEl?.querySelector(`[data-animate="${role}"]`)
  );
}

function createMissingRoleWarning(config, roleRequirement) {
  const roleLabel = Array.isArray(roleRequirement)
    ? roleRequirement.map((role) => `[data-animate="${role}"]`).join(" or ")
    : `[data-animate="${roleRequirement}"]`;

  return `[Motion System] Scene "${config.scene}" (#${config.id}) is missing required element ${roleLabel}.`;
}
