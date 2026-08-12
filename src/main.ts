import "./style.css";
import iData from "./i-data.json";
import { renderMarkdown } from "./markdown";

const SOLOIST = "https://soloist.ai/uxu";
const UXU_COMMONS = "https://rasvibir.github.io/uXu/";
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
  return `
    <figure class="${classes}" title="${escapeAttr(label)}">
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
      ${crowned ? `<span class="i-portrait__crown" aria-hidden="true">${crownIcon(size === "hero" ? "md" : "sm")}</span>` : ""}
      ${crowned && size === "hero" ? `<figcaption class="i-portrait__caption">Wearing I Crown</figcaption>` : ""}
    </figure>`;
}

/** Sleek five-leaflet crown — reads as honor mark with a soft pot-leaf cue. */
function crownIcon(size: "sm" | "md" | "lg" = "sm"): string {
  const cls = `crown-icon crown-icon--${size}`;
  return `<svg class="${cls}" viewBox="0 0 64 56" fill="none" aria-hidden="true" focusable="false">
    <g fill="currentColor">
      <path d="M32 2.5c-2.2 8.2-3.6 16.6-4 26.2h8c-.4-9.6-1.8-18-4-26.2z"/>
      <path d="M28.2 14.5c-4.8-2.8-9.6-2.2-13.4.6 3.1 3.6 7.2 8.2 11.2 13.6.4-4.9.9-9.6 2.2-14.2z"/>
      <path d="M35.8 14.5c4.8-2.8 9.6-2.2 13.4.6-3.1 3.6-7.2 8.2-11.2 13.6-.4-4.9-.9-9.6-2.2-14.2z"/>
      <path d="M18.8 24.2c-4.2-1.6-8.4-.6-11.6 2.2 2.2 3.8 5.4 8.2 9.2 12.8.6-5.2 1.2-10 2.4-15z"/>
      <path d="M45.2 24.2c4.2-1.6 8.4-.6 11.6 2.2-2.2 3.8-5.4 8.2-9.2 12.8-.6-5.2-1.2-10-2.4-15z"/>
      <path d="M20 39.2h24l1.6 3.2H18.4z"/>
      <path d="M13 45.6h38c1.2 0 2.2.9 2.2 2.1v2.1c0 1.2-1 2.1-2.2 2.1H13c-1.2 0-2.2-.9-2.2-2.1v-2.1c0-1.2 1-2.1 2.2-2.1z"/>
    </g>
    <path stroke="currentColor" stroke-width="1.25" stroke-linecap="round" opacity="0.28" d="M32 8v22"/>
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

function headerHtml(active: "home" | "i" = "home"): string {
  return `
  <header class="site-header">
    <div class="site-header__inner">
      <a class="brand" href="#/" aria-label="iNi home">iNi</a>
      <nav class="nav" aria-label="Main">
        ${
          active === "home"
            ? `
        <a href="#stack">Stack</a>
        <a href="#practice">Practice</a>
        <a href="#/i">I Pages</a>
        <a href="#forum">Forum</a>
        <a href="#faq">FAQ</a>
        <a href="#contact">Contact</a>`
            : `
        <a href="#/">Home</a>
        <a href="#/i" aria-current="page">I Pages</a>
        <a href="#forum">Forum</a>
        <a href="${FORUM}" target="_blank" rel="noopener">Discussions</a>
        <a href="${SOLOIST}">Soloist</a>`
        }
      </nav>
    </div>
  </header>`;
}

function footerHtml(): string {
  return `
  <footer class="site-footer">
    <div class="site-footer__inner">
      <p><a class="brand" href="#/">iNi</a> · <a href="#/i">I Pages</a> · <a href="${FORUM}">Forum</a> · <a href="${SOLOIST}">Soloist</a> · <a href="${UXU_COMMONS}">uXu</a></p>
      <p><a href="${INI_REPO}">GitHub</a></p>
    </div>
  </footer>`;
}

function homeHtml(): string {
  return `
  ${headerHtml("home")}
  <main id="top">
    <section class="hero" aria-labelledby="hero-brand">
      <div class="hero__atmosphere" aria-hidden="true"></div>
      <div class="hero__inner">
        <p id="hero-brand" class="hero__brand reveal">iNi</p>
        <h1 class="hero__headline reveal">Practice provenance together</h1>
        <p class="hero__support reveal">
          A name, a protocol, and a community boundary — defined by how you
          document origin, authorship, lineage, and custody. Not a company
          label. Not required to use uXu.
        </p>
        <div class="cta-row reveal">
          <a class="btn btn--primary" href="#stack">See the stack</a>
          <a class="btn btn--ghost" href="#/i">I Pages</a>
          <a class="btn btn--ghost" href="${FORUM}" target="_blank" rel="noopener">Forum</a>
          <a class="btn btn--ghost" href="${UXU_COMMONS}">Visit uXu</a>
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
              <p>Start at the uXu commons, then Quick Nav → iNi Provenance (or type <code>INI</code>).</p>
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
              <p>Set <code>uxu.ini.optIn: true</code>. Optional stamp on the archive. Optional I Page / I Crown via this repo.</p>
            </div>
          </li>
        </ol>
        <pre class="snippet" tabindex="0"><code>"uxu": {
  "ini": {
    "optIn": true,
    "tag": "iNi",
    "showBadge": true,
    "badgeLinksToIPage": false,
    "provenance": { "origin": "…", "authors": ["…"], "custody": "…", "lineage": "…", "conditions": "…", "attestedAt": "2026-08-12" }
  }
}</code></pre>
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
        <p style="margin-top:1.25rem;margin-bottom:0">
          <a class="btn btn--ghost" href="#/i">Browse I Pages</a>
        </p>
      </div>
    </section>

    <section class="section" id="forum" aria-labelledby="forum-title">
      <div class="section__inner reveal forum-panel">
        <p class="section__eyebrow">Forum</p>
        <h2 class="section__title" id="forum-title">Talk in the open</h2>
        <p class="section__lede">
          The iNi forum lives in GitHub Discussions — practice notes, Crown
          questions, archive help. Soloist and this site are doors, not a gated club.
        </p>
        <div class="cta-row">
          <a class="btn btn--primary" href="${FORUM}" target="_blank" rel="noopener">Open forum</a>
          <a class="btn btn--ghost" href="${INI_REPO}" target="_blank" rel="noopener">Community repo</a>
        </div>
      </div>
    </section>

    <section class="section section--tight" id="links" aria-labelledby="links-title">
      <div class="section__inner reveal">
        <p class="section__eyebrow">Doors</p>
        <h2 class="section__title" id="links-title">Links</h2>
        <div class="links-grid">
          <a href="${SOLOIST}"><strong>Soloist notes</strong><span>Primary public face</span></a>
          <a href="${UXU_COMMONS}"><strong>uXu commons</strong><span>Archives · 0?0 · INI</span></a>
          <a href="${FORUM}" target="_blank" rel="noopener"><strong>Forum</strong><span>GitHub Discussions</span></a>
          <a href="#/i"><strong>I Pages</strong><span>I am {name}</span></a>
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
            <p><a href="${FORUM}" target="_blank" rel="noopener">GitHub Discussions on RASvibir/iNi</a>. Open to the community; not a membership app.</p>
          </details>
          <details>
            <summary>How do I get an I Page?</summary>
            <p>PR a Markdown file under <code>content/i/</code> (see the template). Choose <code>theme</code> and <code>layout</code>; optional <code>crown_status: active</code>.</p>
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
        <p>Questions about iNi practice: <a href="mailto:${CONTACT}">${CONTACT}</a></p>
        <p>Forum: <a href="${FORUM}" target="_blank" rel="noopener">${FORUM}</a></p>
      </div>
    </section>
  </main>
  ${footerHtml()}`;
}

function iIndexHtml(): string {
  return `
  ${headerHtml("i")}
  <main class="i-view">
    <section class="section">
      <div class="section__inner">
        <p class="section__eyebrow">I Pages</p>
        <h1 class="section__title">I am …</h1>
        <p class="section__lede">
          Non-judged faces. Customisable themes and layouts. Optional I Crown is
          honor-bound and separate from iNi provenance.
        </p>
        <ul class="i-index">
          ${pages.map(iIndexRow).join("")}
        </ul>
        <p class="section__lede" style="margin-top:1.5rem">
          Add yours via PR in <code>content/i/</code> · <a href="${FORUM}" target="_blank" rel="noopener">Forum</a>
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

function parseRoute(): { view: "home" | "i-index" | "i-detail"; slug?: string; anchor?: string } {
  const raw = window.location.hash || "#/";
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
  if (route.view === "i-detail" && route.slug) {
    const page = pages.find((p) => p.slug === route.slug);
    app!.innerHTML = page
      ? iDetailHtml(page)
      : `${headerHtml("i")}<main class="i-view"><section class="section"><div class="section__inner"><h1 class="section__title">Not found</h1><p><a href="#/i">← I Pages</a></p></div></section></main>${footerHtml()}`;
    document.title = page ? `I am ${page.name} · iNi` : "I Page · iNi";
    window.scrollTo(0, 0);
    return;
  }
  if (route.view === "i-index") {
    app!.innerHTML = iIndexHtml();
    document.title = "I Pages · iNi";
    window.scrollTo(0, 0);
    return;
  }
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
