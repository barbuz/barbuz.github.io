# brand/

The barbuz design tokens. This is the source of truth for the palette, type,
scale and motion — the page and the apps all read from here.

**This folder is not served by the website.** It is not in `static/`, so
`adapter-static` never copies it into `build/`. It is a build-time input only.

## Files

| File | Edit? | What it is |
|---|---|---|
| `tokens.json` | **yes** | The source of truth. Edit this. |
| `tokens.css` | no | Generated. CSS custom properties, for the page and static apps. |
| `tokens.js` | no | Generated. The same values as ESM, for apps that build with a bundler. |
| `generate.mjs` | yes | The generator. Reads the JSON, writes the two files above. |
| `mark.mjs` | yes | The mark's geometry — the `b`, its strokes, and the SVG builders. Shared by the page and the icon generator. |
| `mark.d.mts` | yes | Types for `mark.mjs`, for the page's import. Keep in step with the real signatures. |
| `elements.mjs` | yes | The element kit: reusable graphical elements in the mark's grammar. **Frozen and experimental — not shipping.** See below. |
| `check-elements.mjs` | yes | The kit's rule checker. Hand-run; no longer a CI gate. |
| `generate-icons.mjs` | yes | The icon generator. Reads `mark.mjs`, writes the icon set into `static/`. Hand-rolled rasterizer — see the note below. |

## Usage

```bash
npm run tokens          # regenerate tokens.css + tokens.js
npm run tokens:check    # fail if the JSON was edited but not regenerated (runs in CI)
npm run icons           # regenerate the icon set in static/
npm run icons:check     # fail if mark.mjs changed but the icons did not (runs in CI)
npm run elements:check  # check the element kit's rules (hand-run, not CI)
npm run mark:check      # fail if a mark path draws across a gap between strokes (runs in CI)
```

The generated files are committed, so the site builds without running the
generator. CI runs `tokens:check` to catch a JSON edit that was never applied.

## The icon rasterizer

`generate-icons.mjs` rasterizes the mark by hand — signed distance to each
stroke, supersampled — rather than pulling in a renderer. That is exact while
the mark stays **lines and quadratics**, which is all it is today: no fills, no
gradients, no path booleans. It also measured smaller than the alternatives
(5.8 KB vs 9.2 KB for resvg, 10.2 KB for pngjs) and avoids a native dependency.

**If the mark ever gains fills, gradients or boolean path operations, stop and
re-read `docs/DESIGN-NOTES.md` → "Why the rasterizer is hand-rolled".** The
hand-rolled approach stops being exact at that point and a real renderer
becomes the right call.

## The element kit (frozen, experimental — not shipping)

`brand/elements.mjs` is a small library of reusable graphical elements drawn in
the mark's *grammar* rather than cut from the `b`. The core set is nine —
`chevron`, `play`, `caret`, `arrow`, `check`, `cross`, `dot`, `ring`,
`progress` — the elements that name a UI verb.

**Nothing imports it, and no app consumes it.** It is kept as a proof that the
mark's grammar generates usable UI shapes, not as a shipped asset; it appears
nowhere in `docs/BRAND-PLAN.md`. Do not polish or extend it on spec. Grow it
from a real screen that needs an icon, in Phase 4. Seven more shapes were parked
rather than kept as dead geometry — `corner`, `wedge`, `slash`, `divider`,
`branch`, `bracket`, `bullet` — and their geometry is recorded in
`docs/DESIGN-NOTES.md` → "The element kit" for a one-line restore.

The grammar is the three rules, and they are the whole value of the kit:

1. **Straight or bulged, never both on one edge.** An axis-aligned edge is
   straight; a diagonal bulges by the shared `K`. The bend is what marks a
   diagonal, so it is a property of the edge, not a decoration. Two symbols,
   `check` and `cross`, opt out via an `orthogonal: true` flag — on a tick the
   bend reads as a wobble, so they are straight by design.
2. **45° discipline.** Every bulged edge runs at 45°, like the mark's diagonal.
3. **Nodes on corners.** The mark's corner device (knockout hole + ring) is
   available on any element: `elementSvg(name, { nodes: true })`. The device is
   sized from the element's stroke, so a filled element (`play`) — which has
   none — sizes it from the kit default instead.

```js
import { NAMES, element, elementSvg } from '../brand/elements.mjs';

elementSvg('chevron', { size: 24, ink: color.barbuz.accent });        // plain
elementSvg('arrow',   { size: 24, nodes: true });                     // with nodes
element('play').segs;                                                 // raw segments
```

Elements are drawn in a nominal 0..100 box and scaled to `size`, so the same
call works at 16px and 200px. Everything is lines and quadratics, so the
hand-rolled rasterizer can draw it too. The viewBox is padded to cover the ink —
a round cap reaches half a stroke past the nominal box, and a node ring a little
further — so nothing is clipped at the edges.

`npm run elements:check` asserts the rules and the emitted geometry: a bulged
edge's `ref` is off the edge's own line (or the bulge direction is a coin toss),
the path carries one subpath per run of segments (or disjoint runs get joined),
the viewBox covers the ink (or the caps are clipped), and a filled element still
draws its node device. **It is no longer a CI gate** — run it by hand when the
module is touched. It was removed from the workflow at the freeze, because it
guarded a module nothing ships; the mark's `icons:check` and `mark:check` still
gate, since the mark does ship. Reasoning: `docs/DESIGN-NOTES.md` →
"The element kit".

## The lockup

The mark is the `b`, so where the mark and the name appear together the mark
**stands in for the first letter** and the word is `arbuz` — never `barbuz`,
which draws the `b` twice. `lockup()` in `mark.mjs` places both parts, matches
their bowls and shares a baseline, and returns them in the text's coordinate
space so a caller scales and centres the pair as one block. Details and the two
alignment rules: `docs/DESIGN-NOTES.md` → "The lockup".

## Consuming

**CSS.** The page imports it directly, after the Tailwind directives:

```css
@import "tailwindcss/base";
/* ... */
@import "../brand/tokens.css";
```

**JS.** For an app that needs the values in script — a canvas renderer, a map
style, a `theme-color` meta tag:

```js
import { color, font, motion } from '../brand/tokens.js';

const accent = color.barbuz.accent;
```

## What is in here

- **Colour**, per persona: `page-bg`, `bg`, `surface`, `surface-2`, `text`,
  `muted`, `line`, `accent`, `accent-ink`, `accent-soft`, `success`, `warning`,
  `danger`.
- **Chrome**, per persona: the `--c-*` set used by fixed UI that follows the
  active persona (the flip switch).
- **Shadow**, per persona: `base` and `accent`.
- **Font**, per persona: `display`, `body`, `display-weight`; plus a shared
  `mono`.
- **Scale**, shared: `motion`, `radius`, `space`.

## The rules

Two rules carry the whole brand. Anything added here has to survive both:

1. **Cool at night, warm by day. Blue is the one colour that crosses both.**
2. **Mono type is the shared thread** — it is the same on both faces.

The reasoning, the measured contrast tables, and the traps to avoid are in
[`docs/DESIGN-NOTES.md`](../docs/DESIGN-NOTES.md). The plan for spreading this
to the apps is [`docs/BRAND-PLAN.md`](../docs/BRAND-PLAN.md).
