# iNi

**Community paper trail for provenance practice beside the [uXu](https://github.com/RASvibir/uXu) archive commons.**

iNi is a name, a protocol, and a community boundary — an “I and I” practice for
**origin, authorship, lineage, and custody**. Not a company label. Not required
to use uXu.

| Surface | URL | Role |
|---------|-----|------|
| **Public notes (primary)** | https://soloist.ai/uxu | Community face — practice, FAQ, contact |
| **uXu commons** | https://rasvibir.github.io/uXu/ | Archive door → 0?0 · type `INI` |
| **uXu repo** | https://github.com/RASvibir/uXu | Software, templates, RTFM · MIT |
| **This repo** | https://github.com/RASvibir/iNi | Charter, articles, **I pages** via PR |
| **I pages** | https://rasvibir.github.io/iNi/#/i | Opt-in faces — **I am {name}** |
| **Pages mirror** | https://rasvibir.github.io/iNi/ | Optional mirror / future Web3 source |

See [COMMUNITY.md](COMMUNITY.md) for how the provenance community works.

## Brand stack (do not blur)

| Layer | Role |
|-------|------|
| **uXu** | Public archive commons — site, repo, installable app |
| **0?0** | Root archive interface (console) inside the commons |
| **iNi** | Opt-in provenance ethic — community by practice |

## How the provenance community works

1. Read public notes on **Soloist** (or this charter)  
2. Opt in on **0?0** / your archive `data.json` when provenance is real  
3. Optionally add a practice note via **PR** under `content/articles/`  
4. Optionally add an **I page** via **PR** under `content/i/` (shows as **I am Your Name**)  

No membership backend. Join = practice.

## What’s in this repo

```text
COMMUNITY.md           # How joining / norms work
charter/               # INI-PROVENANCE charter
content/articles/      # PR-based practice notes & authorizations
content/i/             # I pages (I am {name})
src/                   # Optional Pages mirror (Vite)
scripts/build-i.mjs    # Builds I page data for the site
.github/workflows/     # GitHub Pages deploy
docs/soloist-paste.md  # Designer paste pack for soloist.ai/uxu
```

## Practice without any website

1. Open https://rasvibir.github.io/uXu/ → **0?0**
2. Quick Nav → **iNi Provenance** (or type `INI`)
3. Fill provenance fields in your archive `data.json`, set `uxu.ini.optIn: true`, tag **iNi** when that documentation is real

Self-attestation only. Registry cues signal honesty, not enforcement.

## Add an article or I page via git

- Articles: [content/articles/README.md](content/articles/README.md)  
- I pages: [content/i/README.md](content/i/README.md)  
- [CONTRIBUTING.md](CONTRIBUTING.md)

## Develop the Pages mirror

```bash
npm install
npm run dev
npm run build
```

`predev` / `prebuild` run `scripts/build-i.mjs` so I pages stay in sync.
Deploys to GitHub Pages from `main` (`base: /iNi/`). Primary public door remains Soloist.

## Web3

Parked. Basename/ENS + IPFS can reuse this site later; not required to start the community.

## Contact

**rasip@chloreform.org**

## License

MIT — see [LICENSE](LICENSE). Media linked by archives keeps its own terms.
