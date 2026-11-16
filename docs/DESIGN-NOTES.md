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


## The mark

The mark is the letter `b`, and the whole identity is built from it. This is not
a monogram drawn beside a wordmark — it is the same shape, cut once.

### One primitive, five letters

Every letter of `barbuz` is a subset of the `b`'s four strokes:

| Stroke | What it is |
|---|---|
| **S** | the stem |
| **V** | the vertical |
| **H** | the horizontal |
| **D** | the diagonal |

| Letter | Strokes | Reading |
|---|---|---|
| `b` | S + V + H + D | the whole — **this is the mark** |
| `a` | V + H + D | the b without its ascender |
| `r` | V + H | a corner |
| `u` | V + D | an open bowl |
| `z` | H + D | a bar and a diagonal, plus an accent foot |

`S` and `V` are the same line at two lengths: `V` is the part of the stem below
the x-height, `S` is the full stem. They are named separately because the
difference between them *is* the difference between `b` and `a` — `a` drops the
ascender. So the `b` draws as three segments (`S + D + H`), because `S` already
covers `V`.

**Containment is the rule.** Every letter is a piece of the `b`, and the `b` is
the mark. So the mark is not a separate asset to be kept in sync — it *is* the
first letter of the word, and the word is made of marks.

### The primitive is four points, and four edges

The strokes above are really a graph. Every stroke in the system ends on one of
four points, and no stroke ends anywhere else:

| Point | Where | Which letters reach it |
|---|---|---|
| **P1** | the tip of the ascender | `b` only |
| **P4** | the right angle, top of the bowl | `b` `a` `r` `u` `z` |
| **P3** | the shoulder, top-right | `b` `a` `r` `u` `z` |
| **P2** | the foot, bottom-left | `b` `a` `r` `u` `z` |

The four edges are the whole vocabulary — `S` (P1–P2), `V` (P4–P2), `H` (P4–P3)
and `D` (P2–P3). Read this way, **containment is node-set containment**, and it
is exact rather than approximate: `b` reaches all four points, and every other
letter reaches the same three. `b` is the whole because it is the only letter
that touches `P1`.

`nodePoints()` in `mark.mjs` returns these, and the test of the claim is that
`nodePoints(letterStrokes('a'))`, `('r')`, `('u')` and `('z')` all return the
identical three points.

### Only the diagonal bends

Of the four edges, three are axis-aligned — `S` and `V` are vertical, `H` is
horizontal. Curvature has nowhere to act on them; they are straight because they
cannot be anything else. `D` is the only edge that is neither vertical nor
horizontal, so it is the only one that can bulge.

That is why `k` is a property of one edge rather than a treatment applied to the
shapes. Any new element added to the kit inherits the bend automatically if, and
only if, it runs along `D`.

### The node device

A **node** marks a corner: a knockout hole punched through the stroke, with a
ring in the stroke's own ink. `NODE` in `mark.mjs` holds the three radii as
multiples of the stroke width, so the device scales with whatever it is drawn on.

The hole is what makes it work. The mark is drawn in the accent, so an
accent-coloured node *on the mark* would be invisible. Carrying the contrast in
the hole rather than in the node's own colour lets one device read on both the
accent mark and the ink word.

**The hole is a real hole.** The knockout is a mask (`nodeDevice()`), not a disc
of ground colour painted over the stroke. That distinction matters in one place:
the favicon is transparent, and a ground-coloured disc there would show as a
solid dot on a coloured tab. A mask cuts the stroke and leaves the background
visible, so the same markup works on any ground. The rasterizer follows the same
rule — an erasing disc, except on the opaque tiles and the social card, where
painting the ground colour keeps the icon opaque (an apple-touch icon with a
transparent dot is wrong).

**It ships.** The device is part of the mark, so it is on by default:
`markSvg()`, `tileSvg()` and `lockupSvg()` all draw it, and the icon set carries
it. Pass `{ nodes: false }` to get the bare stroke.

**No size opts out.** The device is never turned off by size. At 16px it does
not read as nodes — the ring is sub-pixel (~0.4px) and the knockout is ~84% of
the ~2px stroke, so the stem tip softens and the ascender tip can look detached.
That is the accepted trade: a mark with the device, however small, over one
without it. It also removes an inconsistency — `favicon.svg` is built by
`markSvg()`, which always drew the device, so before this the two favicons
disagreed at 16px. Now they agree.

The device is legible from ~32px up. Below that it is texture, not a readable
ring. `{ nodes: false }` remains available for a caller that wants the bare
stroke, but no shipped asset uses it for size.


