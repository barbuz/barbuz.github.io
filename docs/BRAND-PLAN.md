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

## Phase 1 — lift the tokens out of the page ✅ done *(page)*

The palette used to live in `src/app.css`. It is now its own thing, so the apps
can use it.

- `brand/tokens.json` is the source of truth: colour per persona (including the
  semantic success / warning / danger and the `accent-soft` wash), type, motion,
  radius and space.
- `brand/tokens.css` and `brand/tokens.js` are generated from it and committed,
  so the site builds without running the generator.
- `src/app.css` imports the generated CSS instead of defining the palette.
- `npm run tokens` regenerates; `npm run tokens:check` fails CI if the JSON was
  edited without regenerating.
- The semantic colours and `accent-soft` were designed here, measured against
  both backgrounds. See DESIGN-NOTES for the values and the contrast tables.

**Output:** the tokens are shareable. `docs/DESIGN-NOTES.md` records the
reasoning; `brand/README.md` records how to consume them.

**Still open (deliberately):** how the *apps* consume the tokens — npm package
vs vendored file. That is a Phase 4 question. See open decision 1.

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

Phase 1 is done, so the next step is **Phase 2, the mark**. That is the one piece
here that is creative rather than mechanical, and the one that most wants the
owner's eye.
