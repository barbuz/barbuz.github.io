# Copy notes — Leo face

Working doc for the wording on the engineering (Leo) side. It keeps the original
draft copy and the copy now on the page side by side so the text can be settled
**before** the layout is finalised — the layout gets built around the chosen
words, not the other way round.

Status legend: `draft` = the original `barbuz.github.io` draft @ 2026-02-19 ·
`page` = the copy now on the Leo face, in `src/lib/LeoFace.svelte`.

The `page` column began as the prototype's copy. The prototype was a standalone
static page, since folded into this repo and removed, so the page itself is now
the source for this column.

---

## Status

**Wording pass under way.** The Australian-English spelling pass is applied on
the Leo face (`cloud-optimised` in the About prose and the Geospatial card). The
About prose has now also had its wording pass (see below). Every remaining
wording question is listed here rather than settled.

Settled so far:

- **§ 4–5, the About prose — rewritten.** The two paragraphs were cut down to
  the register: the filler is gone, and the thesis clause now says what the
  research was actually about (making RL cheap to run on simple hardware). The
  LLM clause says "locally or in the cloud, whichever fits the project" — no tool
  named, because the author works both ways. This resolves the contradiction with
  `VOICE-NOTES.md`, whose worked example quoted this paragraph — that example now
  uses the applied text.
- **§ 3 / § 7, the thesis link — moved.** The hero no longer carries a
  "Read the thesis ↗" button. The link has since moved on from the
  **Reinforcement Learning** card to a new **Publications** section (§ 10c),
  where it sits beside the papers. The card now carries only its claim.
- **§ 8a, the card eyebrows — dropped.** The three uppercase kickers above the
  Core Expertise card headings are gone, and so is their CSS rule. They had no
  consistent job and restated their own headings; see §8a.
- **§ 10a, Featured Projects — resolved.** The last open decision (4 in
  `BRAND-PLAN.md`) is settled: the three fake cards are replaced by an
  **Experience** list built from the author's real CV. Two new sections join it —
  **Community** (§ 10b) and **Publications** (§ 10c).

Nothing remains open on the Leo face.

---

## 1. Hero headline

| | Text |
|---|---|
| **draft** | *(none — the draft hero used the name, not a headline)* |
| **page** | "Turning hard data into *useful things*." |

Note: the draft led with **"Hi, I'm Leo Ghignone"** + the role "Software Engineer".
The page moved the name to the nav and promoted a headline. Revert or keep.

## 2. Hero subheading

| | Text |
|---|---|
| **draft** | "Specializing in geospatial data analysis, machine learning, and large language models. I build intelligent solutions that turn complex data into actionable insights." |
| **page** | "Full-stack engineer with a PhD in Machine Learning. I work across geospatial data, reinforcement learning, and practical LLM systems." |

## 3. Hero buttons

| | Text |
|---|---|
| **draft** | "Get In Touch" · "View My Work" |
| **page** | "Get in touch" |

The page's second button, "Read the thesis ↗", has been **removed** — the link
now lives on the Reinforcement Learning card (§ 7).

## 4. About — paragraph 1

| | Text |
|---|---|
| **draft** | "I'm a passionate software engineer with a PhD in Machine Learning, where my research focused on efficient Reinforcement Learning for Swarm systems. My strong interdisciplinary skills enable me to develop sophisticated solutions across various domains, from complex data challenges to innovative AI applications." |
| **page (before)** | "I'm a passionate software engineer with a PhD in Machine Learning, where my research focused on efficient Reinforcement Learning for Swarm systems. My interdisciplinary skills let me move from complex data problems to shipped applications." |
| **applied (author)** | "I'm a software engineer with a PhD in Machine Learning, where my research was about efficient reinforcement learning for swarm systems — many small agents learning to cooperate, cheap enough to run on simple hardware. I build across the stack, and I like a project that ends in something people actually use." |

Cut **passionate** (Leo "never" list) and the abstract padding (**strong
interdisciplinary skills… sophisticated solutions… complex data challenges**,
spine rule 1). The thesis clause gains a plain gloss — "many small agents
learning to cooperate" — and the point of the research, which is **cost and
efficiency on simple hardware**, not making RL work. "I like a project that ends
in something people actually use" replaces "shipped applications" with the same
idea said warmly, in the Leo register.

