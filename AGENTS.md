# barbuz.github.io — working notes

Notes for anyone (human or agent) working in this repo. The brand is spread
across several apps; this site is the source of truth for it.

## Repos

- `barbuz/barbuz.github.io` — this repo. The personal site (SvelteKit +
  Tailwind, `adapter-static`, deployed to GitHub Pages by
  `.github/workflows/deploy.yml`). Source of truth for the brand.
- `barbuz/match-the-gatherer` — Svelte + Vite PWA (MTG daily game).
- Sibling apps: `byom`, `digitofono`, `the-stylus`.

## Docs

`docs/` holds the brand notes. **None of it is served by the site** — the Pages
workflow uploads only the `build/` artifact produced by `adapter-static`, so
nothing in `docs/` reaches the public site. Do not move it into `static/`.

| File | What it is |
|---|---|
| `docs/DESIGN-NOTES.md` | Palette decisions and the reasoning: the two-tone accent, the temperature rule, measured contrast tables, the type stack. |
| `docs/BRAND-PLAN.md` | The plan for growing the identity into the apps. Phases, order, open decisions. Authority for what to do next. |
| `docs/VOICE-NOTES.md` | The two registers and the shared rules. The reference the copy pass is written against. |
| `docs/COPY-NOTES-BARBUZ.md` | Current-vs-proposed copy pairs on the barbuz face. |
| `docs/COPY-NOTES-LEO.md` | Draft-vs-current copy pairs on the Leo face. |

## Build and run

```bash
npm ci
npm run dev      # local dev
npm run build    # static output in build/
npm run check    # svelte-check
npm run preview  # preview the production build
```

`build/` is gitignored; serve it with `python3 -m http.server` for a quick
static check.

## The design system

Two personas, one accent hue.

- **barbuz** = night, dark, **cool** end-to-end. Accent `#3D7BFF`. Default
  landing at `/`.
- **Leo** = day, light, **warm**. Accent `#1D4ED8`. Deep-linked at `?leo`.

The rule: **night is cool, day is warm, blue is the one colour that crosses
both.** Any new colour must fit its face's temperature. All text pairs meet WCAG
AA; hairline borders are deliberately below 3:1 and must switch to the accent if
they ever carry meaning.

The palette is generated from `brand/tokens.json` into `brand/tokens.css`
(imported by `src/app.css`) and `brand/tokens.js`. **Edit only the JSON**, never
the generated files, and run `npm run tokens`. CI runs `npm run tokens:check`
and fails on drift. Details: `brand/README.md`.

The active persona is the `data-persona` attribute on `<html>`, set before first
paint by the script in `src/app.html` so there is no flash.

## The mark

The mark is the letter `b` — the one letter that touches all four corners of the
primitive. The primitive is a **graph on four points**: P1 the ascender tip
(reached by `b` only), P4 the right angle, P3 the shoulder, P2 the foot. Every
stroke in the system ends on one of those four, so containment is node-set
containment and it is exact. Of the four edges, three are axis-aligned and stay
straight; **only the diagonal `D` bends**. That is why `k` is a property of one
edge, not a treatment applied to shapes.

`brand/mark.mjs` is the source of truth. `nodePoints()` returns the four points;
the check is that `nodePoints(letterStrokes(c))` is the same three points for
`c` in `a r u z`.

The **node device** (a knockout hole plus a ring at each corner) ships with the
mark: `markSvg()`, `tileSvg()` and `lockupSvg()` all draw it, and so does the
icon set. The knockout is a **mask**, not a disc of ground colour, so the hole
is real and reads on a transparent background (the favicon). In the rasterizer
it is an erasing disc, except on the opaque tiles and the card, where painting
the ground colour keeps the icon opaque. Pass `{ nodes: false }` for the bare
stroke. **No size opts out:** the device is kept even at 16px, where it is
texture rather than a readable ring — a mark with the device, however small, is
preferred to one without it. This also makes `favicon.ico` agree with
`favicon.svg`, which always drew it.

The page reads the mark too: `src/lib/Wordmark.svelte` renders the nav lockup
from `lockupSvg()`, sized by a `height` prop (default 28px). The device is on
in the nav, as it is everywhere else. 28px is a sizing default, not a
device threshold: the word's thinner stroke makes its knockouts the smallest
elements on the page, and 28px keeps them near 1.9px. `mark.mjs` is not in the
type-checked program, so `brand/mark.d.mts` declares the surface the page
imports — update it if a signature changes.

Reasoning and the full argument: `docs/DESIGN-NOTES.md`, "The mark".

## The element kit

`brand/elements.mjs` is a reusable element library — `chevron`, `corner`,
`play`, `arrow`, `dot`, `ring`, `progress` and more — for other projects. These
are **not** cut from the `b`; they apply the mark's *grammar* to other shapes:

1. **An edge bends iff it is a diagonal.** Axis-aligned edges stay straight,
   diagonals bulge by the shared `K`. Applied in one place (`edges()`), so an
   element is just a list of points.
2. **45° discipline** on every bulged edge, like the mark's diagonal.
3. **Nodes on corners** — the corner device is available on any element.

`check` and `cross` are deliberately straight (`orthogonal: true`); a bend on a
tick reads as a wobble.

`npm run elements:check` asserts all three rules and runs in CI — rule 1 erodes
silently otherwise. Kit rationale: `docs/DESIGN-NOTES.md` → "The element kit".

## Paths: one `M` per run

