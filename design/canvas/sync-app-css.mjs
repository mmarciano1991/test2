/* Regenerates design/_app.css from the app's real stylesheet, so the canvas
   can never drift from what ships. Run this after changing src/styles/app.css,
   then re-run build.mjs and re-seed the canvas. */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const src = join(dir, "..", "..", "src", "styles", "app.css");

let css = readFileSync(src, "utf8");
// The token @imports are already carried by design/_tokens.css.
css = css.replace(/@import\s+"\.\/tokens\/[a-z]+\.css";\n/g, "");
// The artboard IS the phone, so the centering shell and desktop frame go.
css = css.replace(/\/\* ── App shell[\s\S]*?^}\n\n@media \(min-width: 480px\) \{[\s\S]*?^\}\n/m, "");

const header = `/* Woordkast component layer — copied verbatim from src/styles/app.css by
   design/sync-app-css.mjs. Do not hand-edit: re-run the sync instead. The only
   changes are the removed token @imports (design/_tokens.css carries those)
   and the app-shell/phone rules, which are re-stated below for an artboard
   that IS the phone rather than a viewport containing one. */
.app-shell{display:flex;align-items:center;justify-content:center;}
.phone{position:relative;width:100%;height:100%;background:var(--bg-canvas);overflow:hidden;display:flex;flex-direction:column;}
`;

writeFileSync(join(dir, "_app.css"), header + css);
console.log(`synced _app.css from ${src} (${header.length + css.length} bytes)`);
