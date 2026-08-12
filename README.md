# iNi

**Community repo for provenance practice beside the [uXu](https://github.com/RASvibir/uXu) archive commons.**

iNi is a name, a protocol, and a community boundary — an “I and I” practice for
**origin, authorship, lineage, and custody**. Not a company label. Not required
to use uXu.

| Surface | URL |
|---------|-----|
| **Community site** | https://rasvibir.github.io/iNi/ |
| **uXu commons** | https://rasvibir.github.io/uXu/ |
| **uXu repo** | https://github.com/RASvibir/uXu |
| **Optional Solo notes** | https://soloist.ai/uxu |

## Brand stack (do not blur)

| Layer | Role |
|-------|------|
| **uXu** | Public archive commons — site, repo, installable app |
| **0?0** | Root archive interface (console) inside the commons |
| **iNi** | Opt-in provenance ethic — community by practice |

## What’s in this repo

```text
charter/               # INI-PROVENANCE charter
content/articles/      # PR-based practice notes & authorizations
src/                   # Community site (Vite)
.github/workflows/     # GitHub Pages deploy
```

## Practice without the website

1. Open https://rasvibir.github.io/uXu/ → **0?0**
2. Quick Nav → **iNi Provenance** (or type `INI`)
3. Fill provenance fields in your archive `data.json`, set `uxu.ini.optIn: true`, tag **iNi** when that documentation is real

Self-attestation only. Registry cues signal honesty, not enforcement.

## Add an article via git

See [content/articles/README.md](content/articles/README.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

## Develop the site

```bash
npm install
npm run dev
npm run build
```

Site deploys to GitHub Pages from `main` via Actions (`base: /iNi/`).

## Contact

**rasip@chloreform.org**

## License

MIT — see [LICENSE](LICENSE). Media linked by archives keeps its own terms.