## 5. About — paragraph 2

| | Text |
|---|---|
| **draft** | "As a full-stack developer and open-source advocate, I specialize in building robust, scalable solutions using cutting-edge technologies. My expertise spans geospatial data analysis with cloud-optimized formats like GeoParquet and Zarr, advanced machine learning algorithms, and practical applications of large language models using tools like Ollama for local model deployment." |
| **page (before)** | "As a full-stack developer and open-source advocate, I build robust, scalable solutions — geospatial analysis with cloud-optimised formats like GeoParquet and Zarr, advanced ML, and practical LLM deployment with local models." |
| **applied (author)** | "As a full-stack developer and open-source advocate, I build geospatial tooling on cloud-optimised formats like GeoParquet and Zarr, apply machine learning where it earns its place, and run LLMs locally or in the cloud, whichever fits the project." |

This is the paragraph `VOICE-NOTES.md` quotes as its worked example of what to
cut. **"robust, scalable solutions"** is two banned things at once — stacked
adjectives *and* "solutions" as a noun for software — and **advanced** is filler
by spine rule 1. Cutting "solutions" also fixes the grammar: the list was
appositive to it, so the verb becomes "I build geospatial tooling on…".

The LLM clause names no tool: it says **local or in the cloud**, which is the
author's actual position — both, chosen per project. Naming a tool here would
pick a side the author does not hold, and the named technologies belong on the
card (§ 8) rather than in the prose. So the prose carries the stance and the card
carries the examples.

## 6. About — paragraph 3

| | Text |
|---|---|
| **draft** | "I'm committed to open-source software development and believe in creating solutions that are not only powerful but also accessible and maintainable. Whether it's building predictive models, analyzing spatial patterns, or implementing AI-powered systems, I bring both technical excellence and strategic thinking to every project." |
| **page** | *(removed)* |

## 7. About — thesis link

| | Text |
|---|---|
| **draft** | "Read my PhD thesis on Reinforcement Learning for Swarm systems" |
| **page** | moved again — the thesis is now an entry in **Publications** (§ 10c), not a link on a card |

The link has moved twice: it was in the hero buttons, then on the Reinforcement
Learning card in Core Expertise. It now lives in **Publications** (§ 10c), where
the thesis sits beside the papers it belongs with, and the card keeps only its
claim. The card's `leo-card__link` anchor and CSS rule were removed with it. The
thesis links through its DOI, `10.26190/unsworks/30505`.

## 8. Core expertise cards

| Card | draft | page |
|---|---|---|
| Geospatial | "Expert in cloud-optimized formats (GeoParquet, Zarr), spatial analysis, and GIS systems for extracting meaningful insights from location-based data at scale." | "Cloud-optimised formats (GeoParquet, Zarr), spatial analysis, and GIS for insight at scale." |
| ML | "PhD-level expertise in Reinforcement Learning for Swarm systems, predictive modeling, and advanced ML algorithms for intelligent data-driven solutions." | "PhD-level work in RL for swarm systems, predictive modelling, and applied ML." |
| LLM | "Local model deployment with Ollama, prompt engineering, and full-stack development using open-source technologies for scalable, maintainable solutions." | "Running models with Ollama and OpenHands, prompt engineering, and full-stack open-source systems." |

The LLM card's `h3` is **"Local or Cloud LLMs"** — the page's draft title was
"LLM & Open Source", and an intermediate version narrowed it to "Local LLMs".
Narrowing was wrong: the author works both ways, so the heading now names the
range and the body lists the technologies (**Ollama**, **OpenHands**) as
examples.

Card headings: the draft used "Geospatial Data" / "Machine Learning" / "LLM & Open Source" as the card titles. The page keeps the first draft title as the `h3` and replaces the other two with "Reinforcement Learning" and "Local or Cloud LLMs". An intermediate version added a short uppercase eyebrow above each card ("Geospatial" / "Machine Learning" / "LLM & Open Source"); **those eyebrows were dropped** — see §8a.

