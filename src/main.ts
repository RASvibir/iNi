import "./style.css";
import iData from "./i-data.json";
import { renderMarkdown } from "./markdown";

const SOLOIST = "https://soloist.ai/uxu";
const UXU_COMMONS = "https://rasvibir.github.io/uXu/";
const UXU_CREATE = "https://rasvibir.github.io/uXu/#CREATE";
const INI_REPO = "https://github.com/RASvibir/iNi";
const FORUM = "https://github.com/RASvibir/iNi/discussions";
const CONTACT = "rasip@chloreform.org";
const BASE = import.meta.env.BASE_URL || "/";

type IPage = {
  name: string;
  slug: string;
  attested_at: string;
  tagline?: string;
  theme?: string;
  layout?: string;
  portrait?: string;
  contact_email?: string;
  crown_status?: string;
  crown_blurb?: string;
  wear_crown?: boolean;
  body: string;
  file: string;
};

const pages = iData.pages as IPage[];

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

function escapeText(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
  return escapeText(s).replace(/'/g, "&#39;");
}

/** Resolve site-root portrait paths against Vite base (/iNi/). */
function resolvePortraitSrc(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/")) {
    return `${BASE.replace(/\/$/, "")}${src}`;
  }
  return `${BASE}${src.replace(/^\//, "")}`;
}

/** True when Crown is active and the page opted to wear the border. */
function wearsCrown(page: IPage): boolean {
  return page.crown_status === "active" && Boolean(page.wear_crown);
}

