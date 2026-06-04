# Motion System Presets

## Transition Presets

### `normal-scroll`

Status: stable.

Runs the scene enter animation when the scene enters the viewport. It does not
pin, stack, clone, or compose scenes.

### `pinned-scroll`

Status: stable.

Pins only the current scene, runs enter, holds, then releases. It does not run
exit animations in the stable baseline.

### `cover-safe`

Status: experimental beta.

Warning: `cover-safe` is not a default transition and must be explicitly opted
into with `data-transition="cover-safe"`.

Use only when:

- A next scene exists.
- `cloneRiskLevel` is `low` or `medium`.
- `window.motionSystem.inspect().errors.length === 0`.
- The next scene does not contain video, iframe, form, or canvas.
- The next scene does not rely on high-risk interactive state.

Do not promote `cover-safe` to stable until mobile manual testing, resize
testing, reload mid-scroll testing, and advanced media testing are complete.