## 8a. Core expertise card eyebrows — settled: dropped

The three cards each carried a short uppercase mono label above the `h3`
(`Geospatial` / `Machine Learning` / `LLM & Open Source`), styled by
`.leo-card__k`. They are gone, along with the rule.

They failed on two counts:

1. **No consistent job.** Each eyebrow had a *different* relationship to its
   heading. `Geospatial` over `Geospatial Data` was pure duplication; `Machine
   Learning` over `Reinforcement Learning` named the parent field (a real
   addition); `LLM & Open Source` over `Local or Cloud LLMs` was part-repeat,
   part-new. A slot that means something different in each of three cases has no
   rule to test against, so nothing could be called redundant or useful — the
   slot itself was the problem.
2. **It restated its own heading**, which is the rule `AGENTS.md` already sets
   for section heads ("Tools / special tools for special needs" was reverted for
   exactly this). Card 1 said it twice outright.

The deeper reason is that the device was borrowed from the wrong place. On the
barbuz face the equivalent slot is the card **tag** (`real world maps`, `music
pad`), and it earns its place because the `h3` there is a bare name — `byom`
tells you nothing on its own. On the Leo face the `h3` *is* the description, so a
kicker over it is the tag's job done over a heading that already did it.

Dropping the eyebrows is a copy decision, not a layout one: the headings and
bodies carry the content, and the draft never had the slot. The `h3`'s top
margin (`0.6rem`) existed only to clear the eyebrow and is now `0`.

## 9. Journey section

| | Text |
|---|---|
| **draft** | "From my roots in **Italy** to my current life in **Australia** — a journey that shaped my global perspective" (interactive: hovering the country names fills them on the map) |
| **page** | "From my roots in **Italy** to my **study and work** in **Australia** — a journey that shaped my global perspective" |

**Changed: "current life" → "study and work".** The author is currently
travelling rather than living in Australia, so "current life in Australia" was
no longer true. "Study and work" says what the Australia years actually are
(the Master's and the PhD), and stays true from anywhere. The interactive map is
ported (`JourneyMap.svelte`) — hovering the country names fills them.

The map's **"3000 km"** label is the map **scale bar**, not the Italy→Australia
distance. It is generated by MapLibre and is correct as-is.

## 10. Contact

| | Text |
|---|---|
| **draft** | "Interested in collaborating or have a project in mind? I'd love to hear from you!" · buttons: Email Me · GitHub · "Available for freelance and contract opportunities" |
| **page** | "Open to collaboration, freelance, and interesting problems." · buttons: Email · GitHub · "← Back to barbuz" |

## 11. Footer

| | Text |
|---|---|
| **draft** | "© 2026 Leo Ghignone. All rights reserved." |
| **page** | "© 2026 Leo Ghignone" + "barbuz ↗" |

---

## 10a. Experience — the old Featured Projects, rebuilt

The draft's **Featured Projects** (three generic cards: Cloud-Optimized GIS
Platform, Reinforcement Learning for Swarm Systems, Open-Source LLM Deployment
Framework) was the last open item. It was dropped from the page because the
cards were not real, linkable projects, and a card layout with a hover glow
promises a click the author cannot honour — the work is from previous
employment and there is nothing public to link.

**Settled: replace it with an Experience list, not cards.** The section is a
CV-style list (`cv-list` / `cv-item` / `cv-when` / `cv-body`), one entry per
role, no hover affordance and no `↗` on the entry titles, so nothing implies it
is clickable. Because there is no link to carry the credibility, the **words**
do: each entry names the domain and one concrete thing.

| Years | Role · Employer | Line |
|---|---|---|
| 2025–2026 | Senior Software Engineer · UNSW Canberra | Led a small team building tools for under-resourced organisations, and designed AI systems that make sense of unstructured input. |
| 2023–2025 | Data Engineer · IMOS | Built the ingestion pipelines that turn heterogeneous ocean datasets into cloud-optimised formats, for the Great Barrier Reef Data Management System. |
| 2017–2024 | PhD, Deep Reinforcement Learning for Swarm Systems · UNSW Canberra | Designed deep reinforcement learning algorithms for swarms of small agents, and measured the memory and time each approach costs to run. |

