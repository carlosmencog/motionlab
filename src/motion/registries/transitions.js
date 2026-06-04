export const transitions = {
  "normal-scroll": normalScroll,
  "pinned-scroll": pinnedScroll,
  "cover-safe": coverSafe,
};

export function normalScroll({
  sceneEl,
  enterAnimation,
  ScrollTrigger,
}) {
  if (!sceneEl || !ScrollTrigger || !enterAnimation) {
    return createTransitionInstance();
  }

  resetAnimation(enterAnimation);

  const trigger = ScrollTrigger.create({
    trigger: sceneEl,
    start: "top 80%",
    animation: enterAnimation,
    toggleActions: "play none none reverse",
  });

  return createTransitionInstance({ triggers: [trigger] });
}

export function pinnedScroll({
  sceneEl,
  enterAnimation,
  pinnedAnimations = [],
  gsap,
  ScrollTrigger,
  config = {},
}) {
  if (!sceneEl || !gsap || !ScrollTrigger) {
    return createTransitionInstance();
  }

  const isFirstScene = config.index === 0;
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: sceneEl,
      start: "top top",
      end: "+=75%",
      pin: true,
      scrub: true,
      anticipatePin: 1,
      pinSpacing: true,
    },
  });

  if (isFirstScene) {
    resetAnimation(enterAnimation);
    enterAnimation?.play?.(0);
  } else {
    addChildAnimation(timeline, enterAnimation, 0, 0.25);
  }
  pinnedAnimations.forEach((animation) => {
    addChildAnimation(timeline, animation, 0, 1);
  });
  timeline.to({}, { duration: 0.4, ease: "none" }, 0.25);
  timeline.to({}, { duration: 0.35, ease: "none" }, 0.65);
  timeline.to({}, { duration: 0.001, ease: "none" }, 1);

  return createTransitionInstance({
    animation: timeline,
    triggers: [timeline.scrollTrigger].filter(Boolean),
  });
}

export function coverSafe({
  sceneEl,
  nextSceneEl,
  enterAnimation,
  gsap,
  ScrollTrigger,
  config = {},
}) {
  if (!sceneEl || !gsap || !ScrollTrigger) {
    return createTransitionInstance();
  }

  if (!nextSceneEl) {
    console.warn(
      `[Motion System] cover-safe requires a next scene (#${config.id}). Falling back to pinned-scroll behavior.`
    );

    return pinnedScroll({
      sceneEl,
      enterAnimation,
      gsap,
      ScrollTrigger,
      config,
    });
  }

  resetAnimation(enterAnimation);

  const currentInner = sceneEl.querySelector(".scene__inner") ?? sceneEl;
  const coverClass = "scene--cover-safe-active";
  const coverClone = nextSceneEl.cloneNode(true);
  const cloneContent = coverClone.querySelector(".scene__content");

  sanitizeCoverClone(coverClone, config);
  coverClone.classList.add("scene--cover-safe-clone");
  coverClone.removeAttribute("data-scene");
  coverClone.removeAttribute("data-enter");
  coverClone.removeAttribute("data-transition");
  sceneEl.after(coverClone);
  gsap.set(coverClone, {
    position: "fixed",
    inset: 0,
    width: "100%",
    zIndex: 2,
    yPercent: 100,
    autoAlpha: 0,
    pointerEvents: "none",
  });
  gsap.set(cloneContent, {
    autoAlpha: 0.88,
    y: 28,
  });

  const setCoverState = () => {
    sceneEl.classList.add(coverClass);
    gsap.set(sceneEl, {
      zIndex: 1,
    });
    gsap.set(coverClone, {
      autoAlpha: 1,
      yPercent: 100,
    });
    gsap.set(cloneContent, {
      autoAlpha: 0.88,
      y: 28,
    });
  };
  const clearCoverState = () => {
    if (!sceneEl.classList.contains(coverClass)) {
      return;
    }

    sceneEl.classList.remove(coverClass);
    gsap.set([sceneEl, currentInner, cloneContent], {
      clearProps: "zIndex,yPercent,transform",
    });
    gsap.set(coverClone, {
      autoAlpha: 0,
      yPercent: 100,
    });
  };

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: sceneEl,
      start: "top top",
      end: "+=75%",
      pin: true,
      scrub: true,
      anticipatePin: 1,
      pinSpacing: true,
      onEnter: setCoverState,
      onEnterBack: setCoverState,
      onLeave: clearCoverState,
      onLeaveBack: clearCoverState,
    },
  });

  if (config.index === 0) {
    enterAnimation?.kill?.();
    gsap.set(sceneEl.querySelectorAll("[data-animate]"), {
      opacity: 1,
      clearProps: "transform",
    });
  } else {
    addChildAnimation(timeline, enterAnimation, 0, 0.2);
  }
  timeline.to(
    currentInner,
    {
      yPercent: -8,
      scale: 0.98,
      duration: 0.75,
      ease: "power2.inOut",
    },
    0
  );
  timeline.to(
    coverClone,
    {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.75,
      ease: "power3.out",
      immediateRender: false,
    },
    0
  );
  timeline.to(
    cloneContent,
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.45,
      ease: "power3.out",
      immediateRender: false,
    },
    0.18
  );
  timeline.to({}, { duration: 0.25, ease: "none" }, 0.75);

  return createTransitionInstance({
    animation: timeline,
    triggers: [timeline.scrollTrigger].filter(Boolean),
    destroy() {
      clearCoverState();
      coverClone.remove();
    },
  });
}

