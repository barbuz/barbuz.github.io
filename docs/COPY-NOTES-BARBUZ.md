# Copy notes — barbuz face

Working doc for the wording on the maker (barbuz) side. The Leo counterpart is
[`COPY-NOTES-LEO.md`](./COPY-NOTES-LEO.md).

The Leo file compares a **draft** against the **page**, because a prototype
preceded that face. The barbuz face has no earlier draft — the copy in
`src/lib/BarbuzFace.svelte` *is* the first version. So this file compares the
**current** copy against a **proposed** one, and gives the reason from
[`VOICE-NOTES.md`](./VOICE-NOTES.md) for each change.

Every rule cited here is one of the four in the shared spine, or one of the
barbuz register rules.

Where a change was made directly by the author rather than proposed here, the
table says so, and the author's wording is the one recorded.

---

## Headline finding

**The barbuz copy is already close to the register.** Most of it needs no
change, and the hero is the guide's own worked example of the register working.
This pass is therefore light — four edits, not a rewrite. A copy pass that
invents work to look busy would make the page worse.

**Follow-up pass (§10).** A later round applied the author's own changes: the
three app tags, a GitHub button on every card, and an icon-only persona
switcher. Those are recorded in §10 rather than as proposals, since the wording
came from the author directly.

---

## 1. Hero

| | Text |
|---|---|
| **current** | "I build small, sharp tools that do one thing well. Mostly for the web, mostly offline-first, always made to be picked up in one hand." |
| **proposed** | *(unchanged)* |

The register at its best. Short clauses, no filler, the parallel "mostly…
mostly… always…" reads as rhythm rather than a run-on. **Leave it.** It is also
quoted in `VOICE-NOTES.md` as the positive example, so changing it would
invalidate the guide.

## 2. App — byom

| | Text |
|---|---|
| **original** | "Bring Your Own Map — georeference a photo or PDF of any map, then see your GPS position on it, even with no signal." |
| **proposed here** | "Bring Your Own Map. Georeference a photo or PDF of any map, then see your GPS position on it. Even with no signal." |
| **applied (author)** | "Bring Your Own Map. Take a photo of any map, add some reference points, then see your live GPS position on it. Even with no signal." |

The original was one sentence of 24 words with three commas. The barbuz register
splits at the comma: "if a sentence needs a comma to breathe, it is two
sentences." The em dash after `Map` was also doing two jobs — expanding the
acronym *and* joining a clause.

The author's rewrite is the one kept, and it is the better of the two: "add some
reference points" is more concrete than "georeference", and "live" earns its
place. Both versions split the long sentence, so the register point stands.

**`PDF` is deliberately dropped.** The app does support it — `src/lib/pdf.js`,
`PdfPagePicker.svelte`, and a multi-page picker — so this is the page
under-selling a real feature, not over-claiming one. Left out on purpose to keep
the card short. The app's own README still lists it, so the two now differ;
that is a known, accepted divergence rather than an oversight.

## 3. App — digitofono

| | Text |
|---|---|
| **current** | "A streamlined touchscreen instrument. Tap or drag anywhere on a near-blank surface and it sings." |
| **proposed** | "A touchscreen instrument. Tap or drag anywhere on a near-blank surface and it sings." |

`streamlined` is rule 1 filler — it would fit any instrument ever described, so
it tells the reader nothing. The rest is good, and "it sings" is the dry joke
the register wants. Cut the adjective, keep the sentence.

## 4. App — match the gatherer

| | Text |
|---|---|
| **current** | "A Wordle-style daily guessing game for Magic: The Gathering cards, with worldwide stats." |
| **proposed** | *(unchanged)* |

Concrete and short. `Wordle-style` and `Magic: The Gathering` are both facts a
reader can check, and "with worldwide stats" is a real feature.

## 5. Tool — the stylus

| | Text |
|---|---|
| **current** | "A browser tool for gurus who edit 3 Card Blind MTG result sheets. Small, specific, and sharp at its one job." |
| **proposed** | "A browser tool for editing 3 Card Blind MTG result sheets. Small, specific, and sharp at its one job." |

The card's own tag already says `for 3CB gurus`, so "for gurus who edit" says
the same thing twice inside one card. Dropping it also pulls the sentence under
the register's length.

