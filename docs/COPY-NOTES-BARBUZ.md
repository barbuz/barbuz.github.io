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

## 7. Section eyebrows — the open problem

| Face | Section | Eyebrow | What it is |
|---|---|---|---|
| barbuz | hero | `// maker · small sharp tools` | a role line |
| barbuz | Apps | `03` | a card count |
| barbuz | Tools | `niche by design` | a phrase |
| barbuz | About | *(none)* | — |
| Leo | hero | `Software Engineer` | a role line |
| Leo | Expertise | `03` | a card count |

The eyebrow is the small mono label above a heading. It is `text-transform:
uppercase` in CSS, so the lowercase labels in the markup (`niche by design`)
render as `NICHE BY DESIGN`.

The slot holds **four different kinds of thing** across the two faces. The two
`03`s are not section numbers — barbuz's Apps is the first section on its face
and Leo's Expertise is the second on its, so a running number would read `01`
and `02`. They are **card counts**, and both happen to be 3.

Not changed, because the fix is a design decision rather than a wording one —
see below.

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

**2. The eyebrow — open. A design decision, not a wording one.**

The slot holds four different kinds of thing (see §7). Three ways to fix it:

- **(a) One job: a category.** Make the eyebrow always name the thing the
  section is about — `apps`, `tools`, `about`; `geospatial`, `machine learning`,
  `llms`. It reads as a label rather than a decoration, and it is the only
  option that works when the card count changes.
- **(b) One job: a count.** Keep `03`, and give every section that holds a
  collection its count — including Tools, which currently holds one card and
  says `niche by design` instead. Honest, but it makes a section of one card
  advertise its smallness, and the count has to be maintained by hand.
- **(c) Remove it.** The hero keeps its role line; the sections keep just the
  `h2`. The heading already says what the section is, so the eyebrow is
  currently decoration on three of four sections.

**Recommendation: (c), remove it from the section heads.** The `h2` already names
the section, so the eyebrow repeats it in a second register — which is the actual
problem, not which content it holds. It stays on the hero, where it does real
work: it names the role, which the `h1` (`barbuz`, or the Leo headline) does not.

This is a layout change, not a copy change, so it is left for the layout pass
rather than done here. It is recorded because the *content* decision has to be
made before the layout is finalised — the same rule as the rest of Phase 3.
