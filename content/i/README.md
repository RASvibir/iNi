# I Pages

Opt-in public faces for the iNi community. Each page displays as **I am {name}**.

**I Pages** are **non-judged** profile display. Freeform Markdown — customize as
you wish (`theme`, `layout`, body sections).

Optional **I Crown** (`crown_status: active`) is a separate honor layer for
identifier truths and proprietary toolkit pointers — not KYC itself, and **no
asset to iNi provenance**. False advertising / plagiarism / false identification
can revoke Crown *display* only.

## Add an I Page

1. Copy `_TEMPLATE.md` → `{slug}.md`
2. Set at least `name`, `slug`, `attested_at`
3. Optional: `tagline`, `theme`, `layout`, `portrait`
4. Optional Crown: `crown_status: active` + `crown_blurb`
5. Optional: `wear_crown: true` to show the Crown border on your portrait
   (only when Crown status is **active**)
6. Open a pull request

## Front matter

| Field | Required | Notes |
|-------|----------|--------|
| `name` | yes | Shown as **I am {name}** |
| `slug` | yes | Filename should match |
| `attested_at` | yes | YYYY-MM-DD |
| `tagline` | no | Short line under the name |
| `theme` | no | `ink` (default) · `paper` · `terminal` |
| `layout` | no | `free` (default) · `compact` · `wide` |
| `portrait` | no | `https://…` or `/i/avatars/your.jpg` |
| `crown_status` | no | `none` · `active` · `suspended` |
| `crown_blurb` | no | One-line honor summary when Crown is shown |
| `wear_crown` | no | `true` to wear Crown border on portrait (needs `crown_status: active`) |

## Portrait + Crown border

- Add a `portrait` URL (or drop a file under `public/i/avatars/` and link `/i/avatars/…`)
- Set `crown_status: active` when honor status is valid
- Set `wear_crown: true` to opt into the I Crown border around the image
- Suspended Crown never shows the border — correct the datasheet first

## Browse

https://rasvibir.github.io/iNi/#/i

## Forum

https://github.com/RASvibir/iNi/discussions

## Example

[victor-birkle.md](victor-birkle.md) → **I am Victor Birkle**
