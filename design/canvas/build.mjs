/* Authoring convenience: wraps each *.body.html fragment in the Design
   Component envelope with the shared Woordkast token sheet, producing the
   .dc.html artboards the canvas is seeded from. Edit the fragments, re-run
   this, then re-seed.

   Two kinds of fragment, and the difference matters for EDITING:

   - Documentation sheets (Foundations, Components) opt IN to `_app.css` — the
     app's real stylesheet — so a specimen cannot drift from what ships. They
     are reference, read more than restyled.
   - Screen fragments declare `@inline` on their first line and get NO
     `_app.css` at all: every element carries its own inline `style`, with
     literal values rather than var() references. That is what the canvas
     editor's properties panel actually reads and writes, so an inlined screen
     can be clicked and restyled directly. A class-driven one cannot — the
     stylesheet keeps winning, and the panel has nothing of its own to show. */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const tokensCss = readFileSync(join(dir, "_tokens.css"), "utf8").trim();
const appCss = readFileSync(join(dir, "_app.css"), "utf8").trim();
// app.css paints the body the deep gallery cream that sits BEHIND the phone on
// desktop, which is wrong for a documentation sheet.
const bodyOverride = "body{background:var(--bg-canvas);}";

const bodies = readdirSync(dir).filter((f) => f.endsWith(".body.html")).sort();
if (bodies.length === 0) throw new Error("no *.body.html fragments found");

const inlined = [];
for (const file of bodies) {
  const name = file.replace(/\.body\.html$/, "");
  const body = readFileSync(join(dir, file), "utf8").trim();
  const standalone = /^<!--\s*@inline\b/.test(body);
  if (standalone) inlined.push(name);

  const style = standalone
    ? [tokensCss, bodyOverride].join("\n")
    : [tokensCss, appCss, bodyOverride].join("\n");

  writeFileSync(
    join(dir, `${name}.dc.html`),
    `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <style>
${style}
  </style>
</helmet>
${body}
</x-dc>
</body>
</html>
`
  );
}
console.log(`built ${bodies.length} artboards`);
console.log(`  inline (editable screens): ${inlined.join(", ") || "none"}`);
console.log(`  app.css (doc sheets):      ${bodies.map((b) => b.replace(/\.body\.html$/, "")).filter((n) => !inlined.includes(n)).join(", ")}`);
