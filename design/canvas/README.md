# Design canvas

The Woordkast design system as a published canvas: Foundations, Components and
Screens, mirrored from the live app rather than redrawn.

**Published:** <https://claude.ai/code/artifact/db530ff0-c94d-4311-95a1-dd327619b02f>

This is a *view* of the system. The token values themselves are owned by Figma
and flow in through `design/figma-tokens.json` — see [`../README.md`](../README.md).

## What's here

| File | Role |
|---|---|
| `*.body.html` | The source of each artboard — edit these |
| `_tokens.css` | Token layer, transcribed from `src/styles/tokens/` |
| `_app.css` | **Generated.** Verbatim copy of `src/styles/app.css` |
| `canvas.json` | Layout: positions, sizes, pages, sticky notes, launch view |
| `sync-app-css.mjs` | Regenerates `_app.css` from the app's stylesheet |
| `build.mjs` | Wraps each `*.body.html` into a `*.dc.html` artboard |

`*.dc.html` and `woordkast-design-system.html` are build output and are
git-ignored — `build.mjs` and the canvas seeder regenerate them.

## Why `_app.css` is a copy, not a rewrite

The component and screen artboards render the app's **real** stylesheet, so a
component on the canvas cannot quietly disagree with the one that ships. The
only differences from `src/styles/app.css` are the token `@import`s (carried by
`_tokens.css` instead) and the app-shell rules, restated for an artboard that
*is* the phone rather than a viewport containing one.

This means `_app.css` goes stale the moment `app.css` changes. Re-sync it.

## Changing the canvas

```bash
node design/canvas/sync-app-css.mjs   # only if src/styles/app.css changed
node design/canvas/build.mjs          # *.body.html -> *.dc.html
```

Then re-seed and republish to the **same** URL (the `/design` skill's
`seed-canvas.mjs`, with every `*.dc.html` and `canvas.json`). Publishing without
that URL creates a second, unrelated canvas.

## Conventions

- One artboard per `*.body.html`; the filename is the artboard name.
- Documentation sheets use the local `.sheet` / `.grp` / `.spec` chrome defined
  in `_tokens.css`. That chrome is **not** part of the app's design system — it
  only exists to label the specimens.
- States that are normally `:hover` / `:active` / `:focus-visible` are rendered
  as separate instances with `.is-hover` / `.is-press` / `.is-focus`, so all of
  them are visible at once instead of needing to be provoked.
- Screen artboards are 390 × 844 and carry representative sample content —
  deck counts, streak and email are plausible, not live.
- Heights in `canvas.json` are set from measured content with ~8% slack. Surplus
  paints the artboard background harmlessly; clipping is the only real failure,
  so round up when in doubt.