### The consequences, stated plainly

- **The `z` carries a foot, drawn in the accent.** `z = {H, D}` alone reads as
  a `7`. Adding a third stroke (`H + D + H`) makes it legible alone, but the
  extra stroke is not part of the `b`'s vocabulary, so a plain third stroke
  would break containment. The resolution is the foot's **colour**: the foot is
  `H` again — the mark's own stroke — set at the baseline, and it is drawn in
  the accent, the mark's ink, while the letter stays in the word's ink. So the
  letter is still `H + D`, containment still holds exactly (`nodePoints` of the
  `z` is the same three points as `a`, `r` and `u`), and the foot reads as the
  mark reaching into the word rather than as a third edge of the letter.
  `nodePoints()` skips accent strokes for exactly this reason: the foot's far
  end is a fifth point, and it must make no node claim. The foot also paints
  **behind** the letter's ink: it meets the diagonal at the baseline, and drawn
  last its round cap would sit on top of that junction, reading as a stroke
  crossing the letter rather than tucked under it.
- **The `u` needs negative curvature.** With straight strokes the `u` reads as
  a `v`. Bulging the diagonal outward — away from the bowl's interior — gives it
  the openness a `u` needs. This was the move that made the system work.
- **The right angle sits at the top of the bowl.** The bowl's corner is the
  right angle; the angle at the bottom of the diagonal is 45° or less.

### Curvature

Straight lines read as a geometric puzzle, not a typeface. One parameter, `k`,
bulges a segment outward:

```
k = 0        straight
k = 0.16     the value in use — the mark and the letters share it
```

**`k > 0` means outward**, away from the shape's interior. The sign convention
is worth stating because it is easy to get backwards: the normal to a diagonal
points one way or the other depending on which end you start from, so the
generator resolves direction against a reference point rather than trusting the
raw normal.

The mark and the letters use the *same* `k`, and the mark's diagonal (63.7
units) is within 2% of the letters' (62.5). That is what makes them one system:
the same value produces the same absolute bulge, not just a similar one.

### Stroked, round caps

The mark is **stroked, never filled**, with **round caps and joins**, in both
the wordmark and the icons. Filled and stroked were both tried; stroked keeps
the counter open, which is what makes the `b` read as a `b` rather than a solid
silhouette. Round caps match the letters.

### The mark is heavier than the text

| | Stroke | Why |
|---|---|---|
| the mark | 14 | must hold at 16px in a tab |
| the letters | 9 | reads at body and display sizes |

A 16px favicon has no room for a hairline. The mark is cut heavier so it
survives the smallest size it will ever be asked to work at.

### The lockup: the mark is the first `b`

Where the mark and the name sit together — the social card today — the mark
**stands in for the first `b`**, and the word beside it is `arbuz`:

```
   [mark]  arbuz        ✅  the mark IS the b
   [mark]  barbuz       ❌  b drawn twice
```

Setting the full name next to the mark doubles the letter: the reader sees
`bbarbuz`. This is not a spacing tweak, it follows from the containment rule —
the mark is not a badge that happens to sit near the word, it is the word's
first letter. Any new lockup has to obey it.

Two alignment rules come with it, and both are easy to get subtly wrong:

- **Match the bowls, not the ink boxes.** The mark is scaled so its bowl
  (baseline to x-height) equals the text's. The two then share a baseline. The
  earlier version scaled the mark to the text's *ink height* and aligned *ink
  tops* — which left the baselines **5.2px apart** on the card, because the
  heavier stroke overshoots its cap more than the light one. Two boxes the same
  height are not the same letter in the same place.
- **Keep the letter gap even.** The word starts one letter-gap to the right of
  the mark's ink, measured ink to ink (`gap - stroke`, i.e. 9 units), not from
  the mark's nominal width. The mark is wider than a text `b` (60 vs 49 ink
  units), so advancing by the letter's nominal width would open a hole after it.

The mark stays a little taller and heavier than the letters in the lockup —
bowls match, ascenders and weight do not, by design. That is the mark being the
mark, not a fourth-rate text glyph.

`lockup()` in `mark.mjs` returns the mark and the word already placed in the
text's coordinate space, so a caller scales and centres the pair as one block.

### The element kit

The mark is one shape. The kit is the *grammar* it was built from, freed from
the letters, so a project can build UI that reads as barbuz without redrawing
the logo. `brand/elements.mjs`.

