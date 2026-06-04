# Baseline Checklist

Internal baseline label: `v1.0-stable-baseline`

## Demo URLs

- Official v1 demo: `http://127.0.0.1:4173/demo/`
- Diagnostic demo: `http://127.0.0.1:4173/demo/diagnostic.html`

## Manual Test Steps

1. Open the official v1 demo.
2. Confirm the first scene is visible on load.
3. Scroll through all four scenes slowly.
4. Confirm pinned scenes release into the next scene without black gaps.
5. Confirm no scene overlaps another scene accidentally.
6. Confirm no scene exits to `opacity: 0`, `xPercent`, or `yPercent`.
7. Confirm `image-parallax-soft` appears only where explicitly declared with `data-motion`.
8. Open the diagnostic demo.
9. Scroll from `01` to `04`.
10. Confirm each diagnostic scene is fullscreen, simple, and visible.

## Pass Criteria

- Every `.scene` fills the viewport.
- The document always shows a visible scene while scrolling.
- `normal-scroll` scenes do not pin.
- `pinned-scroll` scenes pin only themselves and then release.
- No horizontal overflow appears.
- No black screen appears between scenes.
- No partial accidental stacking appears.
- No exit animation runs in stable demos.
- `image-parallax-soft` does not create extra vertical space.

## Fail Criteria

- Any scene disappears before the next scene is visible.
- Any scene leaves a black or empty viewport during normal scrolling.
- Any scene appears partially stacked over another without explicit intent.
- Any stable demo uses `data-exit`, `overlap`, `scene-cover`, or slide transitions.
- Any parallax media creates space before or after its scene.
- Any horizontal scrollbar appears.
- Re-running `initMotionSystem()` creates duplicate ScrollTriggers or duplicated motion.

## Expected Visuals

### Official V1 Demo

- Scene 1: dark fullscreen side-by-side hero with large text on the left and media on the right.
- Scene 2: centered light scene with simple text.
- Scene 3: fullscreen image scene with text overlay and one explicit experimental parallax media motion.
- Scene 4: text and media scene in normal document flow with pinned-scroll behavior.

### Diagnostic Demo

- Four simple fullscreen scenes.
- Solid backgrounds.
- Large centered numbers: `01`, `02`, `03`, `04`.
- Minimal text.
- No images.
- No parallax.
- No complex child motion.

## Recommended Commit Or Tag

Recommended internal baseline name: `v1.0-stable-baseline`.

Create a real Git tag only after the current worktree is committed cleanly.
