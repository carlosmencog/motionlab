import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(rootDir, "dist");

await rm(distDir, { force: true, recursive: true });
await mkdir(distDir, { recursive: true });

await cp(resolve(rootDir, "demo"), resolve(distDir, "demo"), { recursive: true });
await cp(resolve(rootDir, "src"), resolve(distDir, "src"), { recursive: true });

await writeFile(
  resolve(distDir, "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=./demo/v3-first-real-site.html">
    <title>MotionLab</title>
    <link rel="canonical" href="./demo/v3-first-real-site.html">
  </head>
  <body>
    <a href="./demo/v3-first-real-site.html">Open MotionLab demo</a>
  </body>
</html>
`,
  "utf8"
);

console.log("GitHub Pages build created at dist/");