These are **not** pieces of the `b`. An earlier attempt cut the kit strictly
from the `b`'s own strokes, and it was useless — every element was a fragment of
one letter, so nothing could be used for a chevron or a play button. The useful
thing was never the letter; it was the three rules the letter obeys. So the kit
applies the rules to other shapes instead:

1. **Straight or bulged, never both on one edge.** An axis-aligned edge is
   straight; a diagonal bulges by the shared `K`. This is the same rule as the
   mark's (§ "Only the diagonal bends"), and it is applied in one place —
   `edges()` — so no element has to think about it. An element is defined as a
   list of points; the rule decides which edges bend.

2. **45° discipline.** The mark's diagonal is at 45°. The kit keeps its
   diagonals there too, so a chevron and the mark's bowl read as one family.
   A diagonal at some other angle would look like a different brand.

3. **Nodes on corners.** The corner device travels with the grammar. Any element
   can carry it: `elementSvg('arrow', { nodes: true })`.

The three rules are asserted by `npm run elements:check`. That matters more
than it sounds: rule 1 is the kind of thing that erodes silently. Add a chevron
with a slightly-off diagonal and nothing looks broken; the family just weakens.
The check fails instead.

**Two documented exceptions.** `check` and `cross` are straight, via an
`orthogonal: true` flag. Rule 1 exists because the bend marks a diagonal; on a
tick, a bend reads as a wobble — the hand-drawn look it gives a letter is wrong
for a symbol that is supposed to be mechanical. The exception is explicit and
named, so it is a decision rather than a drift.

**What is in the kit.** Nine elements, the ones that name a UI verb:
`chevron`, `play`, `caret`, `arrow`, `check`, `cross`, `dot`, `ring`,
`progress`. Elements are drawn in a nominal 0..100 box and scaled by the
caller, and everything is lines and quadratics — the same primitives as the
mark, so the same hand-rolled rasterizer can draw them.

**Frozen, and trimmed from sixteen.** The kit started with sixteen shapes, but
the other seven — `corner`, `wedge`, `slash`, `divider`, `branch`, `bracket`,
`bullet` — named no screen and no verb. They were built on spec, before
anything asked for them, which is the thing the plan's first principle ("content
before layout") exists to prevent. A shape nobody has needed yet is not a brand
asset; it is geometry to keep correct, and it had already cost several rounds of
bug-fixing and two expansions of the checker.

So the kit is **frozen at the nine with a verb, and marked experimental**:
nothing imports `elements.mjs`, no app consumes it, and it is not a shipped
asset. It is not in the plan — `docs/BRAND-PLAN.md` never mentions it, and its
Phase 4 checklist (tokens, type, mark-derived icons, footer, voice) does not ask
for it. Treat the kit as a proof that the mark's grammar generates usable UI
shapes, not as something to maintain. Grow it from a real screen that needs an
icon, in Phase 4, and add back only what that screen asks for.

The parked seven, with their geometry, so they are a one-line restore rather
than a re-derivation:

| Element | Geometry | Why parked |
|---|---|---|
| `corner` | `edges([[0,100],[0,0],[100,0]], { ref: [40,60] })`, stroke 12 | A "barbuz card" framing motif, if one is ever wanted |
| `wedge` | `edges([[0,100],[0,0],[100,0]], { ref: [40,60], close: true })`, fill | The bowl as a standalone blob; nothing calls for it |
| `slash` | `edges([[0,100],[100,0]], { ref: [50,100] })`, stroke 12 | The mark's diagonal alone; decoration |
| `divider` | the slash, plus `seg([0,50],[100,50])`, stroke 10 | Competes with a CSS rule |
| `branch` | `edges([[0,0],[0,100],[100,0]], { ref: [40,60] })`, stroke 12 | The `b`'s gesture abstracted; no meaning on any screen |
| `bracket` | `edges([[100,0],[0,0],[0,100],[100,100]], { ref: [50,50] })`, stroke 12 | Straight arms only; the framing motif again |
| `bullet` | `edges([[0,0],[100,0],[0,100]], { ref: [60,40], close: true })`, fill | A list marker; text lists want `::marker`, not an SVG |

**The checker is no longer a CI gate.** `npm run elements:check` still asserts
every rule and is worth running whenever the module is touched, but it was
removed from the deploy workflow at the freeze: it was the only CI step guarding
a module nothing ships, while the mark — which does ship, in the favicon and
every app icon — is what `icons:check` and `mark:check` protect. Spending CI
rigour on the unused thing and not the shipped one had the priority backwards.

