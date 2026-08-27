/* Authoring convenience: wraps each *.body.html fragment in the Design
   Component envelope with the shared Woordkast token sheet, producing the
   .dc.html artboards the canvas is seeded from. Edit the fragments, re-run
   this, then re-seed. */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
// Tokens first, then the app's own component layer (synced from app.css), then
// one override: app.css paints the body the deep gallery cream that sits BEHIND
// the phone on desktop, which is wrong for a documentation sheet and invisible
// on a screen artboard (.phone covers it either way).
const tokens = [
  readFileSync(join(dir, "_tokens.css"), "utf8").trim(),
  readFileSync(join(dir, "_app.css"), "utf8").trim(),
  "body{background:var(--bg-canvas);}",
].join("\n");

const bodies = readdirSync(dir).filter((f) => f.endsWith(".body.html")).sort();
if (bodies.length === 0) throw new Error("no *.body.html fragments found");

for (const file of bodies) {
  const name = file.replace(/\.body\.html$/, "");
  const body = readFileSync(join(dir, file), "utf8").trim();
  const out = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <style>
${tokens}
  </style>
</helmet>
${body}
</x-dc>
</body>
</html>
`;
  writeFileSync(join(dir, `${name}.dc.html`), out);
}
console.log(`built ${bodies.length} artboards: ${bodies.map((b) => b.replace(/\.body\.html$/, "")).join(", ")}`);
