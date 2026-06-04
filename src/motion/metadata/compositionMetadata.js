export const compositionMetadata = {
  "normal-scroll": {
    name: "normal-scroll",
    status: "stable",
    requiresNextScene: false,
    requiresViewportCoverage: false,
    requiresPinning: false,
    requiresStacking: false,
    supportsMobile: true,
    supportsReducedMotion: true,
    risks: [],
    notes: [
      "Runs the enter phase when the scene reaches the configured viewport threshold.",
      "Does not compose current and next scenes.",
    ],
  },

  "pinned-scroll": {
    name: "pinned-scroll",
    status: "stable",
    requiresNextScene: false,
    requiresViewportCoverage: false,
    requiresPinning: true,
    requiresStacking: false,
    supportsMobile: true,
    supportsReducedMotion: true,
    risks: [
      "Pinning can feel heavy on small screens if scene content exceeds the viewport.",
    ],
    notes: [
      "Pins only the current scene.",
      "Stable v1 behavior does not run exit animations.",
    ],
  },

  "crossfade-safe": {
    name: "crossfade-safe",
    status: "reserved",
    requiresNextScene: true,
    requiresViewportCoverage: true,
    requiresPinning: false,
    requiresStacking: true,
    supportsMobile: true,
    supportsReducedMotion: true,
    risks: [
      "Can create confusing text overlap if current and next scenes both contain dense copy.",
      "Requires strict handoff timing so the current scene never fades out before the next scene is visible.",
    ],
    notes: [
      "Reserved for v2 planning only.",
      "Intended to crossfade current and next scenes while guaranteeing viewport coverage.",
    ],
  },

  "cover-safe": {
    name: "cover-safe",
    status: "experimental-beta",
    requiresNextScene: true,
    requiresViewportCoverage: true,
    requiresPinning: false,
    requiresStacking: true,
    supportsMobile: true,
    supportsReducedMotion: true,
    risks: [
      "Can expose visual gaps if the next scene does not cover the viewport.",
      "Requires a visible background or fullscreen media on the next scene.",
    ],
    notes: [
      "Experimental beta transition for isolated demos and controlled content.",
      "Intended to let the next scene cover the current scene before handoff.",
    ],
  },

  "stack-safe": {
    name: "stack-safe",
    status: "reserved",
    requiresNextScene: true,
    requiresViewportCoverage: true,
    requiresPinning: false,
    requiresStacking: true,
    supportsMobile: false,
    supportsReducedMotion: true,
    risks: [
      "Can leave accidental z-index state behind if cleanup fails.",
      "Highest risk transition candidate because it temporarily changes scene stacking.",
    ],
    notes: [
      "Reserved for v2 planning only.",
      "Requires isolated demos and cleanup validation before runtime implementation.",
    ],
  },
};