**The engine is the reusable part.** `edges()`, `seg()`, the shared `K` and the
node device are what make a new icon read as barbuz, and they are a few dozen
lines. The catalogue is the speculative part, and it is the part that was
trimmed. If a Phase 4 app needs an icon the nine do not cover, the right move is
to compose it from `edges()` against a real screen — not to re-add the parked
seven wholesale.

**Two defects that were silent, and are now asserted.** Neither broke rendering,
so nothing looked wrong while the output was:

- **The viewBox clipped the ink.** The nominal box is the *centrelines'* box, so
  a round cap reaches half a stroke past it. The viewBox was the bare box, so
  every element whose stroke touched an edge had its caps cut off, and the node
  mask was sized from the same bare box, so a node on an edge lost its knockout.
  Both are now sized from the real ink, and `elements:check` asserts the viewBox
  covers it.
- **A filled element drew no node device.** `elementSvg` short-circuited on
  `el.fill`, so `nodes: true` was a no-op for `play` — and the reason was
  upstream: the device sizes its hole and ring from the element's stroke, and a
  filled element has none, so the radii were zero. Sizing from the kit default
  fixes it; the checker asserts a mask and rings are always emitted.

### Assets

Everything is generated from one geometry module, `brand/mark.mjs`, which holds
the strokes and exports the SVG builders. Nothing is hand-drawn twice.

```bash
npm run icons          # regenerate static/favicon.svg + the icon set
npm run icons:check    # fail if the geometry changed but the assets did not
```

`generate-icons.mjs` rasterizes the mark in plain JavaScript — signed distance
to each stroke, supersampled. The mark is deliberately pure geometry, so this is
exact, and it avoids a native SVG dependency in the toolchain. CI runs
`icons:check` alongside `tokens:check`.

#### Why the rasterizer is hand-rolled — and when to stop

This is a deliberate "fine now, revisit if the geometry gets richer" decision,
not a permanent verdict. The reasoning is recorded here so it is not re-litigated
from scratch, and so the trigger to revisit is written down rather than felt.

**Why it is fine now.** The mark is three line segments and one quadratic.
Nothing else — no fills, no gradients, no boolean operations, no winding rules.
Signed distance to a segment is exact for that, so the hand-rolled rasterizer is
not an approximation of a general renderer; for this input it *is* the
computation. It is about 100 lines, and it keeps a native toolchain out of the
repo.

**The measurements, so nobody has to redo them.** The realistic alternative is
`@resvg/resvg-js`, rendering the SVG that `tileSvg()` already produces. Tested
on the same 512px tile:

| | output | notes |
|---|---|---|
| hand-rolled | **5,782 bytes** | `filter=none` + `deflate 9` |
| resvg | 9,153 bytes | 1.58× larger |
| pngjs (encoder only) | 10,171 bytes | 1.76× larger |

Pixel-wise the two renderers agree: max channel difference 64/255, confined to
antialiased edges (610 edge pixels, 252 interior). That is two renderers
converging, not one being wrong. `resvg` also declares 12 platform packages
(~8 MB installed), which is the native dependency the generator exists to avoid.

**The trigger to revisit.** Switch to a real renderer the moment the mark gains
any of: filled shapes, gradients, more than one subpath with a fill rule, or
path boolean operations. At that point the signed-distance approach stops being
exact and starts being a geometry engine — which is a bad thing to maintain and
exactly what `resvg` is for. Richer geometry also changes the calculus: if the
mark is no longer three segments, "keep it dependency-free" is no longer worth
the complexity.

**One approximation, stated plainly.** The quadratic is flattened to a
48-segment polyline (`segPoints(s, 48)`) rather than solved analytically. This
is invisible at every size shipped, but it is an approximation and would need
raising if the mark were ever rendered very large.

| File | What it is |
|---|---|
| `static/favicon.svg` | the mark, vector, transparent, with the node device |
| `static/favicon.ico` | 16 / 32 / 48, the mark alone, with the node device |
| `static/apple-touch-icon.png` | 180, opaque |
| `static/icon-192.png`, `icon-512.png` | manifest, tile form |
| `static/icon-maskable-512.png` | manifest, padded for Android masks |
| `static/og.png` | 1200×630 social card, the lockup (mark + `arbuz`) |

All of them carry the node device, at every size. The device is legible from
~32px up; at 16px it is texture rather than a readable ring, and it is kept
anyway — a mark with the device, however small, over one without it.

**The tile is for app icons, not for tabs.** The mark is tall and narrow (60×102),
so a square tile shrinks it to a few pixels at 16px. The favicon is therefore
the bare mark; the rounded tile is used at 180px and up, where it has room.