Source: the author's CV. **Employer names are used as-is** (author's call).
**Publidok srl (2016) is left off** — a decade old, and the CV is the place for
full history. The **ForeSight** role is deliberately *not* here; it appears in
Community (§ 10b) as the ON Prime project instead.

## 10b. Community — new section

Placed after Journey. Same CV list styling as Experience.

| Years | Item | Line |
|---|---|---|
| 2024–2025 | Organiser · FOSS4G | Part of the team behind the global conference for open-source geospatial software — FOSS4G SotM Oceania 2024 and FOSS4G 2025. |
| 2024 | ON Prime · CSIRO | Took the ForeSight wind-forecasting project through CSIRO's research-to-product program, where the team won best in cohort. |

Both FOSS4G years link out (`2024.foss4g-oceania.org`, `2025.foss4g.org`), and
ForeSight links to its CSIRO ON alumni page. These are the real, checkable
things the section stands on — the same role the links played in Publications.

## 10c. Publications — new section

Placed after Core Expertise. A `pub-list` with a year rail, each entry a title
link plus venue. **The section head carries a `Google Scholar ↗` link** (the
author's profile).

**Links: self-hosted PDFs.** The author's call was to host the papers rather
than point at publisher URLs, so the full text lives in `static/papers/` and the
title links to `/papers/…`. The reason is the same one that broke the Protomaps
tileset: **publisher URLs rot.** Pensoft's download already redirects through a
token URL, and Frontiers reshuffles its paths — a dead link here would fail
silently. A copy in `static/` cannot be taken away by a publisher reorganisation.

Every hosted paper is **CC BY 4.0**, which permits redistribution, so hosting is
legitimate as long as attribution is kept — the venue line credits the authors,
and a `.pub-note` under the list states the licence and that copyright stays with
the authors. **Do not host a paper that is not openly licensed** (see the IEEE
one below).

| Year | Title | Link | Venue |
|---|---|---|---|
| 2026 | GBR Data Management System: A One-Stop Shop to Great Barrier Reef Data | hosted `/papers/2026-gbr-data-management-system.pdf` | Biodiversity Information Science and Standards |
| 2024 | Reinforcement Learning for Swarm Systems | DOI `10.26190/unsworks/30505` *(hosting pending — see below)* | PhD thesis · UNSW Canberra |
| 2023 | Wind-speed Forecasting based on Smoothing Ensemble Empirical Mode Decomposition and LSTM | DOI `10.1109/pree57903.2023.10370420` *(no OA copy)* | International Conference on Power and Renewable Energy Engineering |
| 2022 | Characterisation of Indicators for Adaptive Human-Swarm Teaming | hosted `/papers/2022-characterisation-human-swarm-teaming.pdf` | Frontiers in Robotics and AI |

Two of the four are hosted so far. The remaining two are still DOI links:

- **The thesis** is **CC BY 4.0**, so it may be hosted, but UNSWorks refuses
  automated downloads (403 from this environment and from the proxies tried), so
  the file has to be supplied by hand. When it is, drop it in as
  `static/papers/2024-rl-swarm-systems-thesis.pdf` and swap the link.
- **The wind-speed paper has no open-access copy.** Unpaywall reports
  `is_oa: false`, and the published version is IEEE copyright, so it must **not**
  be hosted — the DOI stays. (An author-accepted manuscript may be postable under
  IEEE's author policy, but that is a separate decision, not a free copy.)

Ordered newest first. The thesis link was **removed from the Reinforcement
Learning card** (§ 7) and lives here now.

Two spelling calls: the Frontiers title uses **Characterisation** (AU spelling)
and the body text uses **cloud-optimised**, while the DOI/venue strings keep
their published spelling (US, `Characterization`) — titles are not prose.

## Draft sections with no home on the page yet

- **Featured Projects** — resolved into the Experience section above (§ 10a).
- **Skills section title** "Core Expertise" — kept.
- The draft's fixed nav with smooth-scroll buttons — reworked into the
  page's nav links.
