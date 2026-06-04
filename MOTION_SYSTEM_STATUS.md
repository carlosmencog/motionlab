# Motion System Status

Version: `2.0-experimental-beta-cover-safe`

Baseline label: `v1.0-stable-baseline`

## Stable

- Fullscreen scenes
- `hero-side-by-side`
- `hero-centered`
- `image-fullscreen`
- `text-media-scroll`
- `normal-scroll`
- `pinned-scroll`
- `fade-up`
- `fade-up-top`
- `mask-up`
- `scale-in`
- `text-stagger-up`
- `image-zoom-out`

## Experimental

- `image-parallax-soft`

## Experimental Beta

- `cover-safe`

## Deprecated

- `overlap`
- `scene-cover`

## Disabled By Default

- `fade-out`
- `slide-out-left`
- `slide-out-up`

Exit presets may remain in code, but they must not execute in stable demos or
scene defaults.

## Known Issues

- `image-parallax-soft` can create vertical space if it is applied to the wrong wrapper.
- The parallax target must be `.scene__media-inner` inside `[data-animate="media"]`.
- `.scene__media` must remain the layout wrapper and keep `overflow: hidden`.
- Experimental presets must not be used as scene defaults.
- `cover-safe` is not recommended yet for production pages with video, iframe,
  forms, canvas, or highly interactive content.

## Cover-Safe Beta Status

cover-safe beta status:

- simple demo: passed
- content demo: passed
- stress demo: passed
- cloneRisk low: passed
- cloneRisk medium: passed with warnings
- cloneRisk high: blocked / not safe
- mobile manual: pending
- real production: not approved

`cover-safe` has passed:

- Simple isolated demo.
- Controlled content demo.
- Clone hardening.
- Inspect diagnostics.
- Validation warnings.
- No known visual gaps in current demos.

Still pending:

- Real mobile device testing.
- Manual resize testing.
- Reload mid-scroll testing.
- Highly interactive content testing.
- Advanced media testing.

## Promotion Criteria

An experimental preset can be promoted only when:

- It does not change document flow.
- It does not create extra vertical or horizontal space.
- It does not require stacking, overlap, or z-index changes.
- It works with repeated `initMotionSystem()` calls.
- It has a demo example and a diagnostic fallback.
- It has clear validation warnings for required markup.

## Stable API

- `data-scene`
- `data-enter`
- `data-transition`
- `data-motion`
- `data-animate`

Experimental presets must be activated explicitly with `data-motion`.

## Stable Internal API

- Motion Tokens
- Preset Metadata
- `inspect()`
- Validation Layer

## Experimental Debug API

- Transition Inspector

Motion Tokens centralize preset values for duration, ease, stagger, distance,
scale, and parallax range. They are internal only and do not change the public
HTML API.

Preset Metadata describes each preset's type, status, phase, requirements,
targets, layout impact, risks, and notes. It is internal only and does not
change runtime behavior.

`inspect()` reads detected scenes, data attributes, child motions, and preset
metadata. It is a passive debug API and does not create ScrollTriggers, execute
GSAP, or modify the DOM.

The Validation Layer checks scene configuration against Preset Metadata. It is
report-only in v1.8 and does not block runtime.

Transition Inspector extends `inspect()` with `transitionDiagnostics` for
advanced transitions such as `cover-safe`. It reports next-scene availability,
clone strategy, clone risk level, warnings, errors, and `canRunSafely`. It is
passive and does not create GSAP animations, ScrollTriggers, clones, or DOM
changes.

## Do Not Touch Without Reason

- `pinned-scroll`
- `normal-scroll`
- Fullscreen scene CSS
- Parallax wrapper contract
- `createScene` validation

Changes to these areas require a clear bug, a before/after test, and a manual
baseline check.

## Allowed Next Work

Allowed after v1.0:

- Internal duplicate consolidation

Not allowed yet:

- Exits
- `overlap`
- `scene-cover`
- Slide transitions
- z-index choreography outside isolated experimental transition demos
