import "./style.css";

const SOLOIST = "https://soloist.ai/uxu";
const UXU_COMMONS = "https://rasvibir.github.io/uXu/";
const UXU_REPO = "https://github.com/RASvibir/uXu";
const INI_REPO = "https://github.com/RASvibir/iNi";
const CONTACT = "rasip@chloreform.org";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("#app missing");

app.innerHTML = `
  <header class="site-header">
    <div class="site-header__inner">
      <a class="brand" href="#top" aria-label="iNi home">iNi</a>
      <nav class="nav" aria-label="Main">
        <a href="#what">What iNi is</a>
        <a href="#practice">Practice</a>
        <a href="#links">Links</a>
        <a href="#faq">FAQ</a>
        <a href="#contact">Contact</a>
      </nav>
    </div>
  </header>

  <main id="top">
    <section class="hero" aria-labelledby="hero-brand">
      <div class="hero__atmosphere" aria-hidden="true"></div>
      <div class="hero__inner">
        <p id="hero-brand" class="hero__brand reveal">iNi</p>
        <h1 class="hero__headline reveal">Practice provenance together</h1>
        <p class="hero__support reveal">
          A name, a protocol, and a community boundary — defined by how you
          document origin, authorship, lineage, and custody. Not a company
          label. Not required to use uXu. This page is a mirror; primary public
          notes live on Soloist.
        </p>
        <div class="cta-row reveal">
          <a class="btn btn--primary" href="${SOLOIST}">Public notes (Soloist)</a>
          <a class="btn btn--ghost" href="#practice">Practice iNi</a>
          <a class="btn btn--ghost" href="${UXU_COMMONS}">Visit uXu</a>
        </div>
      </div>
    </section>

    <section class="section" id="what" aria-labelledby="what-title">
      <div class="section__inner reveal">
        <p class="section__eyebrow">Beside the commons</p>
        <h2 class="section__title" id="what-title">What iNi is</h2>
        <p class="section__lede">
          iNi is the inner-circle provenance layer beside uXu. It is a name, a
          protocol, and a community boundary — not a company label. The spelling
          comes from an “I and I” framing: a shared identity space where trusted
          collaborators and archives agree to treat origin, authorship, lineage,
          and custody as first-class responsibilities.
        </p>
        <ul class="layer-list">
          <li>
            <strong>uXu</strong>
            <span>Public archive commons — the site, the repo, and the installable app. Independent archives keep their own voice.</span>
          </li>
          <li>
            <strong>0?0</strong>
            <span>Root archive interface inside uXu — the console for registry, manuals, and navigation. A tool, not the community brand.</span>
          </li>
          <li>
            <strong>iNi</strong>
            <span>Opt-in provenance practice — “I and I.” Document origin, authorship, lineage, and custody. Community by honesty, not membership theater.</span>
          </li>
        </ul>
        <ul class="not-list" aria-label="What iNi is not">
          <li>Not membership theater or a signup badge</li>
          <li>Not required to publish on uXu</li>
          <li>Not a company or org brand label</li>
          <li>Not a legal chain-of-custody certificate</li>
          <li>Not a claim that uXu owns your archive</li>
        </ul>
      </div>
    </section>

    <section class="section" id="practice" aria-labelledby="practice-title">
      <div class="section__inner reveal">
        <p class="section__eyebrow">Self-attestation</p>
        <h2 class="section__title" id="practice-title">How to practice iNi</h2>
        <p class="section__lede">
          Joining means adopting the protocol — not earning a badge. You do not
          need this mirror or Soloist to opt in. Prefer the console, or open a
          pull request in the community repo.
        </p>
        <ol class="practice-steps">
          <li>
            <div>
              <strong>Open 0?0</strong>
              <p>Start at the uXu commons, then Quick Nav → iNi Provenance (or type <code>INI</code>). Optional notes: <a href="${SOLOIST}">soloist.ai/uxu</a> (<code>INI SITE</code>).</p>
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
              <p>Set <code>uxu.ini.optIn: true</code> and tag <strong>iNi</strong> only when that documentation is honest and maintained.</p>
            </div>
          </li>
        </ol>
        <pre class="snippet" tabindex="0"><code>"uxu": {
  "ini": {
    "optIn": true,
    "tag": "iNi",
    "provenance": {
      "origin": "…",
      "authors": ["…"],
      "custody": "…",
      "lineage": "…",
      "conditions": "…",
      "attestedAt": "2026-08-12"
    }
  }
}</code></pre>
      </div>
    </section>

    <section class="section section--tight" id="links" aria-labelledby="links-title">
      <div class="section__inner reveal">
        <p class="section__eyebrow">Doors</p>
        <h2 class="section__title" id="links-title">Links</h2>
        <div class="links-grid">
          <a href="${SOLOIST}">
            <strong>Public notes (Soloist)</strong>
            <span>Primary community face — practice, FAQ, contact</span>
          </a>
          <a href="${UXU_COMMONS}">
            <strong>uXu commons</strong>
            <span>Live archive door — opens 0?0</span>
          </a>
          <a href="${UXU_REPO}">
            <strong>uXu repo</strong>
            <span>Software, templates, RTFM · MIT</span>
          </a>
          <a href="${INI_REPO}">
            <strong>Community paper trail</strong>
            <span>Charter, articles, authorizations via PR</span>
          </a>
        </div>
      </div>
    </section>

    <section class="section qtp" id="qtp" aria-labelledby="qtp-title">
      <div class="section__inner reveal">
        <p class="qtp__mark">/qtp_[devo]</p>
        <h2 class="section__title" id="qtp-title">Open-source steward</h2>
        <p class="section__lede">
          /qtp_[devo] is the open-source activist layer beside this practice —
          stewardship and build signal, not administration of iNi. iNi remains
          community by honesty.
        </p>
      </div>
    </section>

    <section class="section" id="faq" aria-labelledby="faq-title">
      <div class="section__inner reveal">
        <p class="section__eyebrow">Clarify</p>
        <h2 class="section__title" id="faq-title">Frequently asked</h2>
        <div class="faq">
          <details>
            <summary>What is iNi?</summary>
            <p>iNi is a name, a protocol, and a community boundary — an “I and I” practice for origin, authorship, lineage, and custody. Not a company label. Not required to use uXu.</p>
          </details>
          <details>
            <summary>What is uXu?</summary>
            <p>uXu is the public archive commons — a shared place to find and keep independent archives. It’s the site, the repo, and an installable app. Your collection stays yours; uXu helps it stay findable.</p>
          </details>
          <details>
            <summary>What is 0?0?</summary>
            <p>0?0 is the root archive interface inside uXu — the console where you browse the registry, open manuals, and run commands. It’s a tool for navigating the commons, not the name of the community.</p>
          </details>
          <details>
            <summary>How do I join the provenance community?</summary>
            <p>Practice the protocol — no Soloist account required. Read <a href="${SOLOIST}">soloist.ai/uxu</a>, opt in on <a href="${UXU_COMMONS}">0?0</a> (Quick Nav → iNi Provenance or type <code>INI</code>), and optionally open a PR under <code>content/articles/</code> in <a href="${INI_REPO}">RASvibir/iNi</a>. Join means honesty about origin and custody, not enrollment.</p>
          </details>
          <details>
            <summary>How do I opt in without a website?</summary>
            <p>Start at <a href="${UXU_COMMONS}">the uXu commons</a>. That opens 0?0. Use Quick Nav → iNi Provenance (or type <code>INI</code>). Document provenance on your archive, then opt in when that documentation is real and maintained. Self-attestation only.</p>
          </details>
          <details>
            <summary>Can I add articles or authorizations from the repo?</summary>
            <p>Yes. Open a pull request under <code>content/articles/</code> (and follow <code>CONTRIBUTING.md</code>). Console commands on 0?0 remain the primary archive path; the repo is the community paper trail.</p>
          </details>
          <details>
            <summary>What is this GitHub Pages site?</summary>
            <p>An optional mirror of the community copy and a source for a later Web3 door. Primary public notes remain <a href="${SOLOIST}">soloist.ai/uxu</a>.</p>
          </details>
          <details>
            <summary>What is /qtp_[devo]?</summary>
            <p>An open-source steward signal beside this practice — not administration of iNi. iNi remains community by honesty.</p>
          </details>
        </div>
      </div>
    </section>

    <section class="section section--tight" id="contact" aria-labelledby="contact-title">
      <div class="section__inner reveal contact-block">
        <p class="section__eyebrow">Reach</p>
        <h2 class="section__title" id="contact-title">Contact</h2>
        <p>Questions about iNi practice: <a href="mailto:${CONTACT}">${CONTACT}</a></p>
        <p>Primary public notes: <a href="${SOLOIST}">soloist.ai/uxu</a></p>
        <p>Software &amp; original docs: MIT. Media stays under its own terms.</p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="site-footer__inner">
      <p><a class="brand" href="#top">iNi</a> · mirror beside <a href="${SOLOIST}">Soloist</a> · practice beside <a href="${UXU_COMMONS}">uXu</a></p>
      <p><a href="${INI_REPO}">GitHub</a> · <a href="${UXU_REPO}">uXu repo</a></p>
    </div>
  </footer>
`;

const revealEls = app.querySelectorAll<HTMLElement>(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
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
    app.querySelectorAll<HTMLElement>(".hero .reveal").forEach((el) => {
      el.classList.add("is-visible");
    });
  });
}