`strokedPath()` in `mark.mjs` turns a list of strokes into an SVG `d`. A stroke
carries only its two endpoints, so each contributes a bare `L`/`Q` that assumes
the pen already sits on its start — true only while the strokes form **one
continuous line**. One letter is; a **word is not**, and neither is an element
like `divider`, `arrow` or `cross`. Drawn without a fresh `M`, the pen travels
straight across the gap and the shape fuses: the lockup's `arbuz` rendered as a
single blob, and `cross` lost a diagonal.

`strokedPath()` now starts a subpath wherever the pen jumps, and both
`mark.mjs` and `elements.mjs` share it. `npm run mark:check` and rule 4 of
`elements:check` assert one `M` per run, so a future multi-run shape cannot
regress silently. The rasterizer was never affected — it draws polylines, not
paths.

## Basemap tiles (the Journey map)

The Journey map reads a Protomaps vector tileset over PMTiles, so its base layer
is an external dependency. It has broken once; the failure mode is worth knowing.

The style used to point at a **dated** build:

```
pmtiles://https://build.protomaps.com/20260105.pmtiles   # ← rots
```

That host keeps only the **last week** of daily builds, plus the latest build of
each patch version. Every older date 404s. **A pinned date is not a stable pin
here — it is a delayed failure.** It works when written and breaks on its own,
with no change to the repo.

When it broke, the country outlines and the journey line still drew, because
they come from a separate GeoJSON source. So the map looked like a styling bug
while the real cause was a dead URL. Check the tileset before touching CSS.

Use the stable mirror instead:

```
pmtiles://https://data.source.coop/protomaps/openstreetmap/v4.pmtiles
```

It is not part of the rolling window. It is a large archive (~135 GB), but
PMTiles is range-addressed, so the browser fetches only the byte ranges for the
tiles in view — the full file is never downloaded. It serves
`access-control-allow-origin: *` and `accept-ranges: bytes`, both required for
the browser to range-read it.

The style's `source-layer` names (`earth`, `landcover`, `landuse`, `roads`,
`water`, …) must match the tileset's schema. They match this mirror exactly. If
you ever change the tileset, check the schema with `pmtiles show <url>` first.

The sprite and glyphs assets (`protomaps.github.io/basemaps-assets/…`) are
path-versioned (`/v4/`), not date-versioned, so they are stable and can stay
pinned as they are.

If a fully self-hosted basemap is ever wanted, `pmtiles extract` cuts a small
global or regional archive — a world z0–5 extract is ~15 MB, which removes the
external dependency entirely. Not done yet because it adds a build step.

## Phase 2 scratch — the mark

The **settled** geometry is in the repo: `brand/mark.mjs`, with the assets in
`static/`. That is what to edit and what to reuse; see `brand/README.md` and
`docs/DESIGN-NOTES.md#the-mark`.

The **exploration** that got there lives outside the repo, in
`/workspace/scratch/mark/` — specimen pages only, no artifact, nothing there
belongs in a commit. Regenerate and serve them with:

```bash
cd /workspace/scratch/mark && python3 gen.py   # writes ./out/
cd out && python3 -m http.server 12000
```

**Do not put it in `/tmp`.** `/tmp` is wiped mid-session here, which kills both
the files and any server running from them. `/workspace/` persists.

The direction it settled on: **the mark is the `b`** — stroked with round caps
everywhere, in the wordmark and the icons alike — and `barbuz` is set in a
derived typeface where every letter is a subset of the `b`'s four strokes
`{S, V, H, D}` — `a = VHD`, `r = VH`, `u = VD`, `z = HD`. Containment is the
rule, so `z` is never asked to stand alone; that is why it may read as a `7` in
isolation. `k > 0` means curvature bulging **outward**.

**The icon rasterizer is hand-rolled, and that is load-bearing.** It is exact
only while the mark stays lines and quadratics — which is all it is today. If
the geometry ever gains fills, gradients or path booleans, it stops being exact
and a real renderer (`resvg`) becomes the right call. The measurements and the
trigger are in `docs/DESIGN-NOTES.md#why-the-rasterizer-is-hand-rolled--and-when-to-stop`.
Placement is shared too: `markFit()` in `mark.mjs` is the only place the
square-tile fit lives, so the SVG and the raster cannot drift.

**In any lockup, the mark is the first `b`** — so the word beside it is `arbuz`,
never `barbuz`. Use `lockup()` in `mark.mjs`; it places both parts and matches
the bowls and baseline. Setting the full name draws the `b` twice. See
`docs/DESIGN-NOTES.md#the-lockup-the-mark-is-the-first-b`.

## Order of work

Page-only phases first, then the apps. `docs/BRAND-PLAN.md` is the authority;
this is the short version:

1. **Tokens** — extract to `brand/tokens.json` / `brand/tokens.css` (Phase 1). ✅ done
2. **The mark** — settle the logo and favicon (Phase 2). ✅ done
3. **Voice and copy** — fix what the page says (Phase 3). ← next. The voice
   guide is done (`docs/VOICE-NOTES.md`); the copy pass itself is not.
4. **Then** apply to `match-the-gatherer`, `byom`, `digitofono`, `the stylus`.

The governing rule is **content before layout**: settle the words first, then
build the layout around them. Do not finalise a layout against placeholder text.

## Conventions

- The persona is resolved from the URL query (`?leo`), not the route. `/leo` was
  considered risky and rejected.
- Cross-face links are `?leo` / `?barbuz` with `preventDefault` and
  `setPersona(...)`, so they flip without a reload.
- State lives in `src/lib/persona.svelte.ts` (`$state` runes), shared by the
  toggle and the flip shell.
- `JourneyMap.svelte` is imported in the browser only — MapLibre touches
  `window` at import time.
- Text and logos are still draft; Phase 2 and Phase 3 settle them.
