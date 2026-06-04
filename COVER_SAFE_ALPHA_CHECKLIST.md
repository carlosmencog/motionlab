# Cover Safe Alpha Checklist

Demo URL: `http://127.0.0.1:4173/demo/v2-cover-safe.html`

Scope: validate `cover-safe` alpha only. Do not use this checklist to approve
`cover-safe` for stable demos.

## Desktop

- [ ] Open the demo on a desktop viewport.
- [ ] Slowly scroll from scene `01` to scene `02`.
- [ ] Confirm scene `02` covers scene `01` continuously from bottom to top.
- [ ] Confirm there is no black gap during `01 -> 02`.
- [ ] Quickly scroll from scene `01` to scene `02`.
- [ ] Confirm no clone remains stuck after fast scroll.
- [ ] Slowly scroll from scene `02` to scene `03`.
- [ ] Confirm scene `03` covers scene `02` continuously.
- [ ] Quickly scroll from scene `02` to scene `03`.
- [ ] Confirm no partial scene remains above the active scene.
- [ ] Scroll through to scene `04`.
- [ ] Confirm scene `04` is visible and not covered by a clone.
- [ ] Scroll back upward from scene `04` to scene `03`.
- [ ] Confirm reverse scroll does not create gaps or stuck clones.
- [ ] Resize the browser while halfway through a cover transition.
- [ ] Confirm the active cover still fills the viewport after resize.
- [ ] Confirm no horizontal scrollbar appears.

## Mobile

- [ ] Open the demo in a narrow, tall viewport.
- [ ] Confirm each scene fills the viewport height.
- [ ] Scroll with touch momentum from scene `01` to scene `02`.
- [ ] Confirm no black gaps appear during momentum scroll.
- [ ] Scroll with touch momentum from scene `02` to scene `03`.
- [ ] Confirm only one cover layer is visible at a time.
- [ ] Rotate or emulate landscape orientation if available.
- [ ] Confirm cover layers still fill the viewport.
- [ ] Rotate or emulate portrait orientation again.
- [ ] Confirm the page recovers without stuck cover layers.
- [ ] Confirm there is no horizontal overflow.

## Runtime

- [ ] Run `window.motionSystem.destroy()` if available, then initialize again.
- [ ] Or run `initMotionSystem()` twice from the demo module context if available.
- [ ] Confirm duplicate initialization does not leave extra visible clones.
- [ ] Run `ScrollTrigger.refresh()` from the console.
- [ ] Confirm refresh does not leave a visible clone when the scene is inactive.
- [ ] Scroll halfway through a cover transition and reload the page.
- [ ] Confirm reload starts with scene `01` visible and no stuck clone.
- [ ] Scroll to the final scene.
- [ ] Confirm scene `04` remains visible.
- [ ] Scroll back to the top.
- [ ] Confirm reverse navigation does not leave cover layers behind.

## Visual Safety

- [ ] There is never a black screen between scenes.
- [ ] There is never more than one visible `.scene--cover-safe-clone`.
- [ ] No real scene remains permanently covered at the end.
- [ ] Scene `04` is visible at the end of the page.
- [ ] The current scene never fades to `opacity: 0`.
- [ ] The next scene covers continuously from `yPercent: 100` to `0`.
- [ ] The page has no horizontal overflow.
- [ ] No clone remains visible after reaching the final scene.

## Debug

Run:

```js
const report = window.motionSystem.inspect();
```

- [ ] `report.errors.length === 0`.
- [ ] Every `cover-safe` scene has `transitionDiagnostics.canRunSafely === true`.
- [ ] Every `cover-safe` scene in the simple demo has `cloneRiskLevel === "low"`.
- [ ] `transitionDiagnostics.hasNextScene === true` for scenes `01`, `02`, and `03`.
- [ ] Scene `04` does not use `cover-safe`.
- [ ] Warnings are limited to expected experimental `cover-safe` messages.
- [ ] No duplicate-id, video, iframe, canvas, or interactive-control warnings appear in the simple demo.

Expected experimental warnings:

- `cover-safe` is experimental.
- `cover-safe` should only be used in isolated demos.
- `cover-safe` requires viewport coverage from the next scene.

## Pass Criteria

- [ ] All Desktop checks pass.
- [ ] All Mobile checks pass.
- [ ] All Runtime checks pass.
- [ ] All Visual Safety checks pass.
- [ ] All Debug checks pass.

## Fail Criteria

Any of these blocks promotion from alpha:

- Black screen or visible gap between scenes.
- More than one visible clone during a transition.
- A clone remains visible after the transition ends.
- Scene `04` is covered or invisible at the end.
- Horizontal overflow appears.
- `inspect()` reports errors.
- `cloneRiskLevel` is not `low` in the simple demo.
- Non-experimental warnings appear in the simple demo.