This card says `MTG` while the match-the-gatherer card spells out `Magic: The
Gathering`. That is deliberate, not inconsistent — the audience decides. See
decisions.

## 6. About

| | Text |
|---|---|
| **current** | "barbuz is where I put the things I build for the love of building them — offline-first web apps, a musical instrument, a daily game. Same person behind the engineering side, different hat." |
| **proposed** | *(unchanged)* |

In register, and the second sentence carries the link to the Leo face without
explaining the joke. Leave it.

## 7. Section eyebrows — numbers removed

The eyebrow is the small mono label above a heading. It is `text-transform:
uppercase` in CSS, so the lowercase labels in the markup (`niche by design`)
render as `NICHE BY DESIGN`.

**Before:** the slot held four different kinds of thing across the two faces.

| Face | Section | Eyebrow | What it was |
|---|---|---|---|
| barbuz | hero | `// maker · small sharp tools` | a role line |
| barbuz | Apps | `03` | a card count |
| barbuz | Tools | `niche by design` | a phrase |
| barbuz | About | *(none)* | — |
| Leo | hero | `Software Engineer` | a role line |
| Leo | Expertise | `03` | a card count |

The two `03`s were not section numbers — barbuz's Apps is the first section on
its face and Leo's Expertise is the second on its, so a running number would
read `01` and `02`. They were **card counts**, and both happened to be 3, which
is why the mismatch went unnoticed.

**Applied (author): both number eyebrows removed**, from barbuz Apps and Leo
Expertise. The count is already visible in the grid, and it was the only thing
in the slot that could silently go stale.

**Applied (author): barbuz Apps got an eyebrow.** Apps now carries
`give them a try`, so the slot is consistent across the barbuz face rather than
a one-off on Tools.

**Applied, then reverted (author): the Tools eyebrow.** Tools was briefly
`special tools for special needs`, replacing `niche by design`. It was reverted:
the eyebrow restated its own heading — "Tools / special tools for special
needs" says *tools* twice, and it was the only head on the face that did. Since
`Tools` is load-bearing (it is the nav label, the `#tools` anchor, and the
umbrella word the hero already uses — "I build small, sharp tools"), the
heading stays and the eyebrow is the slot that yields. `niche by design` is
back, and the repeat is gone.

**What remains:**

| Face | Section | Eyebrow | What it is |
|---|---|---|---|
| barbuz | hero | `// maker · small sharp tools` | a role line |
| barbuz | Apps | `give them a try` | an invitation |
| barbuz | Tools | `niche by design` | a phrase |
| barbuz | About | *(none)* | — |
| Leo | hero | `Software Engineer` | a role line |

The hero labels do real work — they name the role, which the `h1` does not — so
they are not in question. `About` on barbuz keeps no eyebrow, which is fine:
it is prose, not a grid, so there is nothing to label. The Leo face still has
eyebrows only on its hero, which is part of the open Leo pass (§ decision 4).

## 8. Footer, nav, buttons

| | Text |
|---|---|
| **original** | "barbuz · built in the open" · "github.com/barbuz" · "© 2026" |
| **applied (author)** | "barbuz" · "github.com/barbuz" · "© 2026" |

"Built in the open" is a claim, not a fact, and the `github.com/barbuz` link sits
in the same footer — so the point is made by the link rather than asserted
beside it. The footer is now three plain facts: name, link, year. That is the
register.

Nav (`Apps` / `Tools` / `About`) and buttons ("See the apps" / "GitHub ↗" /
"open ↗") are all correct against the mechanics table: sentence case, no full
stop, external link marked `↗`. No change.

## 9. Meta and social copy (`src/app.html`)

| | Text |
|---|---|
| **current** | description: "barbuz — small, sharp tools. Apps by barbuz, and the engineer behind them." · og:title: "barbuz" |