function sanitizeCoverClone(coverClone, config) {
  coverClone.setAttribute("aria-hidden", "true");
  coverClone.style.pointerEvents = "none";

  if ("inert" in coverClone) {
    coverClone.inert = true;
  }

  sanitizeCloneAttributes(coverClone);
  sanitizeCloneFocus(coverClone);
  sanitizeCloneMedia(coverClone, config);
}

function sanitizeCloneAttributes(coverClone) {
  const attributesToRemove = [
    "id",
    "for",
    "aria-labelledby",
    "aria-describedby",
    "aria-controls",
    "aria-owns",
    "autofocus",
  ];

  [coverClone, ...coverClone.querySelectorAll("*")].forEach((element) => {
    attributesToRemove.forEach((attribute) => {
      element.removeAttribute(attribute);
    });
  });
}

function sanitizeCloneFocus(coverClone) {
  [coverClone, ...coverClone.querySelectorAll(
    'a[href], button, input, select, textarea, summary, [tabindex]'
  )]
    .filter((element) =>
      element.matches?.(
        'a[href], button, input, select, textarea, summary, [tabindex]'
      )
    )
    .forEach((element) => {
      element.setAttribute("tabindex", "-1");
    });
}

function sanitizeCloneMedia(coverClone, config) {
  coverClone.querySelectorAll("video").forEach((video) => {
    video.autoplay = false;
    video.removeAttribute("autoplay");
    video.muted = true;
    video.pause?.();
  });

  coverClone.querySelectorAll("audio").forEach((audio) => {
    audio.muted = true;
  });

  if (coverClone.querySelector("iframe")) {
    console.warn(
      `[Motion System] cover-safe clone contains iframe content (#${config.id}). Embedded content may be duplicated visually.`
    );
  }

  if (coverClone.querySelector("canvas")) {
    console.warn(
      `[Motion System] cover-safe clone contains canvas content (#${config.id}). Cloned canvas pixels may not match the source scene.`
    );
  }
}

function addChildAnimation(timeline, animation, position, duration) {
  if (!timeline || !animation) {
    return;
  }

  resetAnimation(animation);
  if (Number.isFinite(duration) && duration > 0) {
    animation.duration?.(duration);
  }
  animation.paused?.(false);
  timeline.add(animation, position);
}

function resetAnimation(animation) {
  animation?.pause?.(0);
}

function createTransitionInstance({
  animation = null,
  triggers = [],
  destroy = null,
} = {}) {
  return {
    animation,
    triggers,
    refresh() {
      triggers.forEach((trigger) => trigger?.refresh?.());
    },
    destroy() {
      triggers.forEach((trigger) => trigger?.kill?.());
      animation?.kill?.();
      destroy?.();
    },
  };
}
