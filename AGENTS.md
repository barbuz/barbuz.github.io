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
| `docs/COPY-NOTES.md` | Draft-vs-current copy pairs on the Leo face. |

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

## Order of work

Page-only phases first, then the apps. `docs/BRAND-PLAN.md` is the authority;
this is the short version:

1. **Tokens** — extract to `brand/tokens.json` / `brand/tokens.css` (Phase 1). ✅ done
2. **The mark** — settle the logo and favicon (Phase 2).
3. **Voice and copy** — fix what the page says (Phase 3).
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
