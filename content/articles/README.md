# Community articles

Practice notes, provenance write-ups, and authorizations live here as Markdown.

This folder is the **optional paper trail**. Console opt-in on **0?0** / archive
`data.json` remains the primary protocol path. Public notes live at
[soloist.ai/uxu](https://soloist.ai/uxu).

## Add an article

1. Copy `_TEMPLATE.md` to a new file: `YYYY-MM-DD-short-slug.md`
2. Fill the front matter and sections honestly
3. Open a pull request (see [CONTRIBUTING.md](../../CONTRIBUTING.md))

## Acceptance criteria

A PR is ready to merge when:

- Front matter is complete: `title`, `author`, `attested_at`, `kind`
- `archive_id` is filled if the note is about a registered archive (`Title.uXu.NNNN`); otherwise omit or leave empty
- Origin / authorship / custody / lineage / conditions are honest — blank is better than invented
- The body does **not** claim legal chain-of-custody, enrollment, or studio administration
- Filename matches `YYYY-MM-DD-short-slug.md`

Merging means the community accepted the note as **documentation** — not a
legal certificate, not membership enrollment.

## Kinds

| `kind` | Use for |
|--------|---------|
| `practice-note` | How someone practices iNi |
| `provenance-writeup` | Origin / lineage story for a work or archive |
| `authorization` | Who may speak for or steward a collection (self-attested) |

## Example

See [2026-08-12-ini-beside-uxu.md](2026-08-12-ini-beside-uxu.md) for a seed
charter attestation.
