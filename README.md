# Motion System

Declarative fullscreen motion system for GSAP-powered websites.

## Concept

Every `section.scene` is a fullscreen scene. A scene stays in normal document
flow, declares motion with data attributes, and uses reusable presets instead
of writing GSAP inside each section.

Version 1.5 keeps the 1.0 visual baseline and introduces internal Motion
Tokens for preset values.

The stable public API is unchanged.

Version 1.6 adds Preset Metadata as an internal documentation source of truth.
It does not change runtime behavior.

Version 1.7 adds `inspect()` as a passive debug API.

Version 1.8 adds a passive Validation Layer used by `inspect()`.

Version 2.0-alpha.2 adds Transition Inspector diagnostics for advanced
transitions such as `cover-safe`. It does not change animation behavior.

`cover-safe` is currently experimental beta. It is allowed in isolated demos
and controlled content demos, but it is not recommended for production pages
with video, iframe, forms, canvas, or highly interactive content.

Version 1.0/1.5 is intentionally conservative:

- Scenes are fullscreen.
- Scene transitions are simple.
- Exit animations are disabled.
- Experimental motion must be opt-in.

## Setup

```html
<link rel="stylesheet" href="./src/motion/motion.css">

<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script type="module">
  import { initMotionSystem } from "./src/motion/index.js";

  initMotionSystem();
</script>
```

## Stable HTML API

- `data-scene`: selects the scene preset.
- `data-enter`: selects the scene enter animation.
- `data-transition`: selects how the scene enters the scroll flow.
- `data-motion`: optional child motion inside the scene.
- `data-animate`: marks internal elements as animation targets.

`data-exit`, timing tokens, overlap tokens, and experimental transition APIs are
not part of the stable 1.0 API.

## Internal Motion Tokens

Motion Tokens live in `src/motion/tokens/motionTokens.js`.

They centralize preset values for:

- duration
- ease
- stagger
- distance
- scale
- parallaxRange

Tokens are internal in v1.5. They do not change the HTML API and do not change
the visual output from the v1.0 stable baseline.

## Internal Preset Metadata

Preset Metadata lives in `src/motion/metadata/presetMetadata.js`.

It describes scenes, transitions, enter animations, exit animations, and child
motions with:

- name
- type
- status
- phase
- requirements
- targets
- layout risk
- transition compatibility
- notes

Metadata is internal in v1.6. It is not used to modify animation behavior yet.

## Debug / Inspect

`inspect()` is a passive diagnostic helper exposed on the initialized motion
system object:

```js
window.motionSystem.inspect();
```

It returns:

- detected scenes
- resolved scene, enter, and transition names
- transition diagnostics
- child motions
- matching preset metadata
- warnings for unknown presets
- warnings for experimental child motions
- warnings for missing `.scene__media-inner` on `image-parallax-soft`

`inspect()` does not create ScrollTriggers, does not execute GSAP, and does not
modify the DOM.

For advanced transitions, each scene includes:

```js
transitionDiagnostics: {
  transition: "cover-safe",
  currentSceneIndex: 0,
  nextSceneIndex: 1,
  hasNextScene: true,
  requiresNextScene: true,
  cloneStrategy: true,
  cloneRiskLevel: "low",
  canRunSafely: true,
  warnings: [],
  errors: []
}
```

`transitionDiagnostics` is passive. It only reads DOM structure and metadata.
For `cover-safe`, it reports next-scene availability, clone risk, interactive
controls, media, iframe, canvas, and whether the transition can run safely.

## Validation Layer

`validateSceneConfig()` lives in
`src/motion/validation/validateSceneConfig.js`.

It validates a scene against `presetMetadata` and returns:

```js
{
  valid: true,
  warnings: [],
  errors: []
}
```

The validation layer checks:

- unknown scenes
- unknown enter animations
- unknown transitions
- unknown child motions
- experimental preset usage
- disabled preset usage
- missing required selectors
- `image-parallax-soft` wrapper contract
- pinned scenes with no `[data-animate]` targets
- media child motions without media targets

In v1.8, validation is report-only. It does not block runtime.

## Stable Example

