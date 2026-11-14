# Design notes — palette

Decisions and the reasoning behind them, so the brand kit / `tokens.json` can be
built from here without re-deriving anything.

## Accent

**Decision: two tones, one hue.** Same blue family on both faces, tuned
separately so each contrasts correctly against its own background.

| Face | Accent | Ink on accent | vs its bg |
|---|---|---|---|
| barbuz (dark `#0A0E17`) | `#3D7BFF` | `#06090F` | 5.03:1 |
| Leo (light `#FAF8F3`) | `#1D4ED8` | `#FFFFFF` | 6.31:1 |

Both are hue 221–224°, so they read as the same brand colour. The darker tone is
used on the light face and the lighter tone on the dark face — the opposite of
intuitive, but it is what contrast requires (see below).

### Why not a single accent for both faces

A single colour has to satisfy two opposing constraints. Measured:

| Accent | vs dark bg | vs light bg | Verdict |
|---|---|---|---|
| `#C8FF4D` (lime, original) | 16.42 | **1.11** | invisible on light |
| `#4D8DFF` (blue, first try) | 6.04 | **3.01** | only just passes on light |
| `#3D7BFF` | **5.03** | **3.61** | passes on dark, weak on light |
| `#1D4ED8` | **2.88** | **6.31** | fails on dark, strong on light |

The two columns pull in opposite directions: every step that improves contrast
on white reduces it on near-black. There is no value that is *good* on both —
`#2F6FE0` is the closest to a compromise at 4.11 / 4.43, and it is mediocre on
each rather than strong on either. So: two tones, one hue.

### Contrast rules applied

- WCAG AA body text needs **≥ 4.5:1**; large text and UI borders need **≥ 3:1**.
- Accent-as-text (links, labels) uses the pair above, both ≥ 4.5:1.
- Accent-as-fill (buttons, switch thumb) uses `--accent-ink` for the label so
  the text on the fill also passes.

### How to adjust

Move **hue** to change the brand colour; move **lightness** to fix contrast.
Keep the two tones ~30–40° of lightness apart. If a new accent is chosen,
re-run the contrast check against both `#0A0E17` and `#FAF8F3` before adopting.

## Backgrounds

Both backgrounds carry a deliberate temperature, and each is tuned so its text,
muted text, and accent all clear WCAG AA against it.

| Role | barbuz (night) | Leo (day) |
|---|---|---|
| bg | `#0A0E17` | `#FAF8F3` |
| surface | `#111726` | `#FFFFFF` |
| surface-2 | `#161D2E` | `#F5F2EA` |
| border | `#232C40` | `#E6DFD1` |
| text | `#E7EAF2` | `#1B1A17` |
| muted | `#8A94AA` | `#6E6A5F` |
| accent | `#3D7BFF` | `#1D4ED8` |
| accent-ink | `#06090F` | `#FFFFFF` |

### The temperature rule

Each face is coherent in temperature, and they sit at **opposite ends** on purpose:

- **barbuz is cool.** Background `#0A0E17` is hue 222 (blue). Text `#E7EAF2` is
  hue 224 — cool, to match. This is the fix that mattered most: the original
  `#E9E7E1` text was hue **45 (warm)**, i.e. warmer than the blue background it
  sat on, which is why the night face felt slightly muddy. Cool bg + cool text
  reads as intentional.
- **Leo is warm.** Background `#FAF8F3` is hue 43 (warm paper). Text `#1B1A17`
  is hue 45. Warm-on-warm, like ink on cream.

So the flip is not just light↔dark, it is **cool↔warm** — a stronger and more
memorable signal than brightness alone. Stated as a rule a new component can be
checked against: **cool at night, warm by day, and blue is the one colour that
crosses both.**

### Contrast results (all measured, not eyeballed)

| Pair | Ratio | Required | Pass |
|---|---|---|---|
| night text on bg | 16.04 | 4.5 | ✅ |
| night muted on bg | 6.34 | 4.5 | ✅ |
| night accent on bg | 5.03 | 4.5 | ✅ |
| night accent-ink on accent | 5.20 | 4.5 | ✅ |
| day text on bg | 16.40 | 4.5 | ✅ |
| day muted on bg | 5.09 | 4.5 | ✅ |
| day accent on bg | 6.31 | 4.5 | ✅ |
| day accent-ink on accent | 6.70 | 4.5 | ✅ |
| night border vs bg | 1.38 | 3.0 (non-text) | ⚠️ decorative only |

The border is a hairline used for separation, not an information-bearing
boundary, so it is intentionally subtle rather than at the 3:1 UI threshold.
If a border ever *does* carry meaning (an error state, a focused control), it
must switch to the accent colour, which passes.

## Semantic colours

Added in Phase 1, when the tokens became a shared file. The page does not use
these yet; the apps will. Each is designed per face, not shared across them —
the same reasoning as the accent, and the same trap if ignored (a colour that
reads well on white is invisible on near-black).

| Role | barbuz (night) | vs bg | Leo (day) | vs bg |
|---|---|---|---|---|
| success | `#22c55e` | 8.47 | `#15803d` | 4.73 |
| warning | `#f0b429` | 10.35 | `#8a5a00` | 5.58 |
| danger | `#f87171` | 6.98 | `#b91c1c` | 6.10 |

All six clear AA as text on their own background. If used as a *fill*, put
`--accent-ink` on top: measured 8.75 / 10.69 (night success / warning) and
5.02 / 6.47 (day success / danger).

## accent-soft

A translucent accent wash for selected rows and active states. Because it is
translucent it composites against whatever sits under it, so it was tuned
against `surface-2`, which is the worst case for visibility.

| Face | Value | vs surface-2 | text on it |
|---|---|---|---|
| barbuz | `rgba(61, 123, 255, 0.28)` | 1.55 | 9.61 |
| Leo | `rgba(29, 78, 216, 0.28)` | 1.55 | 10.02 |

**Why 0.28.** The first attempt used 0.16 / 0.12, which measured **1.03:1**
against `surface-2` — indistinguishable, i.e. the state would not have been
visible at all. 0.28 is the point where the tint reads as deliberate (≈1.55:1)
while the text on it stays far above AA. It is a wash, not a border, so it is
held below the 3:1 non-text threshold on purpose.

## Type

| Face | Display | Body | Mono |
|---|---|---|---|
| barbuz | Bricolage Grotesque (800) | Bricolage Grotesque | JetBrains Mono |
| Leo | Instrument Serif | Instrument Sans | JetBrains Mono |

Mono is shared deliberately — it is the thread that makes the two faces read as
one site.

## Where these values live

The palette is no longer defined in `src/app.css`. The source of truth is
[`brand/tokens.json`](../brand/tokens.json), which generates `brand/tokens.css`
(for the page and the static apps) and `brand/tokens.js` (for apps that build
with a bundler). Both generated files are committed.

```bash
npm run tokens         # regenerate after editing the JSON
npm run tokens:check   # fail if the JSON was edited but not regenerated (CI)
```

Never edit `tokens.css` or `tokens.js` by hand. Changing a **hue** changes the
brand colour; changing a **lightness** fixes contrast. Keep the two accent tones
~30–40° of lightness apart, and re-run the contrast check against both
backgrounds before adopting a new value.

