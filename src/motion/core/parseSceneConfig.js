const DEFAULTS = {
  enter: undefined,
  exit: undefined,
  transition: undefined,
  scrollLength: "medium",
  transitionSoftness: "soft",
  overlap: false,
};

export function parseSceneConfig(element, index = 0) {
  const scene = readRequiredAttribute(element, "scene");

  return {
    id: element.id || `scene-${index + 1}`,
    index,
    scene,
    enter: readOptionalAttribute(element, "enter", DEFAULTS.enter),
    exit: readOptionalAttribute(element, "exit", DEFAULTS.exit),
    transition: readOptionalAttribute(element, "transition", DEFAULTS.transition),
    scrollLength: readOptionalAttribute(
      element,
      "scrollLength",
      DEFAULTS.scrollLength
    ),
    transitionSoftness: readOptionalAttribute(
      element,
      "transitionSoftness",
      DEFAULTS.transitionSoftness
    ),
    overlap: readOptionalBoolean(element, "overlap", DEFAULTS.overlap),
    duration: readOptionalNumber(element, "duration"),
    delay: readOptionalNumber(element, "delay"),
    stagger: readOptionalNumber(element, "stagger"),
    ease: readOptionalAttribute(element, "ease", undefined),
    debug: element.dataset.debug === "true" || element.dataset.debug === "",
    raw: { ...element.dataset },
  };
}

function readRequiredAttribute(element, name) {
  const value = element.dataset[name]?.trim();

  if (!value) {
    throw new Error(`Missing required data-${toKebabCase(name)} attribute.`);
  }

  return value;
}

function readOptionalAttribute(element, name, fallback) {
  const value = element.dataset[name]?.trim();
  return value || fallback;
}

function readOptionalNumber(element, name) {
  const rawValue = element.dataset[name]?.trim();

  if (!rawValue) {
    return undefined;
  }

  const value = Number(rawValue);
  return Number.isFinite(value) ? value : undefined;
}

function readOptionalBoolean(element, name, fallback) {
  const rawValue = element.dataset[name]?.trim().toLowerCase();

  if (!rawValue) {
    return fallback;
  }

  if (rawValue === "true") {
    return true;
  }

  if (rawValue === "false") {
    return false;
  }

  return fallback;
}

function toKebabCase(value) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}
