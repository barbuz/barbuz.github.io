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

---

## Headline finding

**The barbuz copy is already close to the register.** Most of it needs no
change, and the hero is the guide's own worked example of the register working.
This pass is therefore light — three edits, not a rewrite. A copy pass that
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
| **current** | "Bring Your Own Map — georeference a photo or PDF of any map, then see your GPS position on it, even with no signal." |
| **proposed** | "Bring Your Own Map. Georeference a photo or PDF of any map, then see your GPS position on it. Even with no signal." |

One sentence of 24 words with three commas. The barbuz register splits at the
comma: "if a sentence needs a comma to breathe, it is two sentences." The em
dash after `Map` is also doing two jobs — expanding the acronym *and* joining a
clause. Splitting it lets the trailing fact land on its own, which is where the
register puts a punchline.

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

**Abbreviation inconsistency, not fixed here:** this card says `MTG` while the
match-the-gatherer card spells out `Magic: The Gathering`. Both are fine; using
both on one page is not. Flagged as a decision below rather than guessed.

## 6. About

| | Text |
|---|---|
| **current** | "barbuz is where I put the things I build for the love of building them — offline-first web apps, a musical instrument, a daily game. Same person behind the engineering side, different hat." |
| **proposed** | *(unchanged)* |

In register, and the second sentence carries the link to the Leo face without
explaining the joke. Leave it.

## 7. Section eyebrows — inconsistent

| Section | Eyebrow |
|---|---|
| Apps | `03` |
| Tools | `niche by design` |
| About | *(none)* |

The eyebrow is the small label above a heading. On this face it holds a **count**
on one section and a **phrase** on another, which is two different registers for
the same slot. On the Leo face it holds a category (`Geospatial`,
`Machine Learning`).

Not changed, because the fix depends on what the eyebrow is *for* — see
decisions.

## 8. Footer, nav, buttons

| | Text |
|---|---|
| **current** | "barbuz · built in the open" · "github.com/barbuz" · "© 2026" · nav: Apps / Tools / About · buttons: "See the apps" / "GitHub ↗" / "open ↗" |

All correct against the mechanics table: buttons in sentence case with no full
stop, the external link marked `↗`, app names lowercase. No change.

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
- **Labels follow the case rule.** `PWA · offline`, `daily game`, `for 3CB
  gurus` are lowercase; `Web Audio` keeps its capitals because it is a name.
  This matches the rule now written in the guide, so the guide documents what
  the page already does rather than prescribing a change.

---

## Decisions needed

1. **The eyebrow.** Is it a count (`03`), a category (`Geospatial`), or a
   phrase (`niche by design`)? Pick one job for the slot and apply it on both
   faces. The current mix is the only real inconsistency found in this pass.
2. **`MTG` or `Magic: The Gathering`?** Pick one and use it everywhere. The
   spelled-out form is friendlier to a reader who does not know the acronym;
   the short form is what the audience actually says.
