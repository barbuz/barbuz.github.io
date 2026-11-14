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

## Usage

```bash
npm run tokens         # regenerate tokens.css + tokens.js
npm run tokens:check   # fail if the JSON was edited but not regenerated (runs in CI)
```

The generated files are committed, so the site builds without running the
generator. CI runs `tokens:check` to catch a JSON edit that was never applied.

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
