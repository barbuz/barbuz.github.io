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

## Type

| Face | Display | Body | Mono |
|---|---|---|---|
| barbuz | Bricolage Grotesque (800) | Bricolage Grotesque | JetBrains Mono |
| Leo | Instrument Serif | Instrument Sans | JetBrains Mono |

Mono is shared deliberately — it is the thread that makes the two faces read as
one site.

## Still to add (not yet needed in the prototype)

Semantic colours (success / warning / danger) and an `accent-soft` wash for
selected states. These are needed before the apps adopt the system, not for the
marketing page. Left out deliberately so the palette stays minimal until there
is a real use.

