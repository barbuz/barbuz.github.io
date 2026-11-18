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

The `z` is the one letter that carries a stroke outside the `b`'s vocabulary:
a **foot**, `H` set at the baseline, without which `H + D` reads as a `7`. It is
drawn in the **accent** — the mark's ink — so it reads as the mark's stroke
rather than a third edge of the letter, and `nodePoints()` skips accent strokes
so the letter still reaches exactly P2, P3 and P4. `splitAccent()` returns the
two runs; `lockupSvg()` and the social card draw the foot as its own
accent-coloured path, **behind** the word ink — the foot meets the diagonal at
the baseline, so painting it last would put it on top of the letter and read as
crossing it rather than tucking behind it.

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

## The element kit (frozen, experimental — not shipping)

`brand/elements.mjs` is a reusable element library for other projects. It is
**frozen at nine elements and marked experimental**: nothing imports it, no app
consumes it, and it is not in `docs/BRAND-PLAN.md`. Do not polish or extend it
on spec — grow it from a real screen that needs an icon, in Phase 4.

The core set names a UI verb: `chevron`, `play`, `caret`, `arrow`, `check`,
`cross`, `dot`, `ring`, `progress`. Seven more were parked — `corner`, `wedge`,
`slash`, `divider`, `branch`, `bracket`, `bullet` — with their geometry recorded
in `docs/DESIGN-NOTES.md` → "The element kit" for a one-line restore.

These are **not** cut from the `b`; they apply the mark's *grammar* to other
shapes:

1. **An edge bends iff it is a diagonal.** Axis-aligned edges stay straight,
   diagonals bulge by the shared `K`. Applied in one place (`edges()`), so an
   element is just a list of points.
2. **45° discipline** on every bulged edge, like the mark's diagonal.
3. **Nodes on corners** — the corner device is available on any element. A
   filled element (`play`) has no stroke, so the device sizes from the kit
   default instead, or its radii would be zero.

`check` and `cross` are deliberately straight (`orthogonal: true`); a bend on a
tick reads as a wobble.

The viewBox is padded to cover the ink — a round cap reaches half a stroke past
the nominal box, and a node ring a little further — so nothing is clipped.

`npm run elements:check` asserts the rules and the emitted geometry. **It is no
longer a CI gate** — run it by hand when the module is touched; it was dropped
from the workflow at the freeze because it guarded a module nothing ships.
Kit rationale: `docs/DESIGN-NOTES.md` → "The element kit".

## Paths: one `M` per run

`strokedPath()` in `mark.mjs` turns a list of strokes into an SVG `d`. A stroke
carries only its two endpoints, so each contributes a bare `L`/`Q` that assumes
the pen already sits on its start — true only while the strokes form **one
continuous line**. One letter is; a **word is not**, and neither is an element
like `arrow` or `cross`. Drawn without a fresh `M`, the pen travels
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
`{S, V, H, D}` — `a = VHD`, `r = VH`, `u = VD`, `z = HD`. The `z` also carries
a foot in the accent (see "The mark"), so `HD` alone would read as a `7`.
`k > 0` means curvature bulging **outward**.

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
3. **Voice and copy** — fix what the page says (Phase 3). The voice guide is
   done (`docs/VOICE-NOTES.md`), and the **Leo face's copy pass is now complete**
   — including the old "Featured Projects", rebuilt as **Experience** with new
   **Community** and **Publications** sections. barbuz's copy pass is the
   remaining piece.
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

## The barbuz cards

The app and tool cards on the barbuz face (`BarbuzFace.svelte`, rendered by one
`{#snippet card}`) each carry **two destinations**: the app itself, and its
source on GitHub.

Because two anchors cannot nest, the card is an `<article>`, not one big `<a>`.
The "open ↗" link is stretched over the whole card by `.card__go::after`, so a
click anywhere opens the app; the GitHub button sits above it (`.card__repo`,
`z-index: 1`) so it stays its own click. The decorative `.card::after` glow is
`pointer-events: none` so it cannot swallow either.

