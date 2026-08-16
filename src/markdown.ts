import { escapeAttrUrl, safePublicUrl } from "./urls";

/** Minimal Markdown → safe-ish HTML (no raw HTML passthrough). */
export function renderMarkdown(src: string): string {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inUl = false;
  let inOl = false;
  let inCode = false;
  let codeBuf: string[] = [];

  const closeLists = () => {
    if (inUl) {
      html.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      html.push("</ol>");
      inOl = false;
    }
  };

  const inline = (text: string): string => {
    let t = escapeHtml(text);
    t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    // Any http(s)/mailto — social or otherwise. Unsafe schemes stay plain text.
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, hrefRaw: string) => {
      const decoded = hrefRaw
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      const safe = safePublicUrl(decoded);
      if (!safe) return label;
      const external = /^https?:/i.test(safe);
      const rel = external ? ' rel="noopener noreferrer"' : "";
      const target = external ? ' target="_blank"' : "";
      return `<a href="${escapeAttrUrl(safe)}"${rel}${target}>${label}</a>`;
    });
    return t;
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) {
        html.push(`<pre class="snippet"><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
        codeBuf = [];
        inCode = false;
      } else {
        closeLists();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      closeLists();
      html.push("<hr />");
      continue;
    }

    const h = line.match(/^(#{1,3})\s+(.+)$/);
    if (h) {
      closeLists();
      const level = h[1].length;
      html.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }

    const ul = line.match(/^[-*]\s+(.+)$/);
    if (ul) {
      if (inOl) {
        html.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        html.push("<ul>");
        inUl = true;
      }
      html.push(`<li>${inline(ul[1])}</li>`);
      continue;
    }

    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (ol) {
      if (inUl) {
        html.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        html.push("<ol>");
        inOl = true;
      }
      html.push(`<li>${inline(ol[1])}</li>`);
      continue;
    }

    if (!line.trim()) {
      closeLists();
      continue;
    }

    closeLists();
    html.push(`<p>${inline(line)}</p>`);
  }

  closeLists();
  if (inCode) {
    html.push(`<pre class="snippet"><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
  }
  return html.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
