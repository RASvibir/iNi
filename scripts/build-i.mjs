#!/usr/bin/env node
/**
 * Reads content/i/*.md (except _TEMPLATE / README) → src/i-data.json
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "content", "i");
const out = path.join(root, "src", "i-data.json");

function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: raw.trim() };
  }
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([\w_]+):\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    meta[m[1]] = val;
  }
  return { meta, body: match[2].trim() };
}

function normalizeCrownStatus(raw) {
  const s = String(raw || "none").toLowerCase();
  if (s === "active" || s === "suspended" || s === "none") return s;
  return "none";
}

function normalizeTheme(raw) {
  const s = String(raw || "ink").toLowerCase();
  if (s === "ink" || s === "paper" || s === "terminal") return s;
  return "ink";
}

function normalizeLayout(raw) {
  const s = String(raw || "free").toLowerCase();
  if (s === "free" || s === "compact" || s === "wide") return s;
  return "free";
}

const files = (await readdir(dir))
  .filter((f) => f.endsWith(".md") && !f.startsWith("_") && f !== "README.md")
  .sort();

const pages = [];
for (const file of files) {
  const raw = await readFile(path.join(dir, file), "utf8");
  const { meta, body } = parseFrontMatter(raw);
  const slug = meta.slug || file.replace(/\.md$/, "");
  const name = meta.name || slug;
  if (!meta.name || !meta.attested_at) {
    console.warn(`skip ${file}: need name + attested_at`);
    continue;
  }
  pages.push({
    name,
    slug,
    attested_at: meta.attested_at,
    tagline: meta.tagline || "",
    theme: normalizeTheme(meta.theme),
    layout: normalizeLayout(meta.layout),
    crown_status: normalizeCrownStatus(meta.crown_status),
    crown_blurb: meta.crown_blurb || "",
    body,
    file,
  });
}

await mkdir(path.dirname(out), { recursive: true });
await writeFile(
  out,
  JSON.stringify({ generatedAt: new Date().toISOString(), pages }, null, 2) + "\n",
);
console.log(`wrote ${pages.length} I Page(s) → src/i-data.json`);
