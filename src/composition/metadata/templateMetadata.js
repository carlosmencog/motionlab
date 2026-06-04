export const templateMetadata = {
  "saas-landing": {
    name: "saas-landing",
    status: "v3-alpha",
    target: "SaaS, AI tools, productivity software, and workflow platforms.",
    requiredBlocks: ["Hero", "FeatureGrid", "CTASection", "SiteFooter"],
    optionalBlocks: ["Hero", "FeatureGrid"],
    allowedTransitions: ["normal-scroll", "pinned-scroll", "cover-safe"],
    prohibitedTransitions: [
      "overlap",
      "scene-cover",
      "fade-out",
      "slide-out-left",
      "slide-out-up",
    ],
    recommendedThemes: ["saas-dark", "saas-light", "product-neutral"],
  },

  "agency-landing": {
    name: "agency-landing",
    status: "v3-alpha",
    target: "Creative studios, agencies, consultancies, and service firms.",
    requiredBlocks: ["Hero", "FeatureGrid", "CTASection", "SiteFooter"],
    optionalBlocks: ["Hero", "FeatureGrid"],
    allowedTransitions: ["normal-scroll", "pinned-scroll", "cover-safe"],
    prohibitedTransitions: [
      "overlap",
      "scene-cover",
      "fade-out",
      "slide-out-left",
      "slide-out-up",
    ],
    recommendedThemes: ["editorial-light", "studio-dark", "portfolio-neutral"],
  },

  "product-launch": {
    name: "product-launch",
    status: "v3-alpha",
    target: "Product launches, feature launches, physical products, and campaigns.",
    requiredBlocks: ["Hero", "FeatureGrid", "CTASection", "SiteFooter"],
    optionalBlocks: ["Hero", "FeatureGrid"],
    allowedTransitions: ["normal-scroll", "pinned-scroll", "cover-safe"],
    prohibitedTransitions: [
      "overlap",
      "scene-cover",
      "fade-out",
      "slide-out-left",
      "slide-out-up",
    ],
    recommendedThemes: ["launch-dark", "launch-light", "product-editorial"],
  },

  "case-study": {
    name: "case-study",
    status: "v3-alpha",
    target: "Project stories, client outcomes, portfolio details, and result narratives.",
    requiredBlocks: ["Hero", "FeatureGrid", "CTASection", "SiteFooter"],
    optionalBlocks: ["FeatureGrid", "Hero"],
    allowedTransitions: ["normal-scroll", "pinned-scroll", "cover-safe"],
    prohibitedTransitions: [
      "overlap",
      "scene-cover",
      "fade-out",
      "slide-out-left",
      "slide-out-up",
    ],
    recommendedThemes: ["case-light", "case-dark", "editorial-neutral"],
  },
};