```html
<section
  class="scene"
  data-scene="hero-side-by-side"
  data-enter="fade-up"
  data-transition="pinned-scroll"
>
  <div class="scene__inner">
    <div class="scene__content">
      <h1 class="scene__title" data-animate="title" data-motion="text-stagger-up">
        Title
      </h1>
      <p class="scene__text" data-animate="text" data-motion="text-stagger-up">
        Body copy.
      </p>
    </div>

    <div class="scene__media" data-animate="media" data-motion="image-zoom-out">
      <img class="scene__image" src="./image.jpg" alt="">
    </div>
  </div>
</section>
```

## Scenes

- `hero-side-by-side`
- `hero-centered`
- `image-fullscreen`
- `text-media-scroll`

Scene presets validate minimum structure, add the matching layout class, and
provide defaults for `data-enter` and `data-transition` when those attributes
are missing.

## Transitions

Stable transitions:

- `normal-scroll`: no pin; runs enter when the scene enters the viewport.
- `pinned-scroll`: pins the current scene, runs enter, holds, then releases.

Experimental transitions:

- `cover-safe`: experimental beta transition allowed in isolated demos and
  controlled content demos. It is not recommended for production pages with
  video, iframe, forms, canvas, or highly interactive content.

`cover-safe` can be used only when:

- A next scene exists.
- `cloneRiskLevel` is `low` or `medium`.
- `window.motionSystem.inspect().errors.length === 0`.
- The cloned next scene does not contain video, iframe, form, or canvas.
- The cloned next scene does not depend on high-risk interactive state.

Disabled transitions:

- `overlap`
- `scene-cover`

## Enter Animations

Stable enter animations:

- `fade-up`
- `fade-up-top`
- `mask-up`
- `scale-in`

Enter animations do not create ScrollTrigger and do not decide when they run.

## Child Motions

Stable child motions:

- `text-stagger-up`
- `image-zoom-out`

Experimental child motions:

- `image-parallax-soft`

Child motions are declared with `data-motion` and run inside the current scene.
They must not alter scene stacking, document flow, or transition behavior.

### `image-zoom-out`

- Target: `[data-animate="media"]`
- Initial: `scale: 1.15`, `opacity: 0`
- Final: `scale: 1`, `opacity: 1`
- Does not depend on pinning.
- Does not alter layout when used on `.scene__media`.

### `image-parallax-soft`

- Status: experimental.
- Target: `.scene__media-inner` inside `[data-animate="media"]`.
- Active only in `pinned-scroll`.
- Moves from `yPercent: 6` to `yPercent: -6`.
- Does not create a new ScrollTrigger.

Required markup:

```html
<div class="scene__media" data-animate="media" data-motion="image-parallax-soft">
  <div class="scene__media-inner">
    <img class="scene__image" src="./image.jpg" alt="">
  </div>
</div>
```

If `.scene__media-inner` is missing, the system logs a warning and skips the
parallax without breaking the page.

## What Not To Use Yet

- Do not use `data-exit` in stable demos.
- Do not use `fade-out`, `slide-out-left`, or `slide-out-up`.
- Do not use `overlap`.
- Do not use `scene-cover`.
- Do not use `cover-safe` in production with video, iframe, forms, canvas, or
  highly interactive content.
- Do not use `image-parallax-soft` as a scene default.
- Do not animate `.scene__media` with parallax; animate `.scene__media-inner`.

## Creating A Stable Scene

1. Start with `<section class="scene" data-scene="...">`.
2. Add `.scene__inner`.
3. Add reusable slots like `.scene__content`, `.scene__media`, `.scene__title`, `.scene__text`.
4. Add `data-animate` roles to elements that can move.
5. Choose only `normal-scroll` or `pinned-scroll`.
6. Choose a stable enter preset.
7. Add stable child motion only when needed.
8. Do not add exits, overlap, cover, or stacking behavior.

## Demos

- Official v1 demo: `http://127.0.0.1:4173/demo/`
- Diagnostic demo: `http://127.0.0.1:4173/demo/diagnostic.html`
- Cover-safe simple beta demo: `http://127.0.0.1:4173/demo/v2-cover-safe.html`
- Cover-safe content beta demo: `http://127.0.0.1:4173/demo/v2-cover-safe-content.html`
- Cover-safe stress beta demo: `http://127.0.0.1:4173/demo/v2-cover-safe-stress.html`
