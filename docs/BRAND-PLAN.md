# Brand plan

How the barbuz visual identity grows from the one page that has it into every
thing the name touches. Written to be executed in order; each phase leaves the
repo in a working state.

The design decisions themselves live in [DESIGN-NOTES.md](./DESIGN-NOTES.md).
This file is the *plan*: what to build, in what order, and what is still open.

---

## The goal

Four apps and a personal page that look like they came from one person, without
looking identical. Same colour system, same type system, same voice — each app
still free to be its own thing.

Today only the personal page has a system. `byom`, `digitofono`,
`match-the-gatherer` and `the stylus` each invented their own.

## The principle

Two rules carry the whole brand, and they already hold on the page:

1. **Cool at night, warm by day. Blue is the one colour that crosses both.**
2. **Mono type is the shared thread.** Bricolage/Instrument Serif set the mood
   per face; JetBrains Mono is constant, which is what makes the two faces read
   as one site.

Anything added to the brand has to survive both rules. That is the test.

---

## Phase 0 — foundation ✅ done

The page is built and the system exists as CSS custom properties.

- Token-based palette for both personas (`src/app.css`).
- Persona resolved before first paint; `?leo` deep link.
- The journey map retuned to the two-tone accent pair.
- Notes committed under `docs/`.

**Output:** `barbuz.github.io` is the source of truth for the palette.

## Phase 1 — lift the tokens out of the page

The page currently owns the palette. The apps cannot use it until it is its own
thing.

- Create `barbuz/brand` (or `brand/` in this repo) holding:
  - `tokens.json` — the machine-readable source: every colour, the type stack,
    spacing and radius scale, motion durations.
  - `tokens.css` — the same values as custom properties, generated from the
    JSON so the two can never drift.
  - `README.md` — the two rules above, plus the contrast table from
    DESIGN-NOTES.
- Add the colours that the page did not need but the apps will: semantic
  success / warning / danger, and an `accent-soft` wash for selected states.
  These are listed as deliberately deferred in DESIGN-NOTES — this is where they
  get designed, against both backgrounds.
- Make `barbuz.github.io` consume `tokens.css` instead of defining the palette
  inline. If the page and the package ever disagree, the package wins.

**Open decision — how apps consume it.** Three options:

| Option | Cost | Fits |
|---|---|---|
| Published npm package (`@barbuz/brand`) | needs a registry + a release step | best if the apps are built with a bundler and want semver |
| `tokens.css` vendored into each repo | a copy to re-sync | simplest; fine for static sites that already copy assets |
| git submodule | submodules to manage | painful, not recommended |

Recommendation: **npm package from GitHub Packages**, because three of the four
apps already run a build step. Fall back to vendoring for `the stylus` if it is a
single static file.

## Phase 2 — apply it, one app at a time

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

Per app, the checklist is the same:

- [ ] palette tokens from the package, both light and dark if it supports both
- [ ] type stack: display / body / mono
- [ ] favicon redrawn from the shared mark
- [ ] footer credit linking back to `barbuz.github.io`
- [ ] contrast re-checked against that app's actual backgrounds

**Do not** copy the page's layout. The brand is colour, type, voice and motion —
not section order.

## Phase 3 — copy and identity

Text and logos are explicitly still draft. This phase settles them.

- **Logo / mark.** There is no real logo yet; the page uses the wordmark
  "barbu**z**" and a placeholder favicon. Decide: a wordmark only, a monogram,
  or a mark + wordmark lockup. It has to work at 16px and in one colour.
- **Voice.** Two registers exist already: barbuz (maker, short sentences,
  lowercase, dry) and Leo (engineer, professional, full sentences). Write both
  down as a short style guide so the apps inherit a consistent tone.
- **Copy pass.** `docs/COPY-NOTES.md` holds every draft-vs-current pair on the
  Leo face. Settle each one, then delete the file once it is fully folded in.

## Phase 4 — join the apps up

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
| 1 | npm package vs vendored `tokens.css` | Phase 1 |
| 2 | logo direction (wordmark / monogram / lockup) | Phase 3, favicons in Phase 2 |
| 3 | does any app need a dark mode of its own, or is barbuz-night the only dark? | Phase 2 |
| 4 | the draft's three fake "Featured Projects" — delete or replace with the real apps | Phase 3 |

## Order of work

Phase 1 first: nothing else is worth doing until the tokens are shared, and
Phase 2 will surface any gap in the system that the page did not. Phase 3 runs
alongside Phase 2. Phase 4 is last, and is cheap once the rest is done.
