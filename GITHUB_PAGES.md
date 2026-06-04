# GitHub Pages Publishing

This project is currently a static HTML/CSS/JS site. It does not use Vite.

The public GitHub Pages URL is:

```text
https://carlosmencog.github.io/motionlab/
```

The official public demo is:

```text
https://carlosmencog.github.io/motionlab/demo/v3-first-real-site.html
```

## Build

Run:

```bash
npm run build
```

The build copies the static runtime files into `dist/`:

- `demo/`
- `src/`
- `index.html`, which redirects to `demo/v3-first-real-site.html`

## Routing And Base Path

Because this project is static and does not use Vite, there is no `vite.config.js`
and no Vite `base` option to configure.

The demo uses relative paths:

```html
<link rel="stylesheet" href="../src/motion/motion.css">
<link rel="stylesheet" href="./v3-first-real-site.css">
```

This keeps the site compatible with the GitHub Pages repository path:

```text
/motionlab/
```

## GitHub Pages Setup

1. Push changes to `main`.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, choose `GitHub Actions`.
5. The `Deploy GitHub Pages` workflow will build and publish `dist/`.

## Local Preview

After building, preview the Pages artifact locally:

```bash
npm run build
npx serve dist
```

Then open:

```text
http://localhost:3000/demo/v3-first-real-site.html
```

If you prefer not to use `npx serve`, any static server pointed at `dist/` works.
