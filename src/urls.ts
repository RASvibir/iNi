/**
 * Public-link hygiene for I Pages.
 * Allow any http(s)/mailto URL (site, social, whatever) — no platform allowlist.
 * Block dangerous schemes; steward publish is the human gate for spam/phishing.
 */

const ALLOWED = new Set(["http:", "https:", "mailto:"]);

/** Normalize a user-supplied URL, or null if the scheme is not allowed. */
export function safePublicUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    if (!ALLOWED.has(u.protocol.toLowerCase())) return null;
    if (u.protocol === "http:" || u.protocol === "https:") {
      if (!u.hostname) return null;
    }
    return u.href;
  } catch {
    return null;
  }
}

/** Escape a URL for use in an HTML attribute. */
export function escapeAttrUrl(href: string): string {
  return href
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Portrait / image src: https preferred; allow http or same-site paths. */
export function safePortraitSrc(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  const u = safePublicUrl(trimmed);
  if (!u) return null;
  if (!/^https?:/i.test(u)) return null;
  return u;
}
