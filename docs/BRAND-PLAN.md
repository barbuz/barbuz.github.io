# Brand plan

How the barbuz visual identity grows from the one page that has it into every
thing the name touches.

The design decisions themselves live in [DESIGN-NOTES.md](./DESIGN-NOTES.md).
This file is the *plan*: what to build, in what order, and what is still open.

---

## The goal

Four apps and a personal page that look like they came from one person, without
looking identical. Same colour system, same type system, same voice — each app
still free to be its own thing.

Today only the personal page has a system. `byom`, `digitofono`,
`match-the-gatherer` and `the stylus` each invented their own.

## The principles

1. **Content before layout.** Fix what the page says, then build the layout
   around it. Not the other way round. This is why the copy pass runs before
   any app work: a layout designed around placeholder text has to be rebuilt
   once the real words land.
2. **Cool at night, warm by day. Blue is the one colour that crosses both.**
3. **Mono type is the shared thread.** Bricolage/Instrument Serif set the mood
   per face; JetBrains Mono is constant, which is what makes the two faces read
   as one site.

Anything added to the brand has to survive rules 2 and 3. That is the test.

## The split

Phases 0–3 happen **on the page only** (`barbuz.github.io`). The page is the
place the system is designed and proven. Phases 4–5 are the first work that
touches **other repos**, and they start only once the page is settled.

---

## Phase 0 — foundation ✅ done

The page is built and the system exists as CSS custom properties.

- Token-based palette for both personas (`src/app.css`).
- Persona resolved before first paint; `?leo` deep link.
- The journey map retuned to the two-tone accent pair.
- Notes committed under `docs/`.

**Output:** `barbuz.github.io` is the source of truth for the palette.

## Phase 1 — lift the tokens out of the page *(page)*

The page currently owns the palette. The apps cannot use it until it is its own
thing. This is a near-mechanical extraction, and it is first because it is
cheapest while the values are fresh and the contrast tables still hold.

- Create `tokens.json` — the machine-readable source: every colour, the type
  stack, spacing and radius scale, motion durations.
- Generate `tokens.css` from it, so the two can never drift.
- Add the colours the page did not need but the apps will: semantic success /
  warning / danger, and an `accent-soft` wash for selected states. These are
  listed as deliberately deferred in DESIGN-NOTES — this is where they get
  designed, against both backgrounds.
- Point the page at the generated CSS instead of defining the palette inline.

**Deliberately not decided here:** how the *apps* consume the tokens (npm
package vs vendored file). That is a Phase 4 question, and it should not hold up
the extraction. See open decision 1.

**Why first:** the tokens are name-agnostic. If the mark or the name changes
later, the colour system survives untouched. It is the safe work, and it is
cheap this hour.

## Phase 2 — the mark *(page)*

There is no real logo yet — the page uses the wordmark "barbu**z**" and a
placeholder favicon. Settle it before Phase 3, because the mark is content too.

- Decide the direction: wordmark only, a monogram, or a mark + wordmark lockup.
- Constraints: must work at 16px, must work in one colour, must hold on both the
  night and the day background.
- Produce the favicon and the app-icon set from it.

**Why before the copy pass:** the mark is fixed content. If it arrives late, the
hero and the nav get laid out around a placeholder and then rebuilt — the exact
problem rule 1 exists to prevent.

## Phase 3 — voice and copy *(page)*

Settle what the page says. This runs before any app work so the layout is built
around real words.

- **Voice.** Two registers already exist: barbuz (maker, short sentences,
  lowercase, dry) and Leo (engineer, professional, full sentences). Write both
  down as a short style guide — it is the reference the copy pass is written
  against, and the apps inherit it later.
- **Copy pass.** `docs/COPY-NOTES.md` holds every draft-vs-current pair on the
  Leo face. Settle each one. Then delete the file once it is fully folded in.

The barbuz face needs the same treatment; it currently has no counterpart file.

**Output:** the page's content is fixed, and the layout can be finalised.

---

*Everything below touches other repos. Nothing here starts until the page is
settled.*

## Phase 4 — apply it to the apps

Order is deliberate: start with the app that is closest to the page, so the
first port proves the system rather than fighting it.

1. **`match-the-gatherer`** — Svelte + Vite, already a PWA. Closest in stack and
   the most-used app. Adopt the palette, the type stack, and the mono thread.
   This is the proof.
2. **`byom`** — the map app. Same accent pair as the journey map, so the two
   blue tones should already feel native.
3. **`digitofono`** — an instrument; likely the most expressive. Adopt the
   tokens, but let it keep its own feel. Do not force the layout conventions.
4. **`the stylus`** — niche, low traffic, possibly a single file. Lowest
   priority; a palette swap may be the whole job.

Decide the consumption method first (open decision 1). Per app, the checklist is
the same:

- [ ] palette tokens from the shared source, both light and dark if it supports both
- [ ] type stack: display / body / mono
- [ ] favicon and app icon from the shared mark
- [ ] footer credit linking back to `barbuz.github.io`
- [ ] voice: copy written in the app's register, not pasted from the page
- [ ] contrast re-checked against that app's actual backgrounds

**Do not** copy the page's layout. The brand is colour, type, voice and motion —
not section order.

## Phase 5 — join the apps up

The last step, and the one that makes them feel like a family rather than a
palette swap.

- A consistent top-bar or footer pattern across the apps: same mark position,
  same "back to barbuz" affordance.
- Cross-links: each app's page on the hub, and the hub linked from each app.
- One shared social/OG image template.

---

## Open decisions

| # | Decision | Blocks |
|---|---|---|
| 1 | npm package vs vendored `tokens.css` for the apps | Phase 4 |
| 2 | logo direction (wordmark / monogram / lockup) | Phase 2, then the icons in Phase 4 |
| 3 | does any app need a dark mode of its own, or is barbuz-night the only dark? | Phase 4 |
| 4 | the draft's three fake "Featured Projects" — delete or replace with the real apps | Phase 3 |

## Order of work

Tokens, then the mark, then the copy pass — all on the page. Only then the apps.

The mark is the one piece here that is creative rather than mechanical. If it
stalls, do not let it block Phase 1: the token extraction is independent and can
proceed the same day.