function portraitHtml(
  page: IPage,
  size: "hero" | "index" = "hero",
): string {
  if (!page.portrait) return "";
  const crowned = wearsCrown(page);
  const classes = [
    "i-portrait",
    `i-portrait--${size}`,
    crowned ? "i-portrait--crowned" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const label = crowned
    ? `${page.name} — I Crown border`
    : page.name;
  const src = resolvePortraitSrc(page.portrait);
  const crownSeal = crowned
    ? `<span class="i-portrait__seal" aria-hidden="true">${crownIcon(size === "hero" ? "md" : "sm")}</span>`
    : "";
  const caption =
    crowned && size === "hero"
      ? `<figcaption class="i-portrait__caption">Wearing I Crown</figcaption>`
      : "";
  return `
    <figure class="${classes}" title="${escapeAttr(label)}">
      <div class="i-portrait__halo">
        <div class="i-portrait__ring" aria-hidden="true"></div>
        <div class="i-portrait__frame">
          <img
            src="${escapeAttr(src)}"
            alt=""
            width="160"
            height="160"
            loading="lazy"
            decoding="async"
          />
        </div>
        ${crownSeal}
      </div>
      ${caption}
    </figure>`;
}

/**
 * I Crown mark — diamond peaks + central i + two data/USB tracks per side.
 * Tracks flare outward and terminate as hooks into the portrait border.
 */
function crownIcon(size: "sm" | "md" | "lg" = "sm"): string {
  const cls = `crown-icon crown-icon--${size}`;
  return `<svg class="${cls}" viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
    <g stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M32 4 L37.2 18.5 L32 22.5 L26.8 18.5 Z"/>
      <path d="M20.5 10.5 L27.2 21.2 L22.5 25.2 L16.2 17.8 Z"/>
      <path d="M43.5 10.5 L47.8 17.8 L41.5 25.2 L36.8 21.2 Z"/>
      <path d="M11 20.5 L19.5 26.5 L16.5 30.5 L9.2 25.8 Z"/>
      <path d="M53 20.5 L54.8 25.8 L47.5 30.5 L44.5 26.5 Z"/>
      <path d="M32 30.6 V46.5"/>
      <path d="M28.2 34 V39 L22.5 46.5 L20.5 52"/>
      <path d="M25.2 35.5 V38.5 L16.5 47 L12.5 53.5"/>
      <path d="M35.8 34 V39 L41.5 46.5 L43.5 52"/>
      <path d="M38.8 35.5 V38.5 L47.5 47 L51.5 53.5"/>
    </g>
    <circle cx="32" cy="25.8" r="2.4" fill="currentColor"/>
    <rect x="30" y="46" width="4" height="4" rx="0.4" fill="currentColor"/>
    <path d="M20.5 52 L18.4 57 L20.5 55.4 L22.6 57 Z" fill="currentColor"/>
    <path d="M12.5 53.5 L10 58.5 L12.5 56.8 L15 58.5 Z" fill="currentColor"/>
    <path d="M43.5 52 L41.4 57 L43.5 55.4 L45.6 57 Z" fill="currentColor"/>
    <path d="M51.5 53.5 L49 58.5 L51.5 56.8 L54 58.5 Z" fill="currentColor"/>
  </svg>`;
}

function crownMark(status: string | undefined): string {
  if (status === "active") {
    return `<span class="crown-mark crown-mark--active" title="I Crown active — honor system" aria-label="I Crown active">${crownIcon("md")}</span>`;
  }
  if (status === "suspended") {
    return `<span class="crown-mark crown-mark--suspended" title="I Crown display suspended" aria-label="I Crown suspended">${crownIcon("md")}</span>`;
  }
  return "";
}

/** Text readout with icon — used on stack / I Page panels, not the compact mark. */
function crownReadout(status: string | undefined, size: "md" | "lg" = "lg"): string {
  if (status === "active") {
    return `<span class="crown-readout crown-readout--active">${crownIcon(size)}<span>I Crown</span></span>`;
  }
  if (status === "suspended") {
    return `<span class="crown-readout crown-readout--suspended">${crownIcon(size)}<span>I Crown suspended</span></span>`;
  }
  return "";
}

function iIndexRow(p: IPage): string {
  return `
            <li>
              <a href="#/i/${p.slug}">
                ${portraitHtml(p, "index")}
                <span class="i-index__text">
                  <span class="i-am">I am</span> ${escapeText(p.name)}
                  ${crownMark(p.crown_status)}
                  ${p.tagline ? `<span class="i-meta">${escapeText(p.tagline)}</span>` : `<span class="i-meta">attested ${escapeText(p.attested_at)}</span>`}
                </span>
              </a>
            </li>`;
}

function iniStampHtml(linkHref?: string): string {
  const inner = `<span class="ini-i">i</span><span class="ini-n">N</span><span class="ini-i">i</span>`;
  if (linkHref) {
    return `<a class="ini-stamp ini-stamp--header is-link" href="${linkHref}" title="iNi — provenance practice" aria-label="iNi home">${inner}</a>`;
  }
  return `<span class="ini-stamp ini-stamp--header" title="iNi provenance" aria-label="iNi">${inner}</span>`;
}

function brandLockupHtml(): string {
  return `
    <div class="brand-lockup">
      <a class="uxu-logo" href="${UXU_COMMONS}" title="uXu archive commons" aria-label="uXu commons">uXu</a>
      ${iniStampHtml("#/")}
    </div>`;
}

function headerHtml(active: "home" | "i" = "home"): string {
  return `
  <header class="site-header">
    <div class="site-header__inner">
      ${brandLockupHtml()}
      <nav class="nav" aria-label="Main">
        ${
          active === "home"
            ? `
        <a href="#/i">I Pages</a>
        <a href="#/i/new">My profile</a>
        <a href="#forum">Forum</a>
        <a href="#contact">Contact</a>`
            : `
        <a href="#/">Home</a>
        <a href="#/i" ${active === "i" ? 'aria-current="page"' : ""}>I Pages</a>
        <a href="#/i/new">My profile</a>
        <a href="${FORUM}" target="_blank" rel="noopener">Forum</a>
        <a href="mailto:${CONTACT}">Contact</a>`
        }
      </nav>
    </div>
  </header>`;
}

function footerHtml(): string {
  return `
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="brand-lockup brand-lockup--footer">
        <a class="uxu-logo uxu-logo--sm" href="${UXU_COMMONS}" aria-label="uXu commons">uXu</a>
        ${iniStampHtml("#/")}
      </div>
      <p>
        <a href="#/i">I Pages</a>
        · <a href="#/i/new">My profile</a>
        · <a href="${FORUM}" target="_blank" rel="noopener">Forum</a>
        · <a href="mailto:${CONTACT}">Email</a>
      </p>
    </div>
  </footer>`;
}

function homeHtml(): string {
  return `
  ${headerHtml("home")}
  <main id="top" class="home-view">
    <section class="hero" aria-labelledby="hero-brand">
      <div class="hero__atmosphere" aria-hidden="true"></div>
      <div class="hero__inner">
        <p class="hero__status reveal" aria-hidden="true">uXu :: 0?0 &gt; INI · provenance practice</p>
        <p id="hero-brand" class="hero__brand reveal">iNi</p>
        <h1 class="hero__headline reveal">Practice provenance together</h1>
        <p class="hero__support reveal">
          A name, a protocol, and a community boundary — defined by how you
          document origin, authorship, lineage, and custody. Not a company
          label. Not required to use uXu.
        </p>
        <div class="cta-row reveal">
          <a class="btn btn--primary" href="#/i/new">Create my page</a>
          <a class="btn btn--ghost" href="#/i">Browse I Pages</a>
          <a class="btn btn--ghost" href="${UXU_CREATE}">Create archive</a>
        </div>
      </div>
    </section>

    <section class="section" id="stack" aria-labelledby="stack-title">
      <div class="section__inner reveal">
        <p class="section__eyebrow">Three layers</p>
        <h2 class="section__title" id="stack-title">iNi · I Page · I Crown</h2>
        <p class="section__lede">
          Clear jobs. No membership theater. Crown is optional honor — not KYC,
          and it does not own your iNi provenance.
        </p>
        <ol class="stack-ladder">
          <li>
            <p class="stack-ladder__name">iNi</p>
            <p class="stack-ladder__role">Provenance practice</p>
            <p>Opt-in honesty about origin, authorship, lineage, and custody on archives. Simple stamp — self-attested.</p>
          </li>
          <li>
            <p class="stack-ladder__name">I Page</p>
            <p class="stack-ladder__role">Non-judged face</p>
            <p>Public <strong>I am {name}</strong> — freeform, customisable themes and layout. Personality without an audit chill.</p>
          </li>
          <li>
            <p class="stack-ladder__name">${crownReadout("active", "md")}</p>
            <p class="stack-ladder__role">Honor-bound truths</p>
            <p>Optional identifier datasheet + pointers to proprietary rails (SSO / KYC / memberships <em>you</em> run). False advertising, plagiarism, or false ID revokes <strong>Crown display</strong> only.</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="section" id="practice" aria-labelledby="practice-title">
      <div class="section__inner reveal">
        <p class="section__eyebrow">Self-attestation</p>
        <h2 class="section__title" id="practice-title">How to practice iNi</h2>
        <p class="section__lede">
          You do not need Soloist, an I Page, or I Crown to opt in. Prefer 0?0.
        </p>
        <ol class="practice-steps">
          <li>
            <div>
              <strong>Open 0?0</strong>
              <p>Start at the uXu commons, then Quick Nav → iNi Provenance (or type <code>INI</code>). To start a shelf: <a href="${UXU_CREATE}">Create archive</a> (or type <code>CREATE ARCHIVE</code>).</p>
            </div>
          </li>
          <li>
            <div>
              <strong>Document provenance</strong>
              <p>In your archive <code>data.json</code>, fill origin, authors, custody, lineage, conditions, and attestedAt.</p>
            </div>
          </li>
          <li>
            <div>
              <strong>Opt in when it’s real</strong>
              <p>Mark your archive as opted in on uXu. Want a public face too? Use <a href="#/i/new">My profile</a> — email us, no Git required.</p>
            </div>
          </li>
        </ol>
        <p class="cta-row" style="margin-top:1.25rem">
          <a class="btn btn--primary" href="${UXU_CREATE}">Create archive on uXu</a>
          <a class="btn btn--ghost" href="${UXU_COMMONS}">Open uXu</a>
        </p>
        <details class="i-new__more" style="border-top:none;padding-top:0">
          <summary>Technical fields (optional)</summary>
          <pre class="snippet" tabindex="0"><code>"uxu": {
  "ini": {
    "optIn": true,
    "tag": "iNi",
    "showBadge": true,
    "badgeLinksToIPage": false,
    "provenance": { "origin": "…", "authors": ["…"], "custody": "…", "lineage": "…", "conditions": "…", "attestedAt": "2026-08-12" }
  }
}</code></pre>
        </details>
      </div>
    </section>

    <section class="section section--tight" id="i-preview" aria-labelledby="i-preview-title">
      <div class="section__inner reveal">
        <p class="section__eyebrow">I Pages</p>
        <h2 class="section__title" id="i-preview-title">I am …</h2>
        <p class="section__lede">
          Customisable faces — themes, layout, freeform body. Non-judged.
          Optional I Crown mark when honor status is active.
        </p>
        <ul class="i-index">
          ${pages.map(iIndexRow).join("")}
        </ul>
        <p style="margin-top:1.25rem;margin-bottom:0" class="cta-row">
          <a class="btn btn--primary" href="#/i/new">Create my page</a>
          <a class="btn btn--ghost" href="#/i">Browse I Pages</a>
        </p>
      </div>
    </section>

    <section class="section" id="forum" aria-labelledby="forum-title">
      <div class="section__inner reveal forum-panel">
        <p class="section__eyebrow">Forum</p>
        <h2 class="section__title" id="forum-title">Talk in the open</h2>
        <p class="section__lede">
          Ask questions, introduce yourself, talk Crown — open community chat.
          No membership app.
        </p>
        <div class="cta-row">
          <a class="btn btn--primary" href="${FORUM}" target="_blank" rel="noopener">Open forum</a>
          <a class="btn btn--ghost" href="mailto:${CONTACT}">Email steward</a>
        </div>
      </div>
    </section>

    <section class="section section--tight" id="links" aria-labelledby="links-title">
      <div class="section__inner reveal">
        <p class="section__eyebrow">Doors</p>
        <h2 class="section__title" id="links-title">Links</h2>
        <div class="links-grid">
          <a href="${SOLOIST}"><strong>Soloist notes</strong><span>Public notes</span></a>
          <a href="${UXU_COMMONS}"><strong>uXu commons</strong><span>Archives</span></a>
          <a href="${UXU_CREATE}"><strong>Create archive</strong><span>Start a shelf on uXu</span></a>
          <a href="${FORUM}" target="_blank" rel="noopener"><strong>Forum</strong><span>Community chat</span></a>
          <a href="#/i/new"><strong>My profile</strong><span>I Page + Crown</span></a>
          <a href="#/i"><strong>I Pages</strong><span>Browse faces</span></a>
        </div>
      </div>
    </section>

    <section class="section qtp" id="qtp" aria-labelledby="qtp-title">
      <div class="section__inner reveal">
        <p class="qtp__mark">/qtp_[devo]</p>
        <h2 class="section__title" id="qtp-title">Open-source steward</h2>
        <p class="section__lede">
          /qtp_[devo] is stewardship and build signal beside this practice — not
          administration of iNi. iNi remains community by honesty.
        </p>
      </div>
    </section>

    <section class="section" id="faq" aria-labelledby="faq-title">
      <div class="section__inner reveal">
        <p class="section__eyebrow">Clarify</p>
        <h2 class="section__title" id="faq-title">Frequently asked</h2>
        <div class="faq">
          <details>
            <summary>What is the iNi → I Page → I Crown stack?</summary>
            <p><strong>iNi</strong> is provenance practice. <strong>I Page</strong> is a non-judged public face. <strong>I Crown</strong> is optional honor-bound identifier truths (and pointers to proprietary rails). Crown has no asset to iNi; false claims revoke Crown display only.</p>
          </details>
          <details>
            <summary>What is I Crown?</summary>
            <p>An honor system we demand be honored. Showcase proprietary / SSO / KYC <em>pointers</em> — Crown does not issue those IDs. False advertising, plagiarism, or false identification can revoke Crown display. No known issues → Crown stays valid.</p>
          </details>
          <details>
            <summary>Where is the forum?</summary>
            <p><a href="${FORUM}" target="_blank" rel="noopener">Open the community forum</a> — free to join, not a membership app. Or <a href="mailto:${CONTACT}">email the steward</a>.</p>
          </details>
          <details>
            <summary>How do I get an I Page?</summary>
            <p>Use <a href="#/i/new">My profile</a> (Miss Pamic's Template). Fill your name and email, tap <strong>Send my page</strong>, then send the message (mail app, Gmail, or copy-paste). We apply it and reply when it’s live — no GitHub required.</p>
          </details>
          <details>
            <summary>How do I practice iNi without a website?</summary>
            <p>Open <a href="${UXU_COMMONS}">uXu</a> → 0?0 → Quick Nav → iNi Provenance (or type <code>INI</code>). Fill provenance and opt in when it’s real.</p>
          </details>
        </div>
      </div>
    </section>

    <section class="section section--tight" id="contact" aria-labelledby="contact-title">
      <div class="section__inner reveal contact-block">
        <p class="section__eyebrow">Reach</p>
        <h2 class="section__title" id="contact-title">Contact</h2>
        <p>Questions: <a href="mailto:${CONTACT}">${CONTACT}</a></p>
        <p>Forum: <a href="${FORUM}" target="_blank" rel="noopener">Community chat</a></p>
        <p>Profile: <a href="#/i/new">Create or update my page</a></p>
      </div>
    </section>
  </main>
  ${footerHtml()}`;
}

function iIndexHtml(): string {
  const count = pages.length;
  const facesLabel =
    count === 0
      ? "No faces yet — be the first."
      : count === 1
        ? "1 community face"
        : `${count} community faces`;

  return `
  ${headerHtml("i")}
  <main class="i-view i-land">
    <header class="i-land__hero">
      <div class="i-land__hero-inner">
        <p class="i-page__kicker">Community</p>
        <h1 class="i-title"><span class="i-am">I</span> Pages</h1>
        <p class="i-land__tagline">
          Show up as <strong>I am {name}</strong> — freeform, non-judged.
          Create or update your page with an email. No Git required.
        </p>
        <div class="i-page__chips">
          <span class="chip">${escapeText(facesLabel)}</span>
        </div>
        <div class="cta-row i-land__cta">
          <a class="btn btn--primary" href="#/i/new">Create / update my page</a>
          <a class="btn btn--ghost" href="#faces">Browse faces</a>
        </div>
      </div>
    </header>

    <section class="section section--tight" aria-labelledby="i-land-forum-title">
      <div class="section__inner">
        <aside class="i-land__forum" aria-labelledby="i-land-forum-title">
          <p class="i-land__forum-eyebrow">Need help?</p>
          <h2 class="i-land__forum-title" id="i-land-forum-title">Talk or email</h2>
          <p>
            Questions about your page or Crown? Ask in the forum or email the
            steward — we’ll help without the Git maze.
          </p>
          <p class="i-land__forum-actions">
            <a class="btn btn--primary" href="${FORUM}" target="_blank" rel="noopener">Open forum</a>
            <a class="btn btn--ghost" href="mailto:${CONTACT}">Email steward</a>
          </p>
        </aside>
      </div>
    </section>

    <section class="section" id="faces" aria-labelledby="faces-title">
      <div class="section__inner">
        <p class="section__eyebrow">Directory</p>
        <h2 class="section__title" id="faces-title">I am …</h2>
        <p class="section__lede">
          Community faces. Tap one to read — or make yours.
        </p>
        <ul class="i-index">
          ${
            pages.length
              ? pages.map(iIndexRow).join("")
              : `<li class="i-index__empty">No I Pages yet. <a href="#/i/new">Create the first one</a>.</li>`
          }
        </ul>
        <p class="i-land__foot">
          <a href="#/i/new">Create / update my page</a>
          · <a href="mailto:${CONTACT}">Email</a>
          · <a href="#/">Home</a>
        </p>
      </div>
    </section>
  </main>
  ${footerHtml()}`;
}

function iDetailHtml(page: IPage): string {
  const theme = page.theme || "ink";
  const layout = page.layout || "free";
  const crown = page.crown_status || "none";
  let crownPanel = "";
  if (crown === "active") {
    crownPanel = `
      <aside class="crown-panel crown-panel--active" aria-label="I Crown">
        <p class="crown-panel__mark">${crownReadout("active", "lg")}</p>
        <p class="crown-panel__blurb">${escapeText(page.crown_blurb || "Honor-bound identifier claims — false advertising revokes display.")}</p>
        <p class="crown-panel__note">Honor system. Not KYC. No asset to iNi provenance.${page.wear_crown ? " Portrait wears the Crown border by opt-in." : ""}</p>
      </aside>`;
  } else if (crown === "suspended") {
    crownPanel = `
      <aside class="crown-panel crown-panel--suspended" aria-label="I Crown suspended">
        <p class="crown-panel__mark">${crownReadout("suspended", "lg")}</p>
        <p class="crown-panel__blurb">Crown display is suspended pending correction of identifier claims. I Page and iNi are unaffected.</p>
      </aside>`;
  }

  return `
  ${headerHtml("i")}
  <main class="i-view">
    <article class="i-page theme-${escapeText(theme)} layout-${escapeText(layout)}">
      <header class="i-page__hero">
        <div class="i-page__hero-inner${page.portrait ? " i-page__hero-inner--portrait" : ""}">
          ${portraitHtml(page, "hero")}
          <div class="i-page__intro">
            <p class="i-back"><a href="#/i">← I Pages</a></p>
            <p class="i-page__kicker">I Page</p>
            <h1 class="i-title"><span class="i-am">I am</span> ${escapeText(page.name)}</h1>
            ${page.tagline ? `<p class="i-page__tagline">${escapeText(page.tagline)}</p>` : ""}
            <p class="i-meta">attested ${escapeText(page.attested_at)} · theme ${escapeText(theme)} · layout ${escapeText(layout)}</p>
            <div class="i-page__chips">
              <span class="chip">iNi practice welcome</span>
              ${crownReadout(crown, "md")}
            </div>
          </div>
        </div>
      </header>
      <div class="i-page__body section__inner">
        ${crownPanel}
        <div class="i-body prose">
          ${renderMarkdown(page.body)}
        </div>
      </div>
    </article>
  </main>
  ${footerHtml()}`;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function yamlQuote(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function buildIPageMarkdown(data: {
  name: string;
  slug: string;
  attested_at: string;
  tagline: string;
  theme: string;
  layout: string;
  portrait: string;
  contact_email: string;
  crown_status: string;
  crown_blurb: string;
  wear_crown: boolean;
  about: string;
  links: string;
}): string {
  const about = data.about.trim() || "Say who you are in a sentence or two.";
  const linkLines = data.links
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      if (/^https?:\/\//i.test(l)) return `- [${l}](${l})`;
      if (l.startsWith("- ")) return l;
      return `- ${l}`;
    });
  const linksBlock =
    linkLines.length > 0 ? linkLines.join("\n") : "- Add a link here";
  const crown = ["none", "active", "suspended"].includes(data.crown_status)
    ? data.crown_status
    : "none";
  const wear =
    crown === "active" && data.wear_crown ? "true" : "false";

  return `---
name: ${yamlQuote(data.name)}
slug: ${yamlQuote(data.slug)}
attested_at: ${data.attested_at}
tagline: ${yamlQuote(data.tagline)}
theme: ${data.theme}
layout: ${data.layout}
portrait: ${yamlQuote(data.portrait)}
contact_email: ${yamlQuote(data.contact_email)}
crown_status: ${crown}
crown_blurb: ${yamlQuote(data.crown_blurb)}
wear_crown: ${wear}
---

## About

${about}

## Links

${linksBlock}

## Archives

## Work

## I Crown

${
  crown === "active"
    ? data.crown_blurb.trim() ||
      "Honor-bound identifier claims — false advertising revokes display."
    : "Optional. Skip unless you want the honor layer."
}

*Self-attested I Page — not enrollment.*
`;
}

function extractSection(body: string, heading: string): string {
  const re = new RegExp(
    `##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`,
    "i",
  );
  const m = body.match(re);
  return m ? m[1].trim() : "";
}

function linksToPlain(section: string): string {
  return section
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const md = l.match(/^[-*]\s+\[([^\]]+)\]\((https?:\/\/[^)]+)\)/i);
      if (md) return md[2];
      return l.replace(/^[-*]\s+/, "");
    })
    .join("\n");
}

