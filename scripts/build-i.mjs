#!/usr/bin/env node
/**
 * Reads content/i/*.md (except _TEMPLATE) → src/i-data.json
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
    const m = line.match(/^(\w+):\s*(.*)$/);
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
    body,
    file,
  });
}

await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, JSON.stringify({ generatedAt: new Date().toISOString(), pages }, null, 2) + "\n");
console.log(`wrote ${pages.length} I page(s) → src/i-data.json`);
