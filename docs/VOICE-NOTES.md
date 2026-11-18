# Voice notes — the two registers

The page has two faces. They are the same person, so the voice has a shared
spine and then diverges on one axis: **sentence length**. That is the whole
trick. barbuz is the same ideas said short; Leo is the same ideas said with
their connective tissue left in.

This is the reference the copy pass is written against (Phase 3 of
[BRAND-PLAN.md](./BRAND-PLAN.md)), and the reference the apps inherit in
Phase 4.

---

## The shared spine

Both registers obey these. They are not style preferences; they are what makes
the copy sound like a person rather than a brochure.

1. **Say the true, specific thing.** An adjective that would fit any engineer is
   a hole in the sentence. "Robust, scalable solutions" describes everyone, so
   it describes no one. Name the format, the number, the tool.
2. **Concrete beats abstract.** `GeoParquet`, `Ollama`, `3 Card Blind`, `16px`.
   A reader trusts a sentence they could check.
3. **Active voice, first person.** "I build" — not "solutions are built".
4. **One idea per sentence.** The registers differ in how many words carry that
   idea, not in how many ideas get stacked into one breath.

### The test

Every sentence must survive: *could this have been written by anyone with this
job title?* If yes, rewrite it until it could only have been written by this
person.

---

## barbuz — the maker

Short, direct, pragmatic, dry. A joke on some occasions.

- **Length.** Most sentences under 12 words. If a sentence needs a comma to
  breathe, it is two sentences.
- **Register.** Unimpressed and practical. Confidence comes from brevity, not
  from claims. Understatement over emphasis.
- **Case.** The **label register is lowercase** — eyebrows, tags, the brand
  name itself (`barbuz`, `byom`, `digitofono`, `the stylus`). **Prose is normal
  sentence case**, because lowercase prose reads as a gimmick and costs
  legibility at paragraph length. Proper names and acronyms keep their case
  inside a lowercase label: `daily game` and `for 3CB gurus` are lowercase,
  `Web Audio` and `PWA` are not, because they are names.
- **The joke.** **No fixed budget — a joke goes in only when it fits.** The
  constraints that remain are about placement, not count: at the end of a
  thought, never carrying meaning, and never in a hero headline, button label,
  instruction or error. A joke must never be the only place a fact lives. Dry,
  not zany — it should be possible to miss it. A page with no joke is fine; a
  page with a forced one is not.
- **Never.** Exclamation marks. "Passionate". Superlatives. Anything that
  sounds like a pitch.

Worked example — the hero, currently:

> I build small, sharp tools that do one thing well. Mostly for the web, mostly
> offline-first, always made to be picked up in one hand.

That is the register at its best: four short clauses, one idea, no adjectives
doing the work that facts should do.

---

## Leo — the engineer

Colloquial and professional at once: friendly, but the sentences are allowed to
be long and to think out loud.

- **Length.** Longer, with subordinate clauses and connective tissue. Where
  barbuz chops, Leo joins — "because", "which", "so that".
- **Register.** A competent colleague explaining their work. Warm, not formal.
  Contractions are fine (`I'm`, `it's`). Hedging is not — "I work across" beats
  "I have experience in".
- **Case.** Full sentences, sentence case, proper capitals.
- **The joke.** None. The warmth here comes from directness and from being
  genuinely interested in the problem, not from gags.
- **Never.** "Passionate". "Cutting-edge". "Leverage". Stacked adjectives
  ("robust, scalable, maintainable"). The word "solutions" as a noun for
  software.

Worked example:

> As a full-stack developer and open-source advocate, I build geospatial tooling
> on cloud-optimised formats like GeoParquet and Zarr, apply machine learning
> where it earns its place, and run LLMs locally or in the cloud, whichever fits
> the project.

The concrete half is good — it names the formats. An earlier version
of the first half was the problem: "passionate", "robust, scalable solutions" and
"advanced" are all filler by rule 1. The fix was to cut them, not to reword them.

---

## Mechanics

Shared across both registers.

