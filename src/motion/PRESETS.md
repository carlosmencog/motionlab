# Motion System Presets

Version 1.5 keeps the 1.0 visual baseline and makes preset values consume
internal Motion Tokens from `src/motion/tokens/motionTokens.js`.

Version 1.6 adds internal Preset Metadata in
`src/motion/metadata/presetMetadata.js`.

Version 1.8 adds report-only validation against Preset Metadata.

The documented behavior below is unchanged.

## Stable Scenes

- `hero-side-by-side`
- `hero-centered`
- `image-fullscreen`
- `text-media-scroll`

## Stable Transitions

## normal-scroll

- No pin.
- Runs enter with ScrollTrigger `start: "top 80%"`.
- Uses `toggleActions: "play none none reverse"`.

## pinned-scroll

- Pins only the current scene.
- ScrollTrigger `start: "top top"`.
- ScrollTrigger `end: "+=75%"`.
- ScrollTrigger `pin: true`.
- ScrollTrigger `scrub: true`.
- ScrollTrigger `anticipatePin: 1`.
- ScrollTrigger `pinSpacing: true`.
- Timeline phases:
  - enter: `0` to `0.25`
  - hold: `0.25` to `0.65`
  - release: `0.65` to `1`

## Stable Enter Animations

## fade-up

- Target: `[data-animate]`
- Initial: `opacity: 0`, `y: 48`
- Final: `opacity: 1`, `y: 0`
- Duration: `0.9`
- Ease: `power3.out`
- Stagger: `0.08`

## fade-up-top

- Target: `[data-animate]`
- Initial: `opacity: 0`, `y: -48`
- Final: `opacity: 1`, `y: 0`
- Duration: `1`
- Ease: `power4.out`
- Stagger: `0.08`

## mask-up

- Target: `[data-animate="title"]`, `[data-animate="text"]`
- Initial: `yPercent: 100`
- Final: `yPercent: 0`
- Duration: `1.1`
- Ease: `power4.out`
- Stagger: `0.06`

## scale-in

- Target: `[data-animate="media"]`
- Initial: `opacity: 0`, `scale: 1.12`
- Final: `opacity: 1`, `scale: 1`
- Duration: `1.2`
- Ease: `power3.out`

## Stable Child Motions

## text-stagger-up

- Target: `[data-animate="title"]`, `[data-animate="text"]`, `[data-animate="cta"]`
- Initial: `y: 40`, `opacity: 0`
- Final: `y: 0`, `opacity: 1`
- Duration: `0.9`
- Ease: `power3.out`
- Stagger: `0.08`

## image-zoom-out

- Target: `[data-animate="media"]`
- Initial: `scale: 1.15`, `opacity: 0`
- Final: `scale: 1`, `opacity: 1`
- Duration: `1.2`
- Ease: `power3.out`
- Does not depend on pinning.
- Does not alter layout when used on `.scene__media`.

## Experimental Child Motions

## image-parallax-soft

- Target: `.scene__media-inner` inside `[data-animate="media"]`
- Active only inside `pinned-scroll`.
- Initial: `yPercent: 6`
- Final: `yPercent: -6`
- Duration: `1`
- Ease: `none`
- Runs inside the existing pinned timeline.
- Must be activated explicitly with `data-motion`.

## Disabled By Default

- `fade-out`
- `slide-out-left`
- `slide-out-up`

These exit presets remain in code but are not instantiated by `createScene()`.

## Deprecated

- `overlap`
- `scene-cover`

These transitions are not active in the transition registry.