The GitHub button is **icon only** (`lucide-svelte`'s `Github`), so it adds no
words to the card. It therefore needs an explicit accessible name —
`aria-label="Source for <app> on GitHub"` — since there is no visible text to
borrow one from. Card data lives in the `apps` / `tools` arrays: `tag`, `name`,
`href`, `repo`, `body`. Adding a card means adding a row, not markup.

The tags name **what each app is**, not the technology behind it
(`real world maps`, `music pad`, `MTG daily game`, `for 3CB gurus`), and are
lowercase labels per `docs/VOICE-NOTES.md`.

## The persona switcher

`PersonaToggle.svelte` is **icon only** — a moon and a sun on a sliding thumb,
with no words. It is meant to read as an Easter egg: the glyphs hint that the
site has two faces without explaining the trick. `press F to flip` (the `.hint`)
is the discoverable path.

The visible words are gone but the **accessible** ones are not: the `<button>`
keeps `role="switch"`, `aria-checked`, and a live `aria-label`
(`Switch to Leo` / `Switch to barbuz`). Do not add a `title` or visible text
back — that undoes the intent. Styling for it is in `src/app.css` under
`.switch*`.

It lives **inside each face's nav**, not in fixed chrome over the page. That is
deliberate: the switch is part of the page, so the flip rotates it along with
everything else and the whole thing reads as one sheet turning over. A fixed
switch would hang still while the page turned under it.

Each face renders its own copy, on the **opposite end of the bar** — barbuz
leads with it, Leo trails with it — so a flip swaps the switch with the other
face's name and mirrors the bar. The inactive face is `inert`, so the
duplicate is not reachable. If you add a face, put a toggle in its nav too, or
the switch will vanish on that face.

The `--c-*` chrome tokens it reads are emitted on `.face--*`, alongside the
face's colours, **not** on `html[data-persona]`. That is load-bearing: keyed on
the global persona, both switches would recolour the instant a flip began, and
the outgoing one would pop bright mid-turn. The switch must keep its own face's
colours for the whole rotation, so it stays a still picture of its face.

The barbuz switch is also **mirrored** (`.face--barbuz .switch`,
`transform: scaleX(-1)`), so a flip turns it over rather than showing the same
arrangement twice — moon and sun trade sides. The glyphs are counter-mirrored
so they stay upright.

After this, the only `html[data-persona]` rule in `src/app.css` is the
`.flipper` rotation itself. Keep it that way: nothing the switch draws should
depend on the global persona.

## Section heads: one eyebrow each

On the barbuz face every section head carries an eyebrow, so the slot is a rule
rather than a one-off. Apps is `give them a try`, Tools is `niche by design`.
Both are lowercase labels — the CSS uppercases them, per the label register in
`docs/VOICE-NOTES.md`.

The eyebrow must not restate its own `h2`. "Tools / special tools for special
needs" said *tools* twice and was reverted. The heading is the load-bearing part
(it is the nav label and the section anchor), so when the two collide, rewrite
the eyebrow.

`.section__head` is `space-between` with baseline alignment, so the eyebrow sits
opposite the `h2`. A longer eyebrow wraps under itself at phone widths and that
is fine — it stays left-aligned under the heading with the rule below.

## The Leo CV sections: Experience, Community, Publications

The Leo face's old "Featured Projects" is gone. It was three cards for work from
previous employment with **no public link to give**, and a card with a hover glow
promises a click the page cannot honour. In its place are three CV-style sections,
all built from `cv_ghignone.tex` in the repo root (the author's real CV):

- **Experience** — `#experience`, after About. Three roles. Because there is no
  link, the words carry the credibility: each entry names the domain and one
  concrete thing. Publidok (2016) is deliberately left off; the CV holds the full
  history.
- **Community** — `#community`, after Journey. FOSS4G organising (2024, 2025, both
  linked) and ON Prime / CSIRO (the ForeSight project, linked). ForeSight lives
  here, not in Experience.
- **Publications** — `#publications`, after Core Expertise. Newest first. All
  four full texts are **self-hosted** under `static/papers/` (served at
  `/papers/…`), not linked to the publisher — publisher PDF URLs rot, as the
  Protomaps tileset taught us. The author is an author on all four. **Licences
  differ:** three are CC BY 4.0, and the 2023 conference paper is the author's
  own version (IEEE copyright, not CC BY), flagged by *"· author's version"* on
  that entry's meta line. Never host a publisher's typeset PDF that is not open
  access. The section head links to the author's Google Scholar profile.

Each publication title carries a **`PDF` tag**, not the `↗` external-link
suffix: the files are ours, served from `/papers/`, so `↗` would say "you are
leaving the site" when you are not. The tag names the file instead. See
`docs/VOICE-NOTES.md` → Mechanics.

Experience and Community share the `cv-list` / `cv-item` / `cv-when` / `cv-body`
classes and a 6rem year rail; Publications reuses the same shape via `pub-list`.
The rail collapses to one column under 640px. **No `↗` on an entry that is not a
link** — the only `↗` in these sections are on the real external links.

The thesis link used to sit on the Reinforcement Learning card; it now lives in
Publications, and the card carries only its claim.

## Spelling is Australian English

Decided in `docs/VOICE-NOTES.md` and applied across the prose: `-ise` / `-yse` /
`-our` / `-re`. So `optimised`, `normalise`, `analyse`, `colour`, `centre`.

Two carve-outs, and they matter when editing:

- **Identifiers keep their spelling.** CSS `color`, `backgroundColor`,
  `theme-color`, DOM APIs and JSON keys are not prose. Do not "fix" them.
- **Generated files are not hand-edited.** `brand/tokens.css` and
  `brand/tokens.js` come from `brand/tokens.json`; edit the JSON and run
  `npm run tokens`.

The voice guide's "Current state" note tracks which files still need the pass;
keep it honest when you apply one.