const PAMIC_STORE = "ini-miss-pamic-profile";

type PamicDraft = {
  email: string;
  slug: string;
  name: string;
};

function loadPamicDraft(): PamicDraft | null {
  try {
    const raw = localStorage.getItem(PAMIC_STORE);
    if (!raw) return null;
    return JSON.parse(raw) as PamicDraft;
  } catch {
    return null;
  }
}

function savePamicDraft(data: { email: string; slug: string; name: string }): void {
  localStorage.setItem(
    PAMIC_STORE,
    JSON.stringify({
      email: data.email,
      slug: data.slug,
      name: data.name,
    }),
  );
}

type MailParts = {
  subject: string;
  body: string;
  mailtoHref: string;
  gmailHref: string;
  outlookHref: string;
  usedShortMail: boolean;
};

function buildMailParts(data: {
  mode: "create" | "update";
  name: string;
  slug: string;
  email: string;
  markdown: string;
  crown_status: string;
  wear_crown: boolean;
}): MailParts {
  const kind = data.mode === "create" ? "new I Page" : "I Page / Crown update";
  const subject = `[iNi] ${kind}: ${data.name} (${data.slug})`;
  const body = [
    `Miss Pamic's Template — ${kind}`,
    ``,
    `From: ${data.name}`,
    `Email (for replies): ${data.email}`,
    `Slug: ${data.slug}`,
    `Mode: ${data.mode}`,
    `Crown: ${data.crown_status}${data.wear_crown ? " · wear border" : ""}`,
    ``,
    `Please apply this profile and reply to my email when it's live.`,
    ``,
    `----- markdown file: content/i/${data.slug}.md -----`,
    data.markdown,
  ].join("\n");
  const shortBody = [
    `From: ${data.name} <${data.email}>`,
    `Slug: ${data.slug}`,
    `Mode: ${data.mode}`,
    `Crown: ${data.crown_status}${data.wear_crown ? " · wear border" : ""}`,
    ``,
    `The full profile is on my clipboard (and in the page I just filled).`,
    `Paste it here, or attach content/i/${data.slug}.md, then reply when live.`,
  ].join("\n");

  const hrefsFor = (mailBody: string) => ({
    mailto: `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(CONTACT)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(CONTACT)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`,
  });

  let hrefs = hrefsFor(body);
  let usedShortMail = false;
  if (hrefs.mailto.length > 1800 || hrefs.gmail.length > 2000) {
    usedShortMail = true;
    hrefs = hrefsFor(shortBody);
  }

  return {
    subject,
    body,
    mailtoHref: hrefs.mailto,
    gmailHref: hrefs.gmail,
    outlookHref: hrefs.outlook,
    usedShortMail,
  };
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function githubNewFileUrl(slug: string, markdown: string): string | null {
  const filename = `content/i/${slug}.md`;
  const url = `${INI_REPO}/new/main?filename=${encodeURIComponent(filename)}&value=${encodeURIComponent(markdown)}`;
  if (url.length > 7200) return null;
  return url;
}

function iNewHtml(): string {
  const today = todayISO();
  const draft = typeof localStorage !== "undefined" ? loadPamicDraft() : null;
  const pageOptions = pages
    .map(
      (p) =>
        `<option value="${escapeAttr(p.slug)}">${escapeText(p.name)}</option>`,
    )
    .join("");

  return `
  ${headerHtml("i")}
  <main class="i-view i-new">
    <header class="i-new__hero">
      <div class="i-new__hero-inner">
        <p class="i-back"><a href="#/i">← I Pages</a></p>
        <p class="i-page__kicker">Miss Pamic's Template</p>
        <h1 class="i-title">My <span class="i-am">I</span> page</h1>
        <p class="i-land__tagline">
          Tell us who you are. We’ll give you a message to send — mail app,
          Gmail in the browser, or copy-paste. We publish it and reply when
          it’s live.
        </p>
        <p class="i-new__preview" id="i-new-preview" aria-live="polite">
          <span class="i-am">I am</span> <strong id="i-new-preview-name">…</strong>
        </p>
        <ol class="i-new__steps" aria-label="How it works">
          <li>Fill your profile</li>
          <li>Copy or open the message</li>
          <li>Send it — we reply when it’s live</li>
        </ol>
      </div>
    </header>

    <section class="section section--tight">
      <div class="section__inner">
        <form class="i-new__form" id="i-new-form" novalidate>
          <div class="i-new__modes" role="tablist" aria-label="Profile mode">
            <button type="button" class="i-new__mode is-active" data-mode="create" role="tab" aria-selected="true">I’m new</button>
            <button type="button" class="i-new__mode" data-mode="update" role="tab" aria-selected="false">Update mine</button>
          </div>

          <div class="i-new__load" id="i-new-load" hidden>
            <label class="i-new__field">
              <span class="i-new__label">Which page is yours?</span>
              <select class="i-new__input" name="load_slug" id="i-new-load-slug">
                <option value="">Choose…</option>
                ${pageOptions}
              </select>
            </label>
          </div>

          <div class="i-new__grid">
            <label class="i-new__field">
              <span class="i-new__label">Your name <em>*</em></span>
              <input class="i-new__input" name="name" type="text" required autocomplete="name" placeholder="Maya Chen" value="${escapeAttr(draft?.name || "")}" />
            </label>
            <label class="i-new__field">
              <span class="i-new__label">Your email <em>*</em></span>
              <input class="i-new__input" name="contact_email" type="email" required autocomplete="email" placeholder="you@example.com" value="${escapeAttr(draft?.email || "")}" />
              <span class="i-new__hint">Private — we reply here when your page is live. Never shown publicly.</span>
            </label>
            <label class="i-new__field i-new__field--wide">
              <span class="i-new__label">Tagline</span>
              <input class="i-new__input" name="tagline" type="text" placeholder="One short line under your name" maxlength="120" />
            </label>
            <label class="i-new__field i-new__field--wide">
              <span class="i-new__label">About you</span>
              <textarea class="i-new__input i-new__textarea" name="about" rows="4" placeholder="Who you are…"></textarea>
            </label>
            <label class="i-new__field i-new__field--wide">
              <span class="i-new__label">Links</span>
              <textarea class="i-new__input i-new__textarea" name="links" rows="3" placeholder="One URL per line"></textarea>
            </label>
            <label class="i-new__field i-new__field--wide">
              <span class="i-new__label">Photo link</span>
              <input class="i-new__input" name="portrait" type="url" placeholder="https://… (optional)" />
            </label>
          </div>

          <fieldset class="i-new__crown">
            <legend class="i-new__crown-legend">I Crown (optional)</legend>
            <label class="i-new__check-row">
              <input type="checkbox" name="want_crown" value="1" />
              <span>I want an I Crown on my page</span>
            </label>
            <label class="i-new__check-row" id="i-new-wear-wrap" hidden>
              <input type="checkbox" name="wear_crown" value="1" />
              <span>Show the Crown border on my photo</span>
            </label>
            <label class="i-new__field i-new__field--wide" id="i-new-blurb-wrap" hidden>
              <span class="i-new__label">Crown line</span>
              <input class="i-new__input" name="crown_blurb" type="text" placeholder="Short honor line" maxlength="200" />
            </label>
          </fieldset>

          <details class="i-new__more" id="i-new-more">
            <summary>More options</summary>
            <div class="i-new__grid" style="margin-top:0.85rem">
              <label class="i-new__field">
                <span class="i-new__label">Page address</span>
                <input class="i-new__input" name="slug" type="text" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="maya-chen" value="${escapeAttr(draft?.slug || "")}" />
                <span class="i-new__hint">Auto-fills from your name</span>
              </label>
              <label class="i-new__field">
                <span class="i-new__label">Date</span>
                <input class="i-new__input" name="attested_at" type="date" required value="${escapeAttr(today)}" />
              </label>
              <label class="i-new__field">
                <span class="i-new__label">Look</span>
                <select class="i-new__input" name="theme">
                  <option value="ink" selected>ink</option>
                  <option value="paper">paper</option>
                  <option value="terminal">terminal</option>
                </select>
              </label>
              <label class="i-new__field">
                <span class="i-new__label">Width</span>
                <select class="i-new__input" name="layout">
                  <option value="free" selected>free</option>
                  <option value="compact">compact</option>
                  <option value="wide">wide</option>
                </select>
              </label>
            </div>
          </details>

          <p class="i-new__status" id="i-new-status" role="status" hidden></p>

          <div class="cta-row i-new__actions">
            <button class="btn btn--primary" type="submit" name="email">Send my page</button>
          </div>

          <aside class="i-new__send" id="i-new-send" hidden>
            <h2 class="i-new__send-title">Send this to finish</h2>
            <p class="i-new__send-lede" id="i-new-send-lede">
              Your page isn’t live until this message reaches us. If a mail app
              didn’t open, copy the message or use Gmail in the browser.
            </p>
            <p class="i-new__send-meta">
              To <a href="mailto:${CONTACT}">${CONTACT}</a>
              · <span id="i-new-send-subject"></span>
            </p>
            <label class="i-new__field i-new__field--wide">
              <span class="i-new__label">Message</span>
              <textarea class="i-new__input i-new__textarea" id="i-new-send-body" rows="12" readonly></textarea>
            </label>
            <div class="cta-row i-new__send-actions">
              <button type="button" class="btn btn--primary" id="i-new-copy-msg">Copy message</button>
              <a class="btn btn--ghost" id="i-new-mailto" target="_blank" rel="noopener">Mail app</a>
              <a class="btn btn--ghost" id="i-new-gmail" target="_blank" rel="noopener">Gmail</a>
              <a class="btn btn--ghost" id="i-new-outlook" target="_blank" rel="noopener">Outlook</a>
              <button type="button" class="btn btn--ghost" id="i-new-share" hidden>Share</button>
              <button type="button" class="btn btn--ghost" id="i-new-dl">Download .md</button>
            </div>
          </aside>

          <details class="i-new__more">
            <summary>Advanced (builders)</summary>
            <div class="cta-row" style="margin-top:0.85rem">
              <button class="btn btn--ghost" type="button" name="github">Open on GitHub</button>
              <button class="btn btn--ghost" type="button" name="download">Download .md</button>
              <button class="btn btn--ghost" type="button" name="copy">Copy markdown</button>
            </div>
          </details>

          <p class="i-new__note">
            We save your name and email on this device for next time.
            No mail app? Copy the message or open Gmail after you tap send.
            Questions? <a href="mailto:${CONTACT}">${CONTACT}</a>
          </p>
        </form>
      </div>
    </section>
  </main>
  ${footerHtml()}`;
}

function bindINewForm(): void {
  const form = document.getElementById("i-new-form") as HTMLFormElement | null;
  if (!form) return;

  const nameInput = form.elements.namedItem("name") as HTMLInputElement;
  const slugInput = form.elements.namedItem("slug") as HTMLInputElement;
  const emailInput = form.elements.namedItem("contact_email") as HTMLInputElement;
  const previewName = document.getElementById("i-new-preview-name");
  const statusEl = document.getElementById("i-new-status");
  const loadWrap = document.getElementById("i-new-load");
  const loadSelect = document.getElementById("i-new-load-slug") as HTMLSelectElement | null;
  const modeBtns = form.querySelectorAll<HTMLButtonElement>(".i-new__mode");
  let mode: "create" | "update" = "create";
  let slugTouched = Boolean(slugInput.value.trim());

  const sendPanel = document.getElementById("i-new-send");
  const sendBody = document.getElementById("i-new-send-body") as HTMLTextAreaElement | null;
  const sendSubject = document.getElementById("i-new-send-subject");
  const sendLede = document.getElementById("i-new-send-lede");
  const moreOpts = document.getElementById("i-new-more") as HTMLDetailsElement | null;
  const mailtoLink = document.getElementById("i-new-mailto") as HTMLAnchorElement | null;
  const gmailLink = document.getElementById("i-new-gmail") as HTMLAnchorElement | null;
  const outlookLink = document.getElementById("i-new-outlook") as HTMLAnchorElement | null;
  const shareBtn = document.getElementById("i-new-share") as HTMLButtonElement | null;

  const setStatus = (msg: string, kind: "ok" | "err" | "info" = "info") => {
    if (!statusEl) return;
    statusEl.hidden = !msg;
    statusEl.textContent = msg;
    statusEl.dataset.kind = kind;
    if (msg) statusEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const revealSlugField = () => {
    if (moreOpts) moreOpts.open = true;
    slugInput.focus();
  };

  const setMode = (next: "create" | "update") => {
    mode = next;
    modeBtns.forEach((btn) => {
      const on = btn.dataset.mode === next;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    if (loadWrap) loadWrap.hidden = next !== "update";
    const submitBtn = form.elements.namedItem("email") as HTMLButtonElement;
    submitBtn.textContent =
      next === "update" ? "Send my update" : "Send my page";
  };

  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => setMode((btn.dataset.mode as "create" | "update") || "create"));
  });

  const wantCrown = form.elements.namedItem("want_crown") as HTMLInputElement;
  const wearWrap = document.getElementById("i-new-wear-wrap");
  const blurbWrap = document.getElementById("i-new-blurb-wrap");
  const syncCrownUi = () => {
    const on = wantCrown.checked;
    if (wearWrap) wearWrap.hidden = !on;
    if (blurbWrap) blurbWrap.hidden = !on;
  };
  wantCrown.addEventListener("change", syncCrownUi);
  syncCrownUi();

  const fillFromPage = (page: IPage) => {
    nameInput.value = page.name;
    slugInput.value = page.slug;
    slugTouched = true;
    (form.elements.namedItem("attested_at") as HTMLInputElement).value =
      page.attested_at || todayISO();
    (form.elements.namedItem("tagline") as HTMLInputElement).value =
      page.tagline || "";
    (form.elements.namedItem("portrait") as HTMLInputElement).value =
      page.portrait || "";
    (form.elements.namedItem("theme") as HTMLSelectElement).value =
      page.theme || "ink";
    (form.elements.namedItem("layout") as HTMLSelectElement).value =
      page.layout || "free";
    wantCrown.checked = page.crown_status === "active";
    (form.elements.namedItem("crown_blurb") as HTMLInputElement).value =
      page.crown_blurb || "";
    (form.elements.namedItem("wear_crown") as HTMLInputElement).checked =
      Boolean(page.wear_crown);
    syncCrownUi();
    if (page.contact_email) emailInput.value = page.contact_email;
    const about = extractSection(page.body, "About") || page.body.split(/\n##\s+/)[0]?.trim() || "";
    const links = linksToPlain(extractSection(page.body, "Links"));
    (form.elements.namedItem("about") as HTMLTextAreaElement).value = about;
    (form.elements.namedItem("links") as HTMLTextAreaElement).value = links;
    syncPreview();
  };

  loadSelect?.addEventListener("change", () => {
    const page = pages.find((p) => p.slug === loadSelect.value);
    if (page) {
      fillFromPage(page);
      setStatus(`Loaded ${page.name}. Edit, then send your update.`, "info");
    }
  });

  const readData = () => {
    const fd = new FormData(form);
    const want = fd.get("want_crown") === "1";
    return {
      name: String(fd.get("name") || "").trim(),
      slug: String(fd.get("slug") || "").trim() || slugifyName(String(fd.get("name") || "")),
      attested_at: String(fd.get("attested_at") || todayISO()).trim(),
      tagline: String(fd.get("tagline") || "").trim(),
      theme: String(fd.get("theme") || "ink"),
      layout: String(fd.get("layout") || "free"),
      portrait: String(fd.get("portrait") || "").trim(),
      contact_email: String(fd.get("contact_email") || "").trim(),
      crown_status: want ? "active" : "none",
      crown_blurb: String(fd.get("crown_blurb") || "").trim(),
      wear_crown: want && fd.get("wear_crown") === "1",
      about: String(fd.get("about") || ""),
      links: String(fd.get("links") || ""),
    };
  };

  const syncPreview = () => {
    const name = nameInput.value.trim() || "…";
    if (previewName) previewName.textContent = name;
    if (!slugTouched) {
      slugInput.value = slugifyName(nameInput.value);
    }
  };

  nameInput.addEventListener("input", syncPreview);
  slugInput.addEventListener("input", () => {
    slugTouched = slugInput.value.trim().length > 0;
  });
  syncPreview();

  const validate = () => {
    const data = readData();
    if (!data.name) {
      setStatus("Name is required.", "err");
      nameInput.focus();
      return null;
    }
    if (!data.slug) {
      data.slug = `i-${todayISO()}`;
      slugInput.value = data.slug;
      slugTouched = true;
      revealSlugField();
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      setStatus(
        "Page address can only use lowercase letters, numbers, and hyphens.",
        "err",
      );
      revealSlugField();
      return null;
    }
    if (!data.contact_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)) {
      setStatus("A real email is required so we can reply about updates.", "err");
      emailInput.focus();
      return null;
    }
    if (mode === "create" && pages.some((p) => p.slug === data.slug)) {
      setStatus(
        `Slug “${data.slug}” is taken — switch to Update mine, or pick another slug.`,
        "err",
      );
      revealSlugField();
      return null;
    }
    if (mode === "update" && !pages.some((p) => p.slug === data.slug)) {
      setStatus(
        `No I Page with slug “${data.slug}” yet — use I’m new, or load an existing face.`,
        "err",
      );
      revealSlugField();
      return null;
    }
    return data;
  };

  const persist = (data: ReturnType<typeof readData>) => {
    savePamicDraft({
      email: data.contact_email,
      slug: data.slug,
      name: data.name,
    });
  };

  const downloadMarkdown = (data: ReturnType<typeof readData>) => {
    const md = buildIPageMarkdown(data);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${data.slug}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  (form.elements.namedItem("download") as HTMLButtonElement).addEventListener("click", () => {
    const data = validate();
    if (!data) return;
    persist(data);
    downloadMarkdown(data);
    setStatus(`Downloaded ${data.slug}.md`, "ok");
  });

  (form.elements.namedItem("copy") as HTMLButtonElement).addEventListener("click", async () => {
    const data = validate();
    if (!data) return;
    persist(data);
    const ok = await copyText(buildIPageMarkdown(data));
    setStatus(ok ? "Markdown copied." : "Couldn’t copy — use Download instead.", ok ? "ok" : "err");
  });

  (form.elements.namedItem("github") as HTMLButtonElement).addEventListener("click", () => {
    const data = validate();
    if (!data) return;
    persist(data);
    const md = buildIPageMarkdown(data);
    const gh = githubNewFileUrl(data.slug, md);
    if (!gh) {
      setStatus("Too long for a GitHub link — send the message below, or Download.", "info");
      return;
    }
    setStatus("Opening GitHub… optional path if you want to PR yourself.", "ok");
    window.open(gh, "_blank", "noopener");
  });

  const showSendPanel = (parts: MailParts, copied: boolean) => {
    if (sendBody) sendBody.value = parts.body;
    if (sendSubject) sendSubject.textContent = parts.subject;
    if (mailtoLink) mailtoLink.href = parts.mailtoHref;
    if (gmailLink) gmailLink.href = parts.gmailHref;
    if (outlookLink) outlookLink.href = parts.outlookHref;
    if (sendLede) {
      sendLede.textContent = copied
        ? parts.usedShortMail
          ? "Message copied. Mail apps often truncate long notes — paste this message if the draft looks short."
          : "Message copied. Send it with a mail app, Gmail, or paste it yourself — then watch for our reply."
        : "Copy the message below, then send it with a mail app, Gmail, or paste. Your page isn’t live until we get it.";
    }
    if (sendPanel) {
      sendPanel.hidden = false;
      sendPanel.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  };

  document.getElementById("i-new-copy-msg")?.addEventListener("click", async () => {
    const text = sendBody?.value || "";
    const ok = text ? await copyText(text) : false;
    setStatus(ok ? "Message copied — paste it into any mail app." : "Couldn’t copy — select the message and copy it yourself.", ok ? "ok" : "err");
  });

  document.getElementById("i-new-dl")?.addEventListener("click", () => {
    const data = validate();
    if (!data) return;
    persist(data);
    downloadMarkdown(data);
    setStatus(`Downloaded ${data.slug}.md — attach it if your mail draft is empty.`, "ok");
  });

  if (shareBtn && typeof navigator.share === "function") {
    shareBtn.hidden = false;
    shareBtn.addEventListener("click", async () => {
      const text = sendBody?.value || "";
      const title = sendSubject?.textContent || "iNi I Page";
      try {
        await navigator.share({ title, text });
        setStatus("Share sheet opened — pick Mail or Messages to send.", "ok");
      } catch {
        /* user cancelled */
      }
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = validate();
    if (!data) {
      if (sendPanel) sendPanel.hidden = true;
      return;
    }
    persist(data);
    const md = buildIPageMarkdown(data);
    const parts = buildMailParts({
      mode,
      name: data.name,
      slug: data.slug,
      email: data.contact_email,
      markdown: md,
      crown_status: data.crown_status,
      wear_crown: data.wear_crown && data.crown_status === "active",
    });
    const copied = await copyText(parts.body);
    showSendPanel(parts, copied);
    setStatus(
      copied
        ? "Ready to send. Use Mail app, Gmail, or paste the copied message."
        : "Ready to send. Copy the message below — a mail app is optional.",
      "ok",
    );
  });

  // Returning visitors who already have a face land on Update
  const draft = loadPamicDraft();
  if (draft?.slug && pages.some((p) => p.slug === draft.slug)) {
    setMode("update");
    if (loadSelect) loadSelect.value = draft.slug;
    const page = pages.find((p) => p.slug === draft.slug);
    if (page) fillFromPage(page);
  }
}

function parseRoute(): {
  view: "home" | "i-index" | "i-new" | "i-detail";
  slug?: string;
  anchor?: string;
} {
  const raw = window.location.hash || "#/";
  if (raw === "#/i/new" || raw.startsWith("#/i/new?") || raw.startsWith("#/i/new#")) {
    return { view: "i-new" };
  }
  if (raw.startsWith("#/i/")) {
    const slug = decodeURIComponent(raw.slice(4).split(/[?#]/)[0] || "");
    return slug ? { view: "i-detail", slug } : { view: "i-index" };
  }
  if (raw === "#/i" || raw.startsWith("#/i?") || raw.startsWith("#/i#")) {
    return { view: "i-index" };
  }
  if (raw.startsWith("#") && !raw.startsWith("#/")) {
    return { view: "home", anchor: raw.slice(1) };
  }
  return { view: "home" };
}

function bindReveals(): void {
  const revealEls = app!.querySelectorAll<HTMLElement>(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  revealEls.forEach((el) => observer.observe(el));
  requestAnimationFrame(() => {
    app!.querySelectorAll<HTMLElement>(".hero .reveal").forEach((el) => {
      el.classList.add("is-visible");
    });
  });
}

function render(): void {
  const route = parseRoute();
  if (route.view === "i-new") {
    app!.dataset.surface = "i";
    app!.innerHTML = iNewHtml();
    document.title = "Miss Pamic's Template · iNi";
    window.scrollTo(0, 0);
    bindINewForm();
    return;
  }
  if (route.view === "i-detail" && route.slug) {
    const page = pages.find((p) => p.slug === route.slug);
    app!.dataset.surface = "i";
    app!.innerHTML = page
      ? iDetailHtml(page)
      : `${headerHtml("i")}<main class="i-view"><section class="section"><div class="section__inner"><h1 class="section__title">Not found</h1><p><a href="#/i">← I Pages</a></p></div></section></main>${footerHtml()}`;
    document.title = page ? `I am ${page.name} · iNi` : "I Page · iNi";
    window.scrollTo(0, 0);
    return;
  }
  if (route.view === "i-index") {
    app!.dataset.surface = "i";
    app!.innerHTML = iIndexHtml();
    document.title = "I Pages · iNi";
    window.scrollTo(0, 0);
    return;
  }
  app!.dataset.surface = "home";
  app!.innerHTML = homeHtml();
  document.title = "iNi — provenance practice · uXu";
  bindReveals();
  if (route.anchor) {
    requestAnimationFrame(() => {
      document.getElementById(route.anchor!)?.scrollIntoView();
    });
  }
}

window.addEventListener("hashchange", render);
render();
