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
| **page** | "Get in touch" · "Read the thesis ↗" |

## 4. About — paragraph 1

| | Text |
|---|---|
| **draft** | "I'm a passionate software engineer with a PhD in Machine Learning, where my research focused on efficient Reinforcement Learning for Swarm systems. My strong interdisciplinary skills enable me to develop sophisticated solutions across various domains, from complex data challenges to innovative AI applications." |
| **page** | "I'm a passionate software engineer with a PhD in Machine Learning, where my research focused on efficient Reinforcement Learning for Swarm systems. My interdisciplinary skills let me move from complex data problems to shipped applications." |

## 5. About — paragraph 2

| | Text |
|---|---|
| **draft** | "As a full-stack developer and open-source advocate, I specialize in building robust, scalable solutions using cutting-edge technologies. My expertise spans geospatial data analysis with cloud-optimized formats like GeoParquet and Zarr, advanced machine learning algorithms, and practical applications of large language models using tools like Ollama for local model deployment." |
| **page** | "As a full-stack developer and open-source advocate, I build robust, scalable solutions — geospatial analysis with cloud-optimized formats like GeoParquet and Zarr, advanced ML, and practical LLM deployment with local models." |

## 6. About — paragraph 3

| | Text |
|---|---|
| **draft** | "I'm committed to open-source software development and believe in creating solutions that are not only powerful but also accessible and maintainable. Whether it's building predictive models, analyzing spatial patterns, or implementing AI-powered systems, I bring both technical excellence and strategic thinking to every project." |
| **page** | *(removed)* |

## 7. About — thesis link

| | Text |
|---|---|
| **draft** | "Read my PhD thesis on Reinforcement Learning for Swarm systems" |
| **page** | "Read the thesis ↗" (moved to the hero buttons) |

## 8. Core expertise cards

| Card | draft | page |
|---|---|---|
| Geospatial | "Expert in cloud-optimized formats (GeoParquet, Zarr), spatial analysis, and GIS systems for extracting meaningful insights from location-based data at scale." | "Cloud-optimized formats (GeoParquet, Zarr), spatial analysis, and GIS for insight at scale." |
| ML | "PhD-level expertise in Reinforcement Learning for Swarm systems, predictive modeling, and advanced ML algorithms for intelligent data-driven solutions." | "PhD-level work in RL for swarm systems, predictive modelling, and applied ML." |
| LLM | "Local model deployment with Ollama, prompt engineering, and full-stack development using open-source technologies for scalable, maintainable solutions." | "Deployment with Ollama, prompt engineering, and full-stack open-source systems." |

Card headings: the draft used "Geospatial Data" / "Machine Learning" / "LLM & Open Source" as the card titles. The page adds a short eyebrow label above each card ("Geospatial" / "Machine Learning" / "LLM & Open Source"), keeps the first draft title as the `h3`, and replaces the other two with "Reinforcement Learning" and "Local LLMs".

## 9. Journey section

| | Text |
|---|---|
| **draft** | "From my roots in **Italy** to my current life in **Australia** — a journey that shaped my global perspective" (interactive: hovering the country names fills them on the map) |
| **page** | Same sentence as the draft. The interactive map is ported (`JourneyMap.svelte`) — hovering the country names fills them. |

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

## Draft sections with no home on the page yet

- **Featured Projects** (the three generic cards: Cloud-Optimized GIS Platform,
  Reinforcement Learning for Swarm Systems, Open-Source LLM Deployment Framework).
  Deliberately dropped from the page because they are not real, linkable
  projects. **Decision needed:** delete, replace with the four real apps, or
  reword into a "Professional work" list on the Leo face.
- **Skills section title** "Core Expertise" — kept.
- The draft's fixed nav with smooth-scroll buttons — reworked into the
  page's nav links.