| Thing | Rule |
|---|---|
| External links | `↗` suffix (`GitHub ↗`, `Read the thesis ↗`) |
| Internal links | No suffix — they are not leaving |
| Self-hosted files | `PDF` tag, not `↗` — the file is ours, so an arrow would claim the reader is leaving the site when they are not. The tag names the file (`… Great Barrier Reef Data PDF`) |
| Buttons | Sentence case, no full stop (`Get in touch`) |
| Headings | **Title Case on the Leo face** (`Core Expertise`, `Get in Touch`). barbuz headings are single words, so the split rarely shows — where it does, the label rule above applies |
| App names | Always lowercase, even mid-sentence (`byom`, `match the gatherer`) |
| Em dash | Spaced, `—`, for an aside. Not a hyphen, not an en dash |
| Ellipsis | Only for a trailing thought, never for suspense |
| Numbers | Numerals (`3 Card Blind`), except at the start of a sentence |

### Spelling

**Decision: Australian English.** Australian spelling is a **-ise / -yse /
-our / -re** variety, and it sits between the US and UK habits rather than
copying either — which is worth stating, because "not US" would wrongly
suggest `-ize` is fine.

| Use (AU) | Not |
|---|---|
| `optimised`, `normalise`, `organise`, `analyse` | `optimized`, `normalize`, `organize`, `analyze` |
| `modelling`, `travelling`, `cancelled` | `modeling`, `traveling`, `canceled` |
| `colour`, `behaviour`, `favour` | `color`, `behavior`, `favor` |
| `centre`, `metre`, `litre` | `center`, `meter`, `liter` |
| `licence` (noun), `license` (verb) | one form for both |
| `grey` | `gray` |
| `program` (computing), `programme` (otherwise) | — |

Two carve-outs, both deliberate:

- **Identifiers keep their spelling.** A CSS property (`color`), a DOM API
  (`document.querySelector`), a JSON key, a TypeScript symbol, and the
  Tailwind `theme-color` meta tag are not prose. Never "fix" these — renaming
  them breaks the build.
- **Generated files are not hand-edited.** `brand/tokens.css` and
  `brand/tokens.js` come from `brand/tokens.json`; fix the JSON and run
  `npm run tokens`.

**Current state — spelling applied.** The spelling half of the copy pass is
done: `src/lib/LeoFace.svelte` no longer has `cloud-optimized` (it was in the
About prose and the Geospatial card; both are now `-ised`), `README.md` has
`Optimised` and `Customising`, and `JourneyMap.svelte` has `Normalise` and
`Initialise` in its comments. Identifiers were left alone.

**Still open.** The Leo face's wording has had its About pass: the prose no
longer opens "I'm a passionate software engineer" and no longer builds "robust,
scalable solutions" — the exact filler the worked example above deletes — and the
hero's "Full-stack engineer with a PhD" line stands. The Leo face's dropped
**Featured Projects** (open decision 4 in BRAND-PLAN) is now **resolved**: it
became the **Experience** list, with a **Community** and a **Publications**
section beside it, all built from the author's CV. See `COPY-NOTES-LEO.md`
§ 10a–10c. The Leo nav was also trimmed from seven section links to four
landmarks (§ 10e). Nothing remains open on the Leo face.

---

## Decisions

Settled:

1. **Spelling** — Australian English. See above.
2. **Heading case** — Title Case on the Leo face; barbuz keeps lowercase
   labels.
3. **Joke budget** — no fixed budget. A joke goes in only when it fits.

Still open, and they belong to the copy pass rather than the guide:

4. **Does Leo ever go lowercase?** The faces differ in case *within* labels
   (barbuz lowercase, Leo Title Case). Keeping that split is a deliberate
   signal; it should just be a decision rather than a leftover.

## Checklist for any new copy

- [ ] Which register is this? Read it aloud at that register's sentence length.
- [ ] Does every sentence name something concrete?
- [ ] Is any word here filler — *passionate, robust, scalable, seamless,
      cutting-edge, solutions, expertise*?
- [ ] Is the joke in a place where it cannot carry meaning or mislead?
- [ ] Are app names lowercase and links marked correctly?
- [ ] Is it in Australian English — and did you leave identifiers alone?