In register and it does the job — names the apps and the second face in two
clauses. The `og:description` is the same sentence in Title case ("Small, sharp
tools."). Harmless, and not worth a change on its own.

---

## 10. Follow-up pass — tags, GitHub buttons, switcher

Five changes made directly by the author, on the barbuz face only. Recorded
here so the decisions are not re-derived later.

### 10a. App tags

The tag is the small mono label above each card's `h3`.

| Card | Before | After |
|---|---|---|
| byom | `PWA · offline` | `real world maps` |
| digitofono | `Web Audio` | `music pad` |
| match the gatherer | `daily game` | `MTG daily game` |
| the stylus | `for 3CB gurus` | *(unchanged)* |

The old tags named the **technology** (`PWA`, `Web Audio`); the new ones name
**what the app is**, which is the concrete thing rule 2 asks for. All four are
lowercase labels, per the case rule. `MTG daily game` keeps the acronym in caps
inside the lowercase label, exactly as `Web Audio` did — the label is lowercase,
the proper noun is not. It also matches decision 1 below: `MTG` on the two
cards whose audience already knows it, spelled out in prose on match the
gatherer's body.

### 10b. A GitHub button on every card

Each card now carries a small GitHub mark that links straight to the source
repo, separate from the card's own "open" target:

| Card | Repo |
|---|---|
| byom | `github.com/barbuz/byom` |
| digitofono | `github.com/barbuz/digitofono` |
| match the gatherer | `github.com/barbuz/match-the-gatherer` |
| the stylus | `github.com/barbuz/the-stylus` |

This is the first place on the page where a card has **two destinations**, so
the card is no longer one big `<a>`. The card is an `<article>`; the "open ↗"
link is stretched over the whole card with a `::after`, and the GitHub button
sits above it (`z-index: 1`) so it stays its own click. A click anywhere else
opens the app, as before. Two anchors cannot nest, which is why the structure
changed rather than adding a second link inside the old one.

The icon-only button needs its own accessible name — it has no visible text —
so it carries `aria-label="Source for <app> on GitHub"`, and `title="Source on
GitHub"` for the pointer tooltip. It is `target="_blank"`, so it gets `rel=
"noopener"`.

The button is **icon only**, so it adds no words to the card. The link's meaning
lives in the mark and the accessible name, not in a visible `GitHub ↗` label;
the visible-text version would have crowded a card whose `card__go` already
says "open ↗".

### 10c. The persona switcher is icon-only

The switcher used to show the two words `barbuz` and `leo` beside their
moon/sun glyphs. The words are gone; the two icons remain, on the same sliding
thumb.

The reasoning is voice, not just layout: the toggle is a **cross-face** control
that reveals the site has two faces, and the author wants it to read as an
Easter egg rather than an explained control. Labelling it in words hands the
reader the trick. The glyphs alone are the hint.

What keeps it usable without visible text:

- The `<button>` keeps `role="switch"`, `aria-checked`, and a live
  `aria-label` (`Switch to Leo` / `Switch to barbuz`), so screen readers still
  get the words the eye no longer sees. Removing the label from the DOM is a
  visual choice, not an accessibility one.
- The `press F to flip` hint below it stays — that is the discoverable path for
  anyone who does not read the glyphs.

The now-unused `gap` / `white-space` on `.switch__opt` were dropped, and the
glyphs were sized up (0.85rem → 1rem) and given symmetric padding, since an
icon-only control has no text to set its height.

### 10d. The switcher moves into the nav and turns with the page

The switcher was fixed chrome pinned to the viewport's top-right
(`position: fixed`, `z-index: 70`), so it hung above the page while everything
else rotated under it during a flip. It is now a normal element **inside each
face's own nav**, one instance per face, so it is part of the page and rotates
with it. The flip reads as one sheet turning over rather than a control
floating over a turning sheet.

The two faces place it on **opposite ends of the bar**, so a flip mirrors the
bar:

| | Leading end | Trailing end |
|---|---|---|
| barbuz | switcher | links, then the lockup |
| Leo | the name | links, then the switcher |

That mirroring is the second half of the effect: the switcher does not merely
rotate in place, it swaps sides with the name, so the whole bar reads as
having turned over.

Consequences:

- `PersonaToggle.svelte` renders a plain `.toggle` wrapper, not `.chrome`. The
  fixed-chrome rule in `src/app.css` is gone.
- The `press F to flip` hint is now absolutely positioned just under the
  switcher (it was a sibling in a fixed box), so it stays with the control
  wherever the bar puts it. It is still hidden after the first flip.
- Both faces now render the toggle, so both faces contain a switch button. The
  inactive face is `inert` (`PersonaFlip.svelte`), so only the visible one is
  reachable — there is no hidden second control to tab to.
- The chrome tokens (`--c-*`) the switcher reads are emitted on the face
  (`.face--*`), not on `html[data-persona]`. That is what keeps the switcher's
  colours attached to its own face; see §10e.

### 10e. The switcher belongs to its face

Two refinements that share one root cause. The switcher's colours **and** its
lit/knob state were keyed on `html[data-persona='…']` — the *global* persona —
and the `--c-*` colours were emitted there too. So the instant a flip began,
the attribute changed and **both** switchers recoloured and re-marked at once:
the outgoing barbuz switch visibly popped bright while it was still rotating
away. That reads as a look-alike control being swapped in, not as one object
turning over.

The fix is to make the switch belong to its face:

- The chrome tokens moved from `html[data-persona='…']` onto `.face--*`, in
  `brand/generate.mjs` (edit the generator, not the output). Each switch now
  inherits the colours of the face it sits in, so **barbuz is always dark and
  Leo always bright**, for the whole rotation.
- The state rules (lit option, thumb position) moved from
  `html[data-persona='…']` onto `.face--*`. A switch is only ever seen on the
  face that owns it, so "active" is always the face itself.
- The barbuz switch is **mirrored** (`.face--barbuz .switch {
  transform: scaleX(-1) }`), so a flip turns it over rather than showing the
  same arrangement twice: moon and sun trade sides. The whole switch mirrors,
  thumb included, so the knob still sits under the lit glyph; the glyphs are
  counter-mirrored (`.switch__opt svg`) so they stay upright and readable.

After this the only `html[data-persona]` rule left in `src/app.css` is the
`.flipper` rotation itself. Nothing the switch draws depends on the global
persona, which is the point: the switch is part of the page it sits on.

### 10f. What did not change

- **The stylus tag** (`for 3CB gurus`) — still accurate and in register.
- **Card bodies** — the GitHub link is an affordance, not copy; no body text
  changed. §2's byom body and §5's the-stylus body stand.
- **The footer** already carries `github.com/barbuz`; the per-card buttons are
  the deep links, the footer stays the profile link.

---

## What was checked and found clean

- **No exclamation marks**, no "passionate", no superlatives — the register's
  "never" list is already respected.
- **No US spellings.** The barbuz face is clean; the US spellings in the repo
  are on the Leo face, in `README.md`, and in two `JourneyMap.svelte` comments.
  Note the byom rewrite keeps `Bring Your Own Map` as a proper name, so its
  initialisms are not spelling choices.
- **Labels follow the case rule.** `PWA · offline`, `daily game`, `for 3CB
  gurus` are lowercase; `Web Audio` keeps its capitals because it is a name.
  This matches the rule now written in the guide, so the guide documents what
  the page already does rather than prescribing a change.

---

## Decisions

**1. `MTG` vs `Magic: The Gathering` — settled: keep both, audience decides.**

The `the stylus` card keeps `MTG`, and `match the gatherer` keeps the spelled-out
`Magic: The Gathering`. This is not an inconsistency to fix: the stylus is aimed
at 3 Card Blind players, who all know the acronym, while match the gatherer is
the more popular app and its audience includes people who do not. Spell it out
where the audience is broad, abbreviate where it is narrow. Recorded here so it
is not re-flagged as an inconsistency later.

**2. The number eyebrows — settled: removed.** The two `03`s are gone from
barbuz Apps and Leo Expertise. A card count in the section head duplicates what
the grid already shows, and it was the one part of the slot that could go stale
without anyone noticing. See §7.

**3. The Tools eyebrow — settled: `niche by design` kept.** The slot is now
consistent by filling it, not emptying it: Apps is `give them a try`, Tools is
`niche by design`, so every barbuz section head carries an eyebrow. An earlier
pass made Tools `special tools for special needs`, but that restated the `h2`
("Tools / special tools…") and was reverted — `Tools` is the nav label and the
anchor, so the heading is the fixed part and the eyebrow yields. See §7.
