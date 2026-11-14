# Docs

Working notes for the barbuz brand. **None of this is served by the website.**

The site is built by `@sveltejs/adapter-static` into `build/`, and the GitHub
Pages workflow (`.github/workflows/deploy.yml`) uploads only `./build` as the
artifact. This `docs/` folder is never part of that artifact, so nothing here
reaches the public site. It is deliberately *not* the `docs/` that GitHub Pages
can publish from — that build source is "GitHub Actions", not "branch folder".

| File | What it is |
|---|---|
| [DESIGN-NOTES.md](./DESIGN-NOTES.md) | The palette decisions and the reasoning behind them: the two-tone accent, the temperature rule, the measured contrast table, the semantic colours, the type stack, and where the values now live. |
| [BRAND-PLAN.md](./BRAND-PLAN.md) | The plan for growing the identity from the one page that has it into the apps. Phases, order, open decisions. |
| [COPY-NOTES.md](./COPY-NOTES.md) | Draft-vs-current copy pairs on the Leo face, kept so the wording can be settled before the layout is finalised. |

The tokens themselves are in [`brand/`](../brand/) — see
[`brand/README.md`](../brand/README.md). That folder is also not served.
