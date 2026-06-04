# Cover Safe Beta Test Plan

Demo URLs:

- Simple demo: `http://127.0.0.1:4173/demo/v2-cover-safe.html`
- Content demo: `http://127.0.0.1:4173/demo/v2-cover-safe-content.html`
- Stress demo: `http://127.0.0.1:4173/demo/v2-cover-safe-stress.html`

Scope: validate `cover-safe` experimental beta. This plan does not promote the
transition to stable.

## Desktop Slow Scroll

- [ ] Open the stress demo on desktop.
- [ ] Slowly scroll from scene `01` to scene `02`.
- [ ] Confirm the next scene covers continuously from bottom to top.
- [ ] Slowly scroll from scene `02` to scene `03`.
- [ ] Confirm no black gap appears while the image scene covers the current scene.
- [ ] Slowly scroll from scene `03` to scene `04`.
- [ ] Confirm the longer text scene covers without clipping or horizontal overflow.

## Desktop Fast Scroll

- [ ] Reload the stress demo.
- [ ] Quickly scroll from scene `01` to scene `02`.
- [ ] Confirm no clone remains stuck after the transition.
- [ ] Quickly scroll from scene `02` to scene `03`.
- [ ] Confirm there is never more than one visible clone.
- [ ] Quickly scroll to the final scene.
- [ ] Confirm scene `04` remains visible and uncovered.

## Scroll Upward

- [ ] Scroll to scene `04`.
- [ ] Scroll back upward to scene `03`.
- [ ] Confirm reverse scroll does not expose a black gap.
- [ ] Continue upward to scene `02` and scene `01`.
- [ ] Confirm cover layers do not remain visible after reversing.

## Resize During Transition

- [ ] Scroll halfway through `01 -> 02`.
- [ ] Resize the browser narrower.
- [ ] Confirm the active cover still fills the viewport.
- [ ] Resize wider.
- [ ] Confirm there is no horizontal overflow.
- [ ] Repeat halfway through `02 -> 03`.

## Reload Mid-Document

- [ ] Scroll to the middle of the document.
- [ ] Reload the page.
- [ ] Confirm the page reloads without stuck clones.
- [ ] Confirm the visible scene is not covered by an inactive clone.

## Mobile Portrait

- [ ] Open the stress demo in a narrow portrait viewport.
- [ ] Scroll through all scenes.
- [ ] Confirm each cover fills the viewport.
- [ ] Confirm no horizontal overflow.
- [ ] Confirm scene `04` remains visible at the end.

## Mobile Landscape

- [ ] Rotate or emulate a landscape viewport.
- [ ] Scroll through all scenes.
- [ ] Confirm image and long text scenes remain usable.
- [ ] Confirm no clone remains visible after the final scene.

## Touch Momentum

- [ ] Use touch momentum scrolling on mobile or device emulation.
- [ ] Flick from scene `01` to scene `02`.
- [ ] Confirm no black gap appears.
- [ ] Flick from scene `02` to scene `03`.
- [ ] Confirm no duplicate cover layer remains visible.
- [ ] Flick to the final scene and stop.
- [ ] Confirm scene `04` is visible.

## Repeated Init

- [ ] Run `window.motionSystem.destroy()` if available.
- [ ] Re-run the demo initialization if available from module context.
- [ ] Alternatively reload and call `window.motionSystem = initMotionSystem({ debug: true })` from a test harness.
- [ ] Confirm repeated init does not leave duplicate visible clones.
- [ ] Confirm `document.querySelectorAll(".scene--cover-safe-clone").length` matches the number of cover-safe scenes.

## ScrollTrigger Refresh

- [ ] Run `ScrollTrigger.refresh()` in the console.
- [ ] Confirm no inactive clone becomes visible.
- [ ] Run refresh halfway through a cover transition.
- [ ] Confirm the active cover still fills the viewport.

## Inspect Error Count

Run:

```js
const report = window.motionSystem.inspect();
```

- [ ] Confirm `report.errors.length === 0`.
- [ ] Confirm every `cover-safe` scene has `transitionDiagnostics.errors.length === 0`.

## Clone Risk Level

- [ ] Confirm the simple demo reports `cloneRiskLevel === "low"` for cover-safe scenes.
- [ ] Confirm the content demo reports `cloneRiskLevel === "low"` for cover-safe scenes.
- [ ] Confirm the stress demo reports at least one `cloneRiskLevel === "medium"`.
- [ ] Confirm medium risk scenes still report `transitionDiagnostics.canRunSafely === true`.
- [ ] Confirm no stress scene reports `cloneRiskLevel === "high"`.

## Tab Navigation

- [ ] Use keyboard Tab navigation on the stress demo.
- [ ] Confirm focus does not enter `.scene--cover-safe-clone`.
- [ ] Confirm visible real links/buttons can still receive focus when appropriate.
- [ ] Confirm hidden clone controls have `tabindex="-1"`.

## Reduced Motion

- [ ] Enable `prefers-reduced-motion`.
- [ ] Reload the stress demo.
- [ ] Confirm the page remains usable.
- [ ] Confirm `inspect()` still reports zero errors.
- [ ] Confirm there are no black gaps or stuck clones.

## Pass Criteria

- [ ] Desktop slow and fast scroll pass.
- [ ] Upward scroll passes.
- [ ] Resize and reload checks pass.
- [ ] Mobile portrait, landscape, and touch momentum pass.
- [ ] Repeated init and `ScrollTrigger.refresh()` pass.
- [ ] `inspect()` reports zero errors.
- [ ] Stress demo reports medium clone risk where expected.
- [ ] Medium risk remains safe after clone hardening.
- [ ] Tab navigation never enters clones.
- [ ] Reduced motion does not break page visibility.

## Fail Criteria

Any of these blocks further promotion:

- Black gaps between scenes.
- More than one visible clone.
- Clone remains visible at the end.
- Scene `04` is covered or unreachable.
- Horizontal overflow.
- `inspect()` errors.
- `cloneRiskLevel === "high"` in beta stress demo.
- Focus enters a clone.
- `ScrollTrigger.refresh()` leaves stale visual state.
