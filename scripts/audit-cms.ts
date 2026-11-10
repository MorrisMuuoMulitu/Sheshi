/**
 * Content health check for the Sanity dataset.
 *
 *   npm run audit:cms
 *
 * Reports the things that quietly break the live site:
 *
 *  1. duplicate `key` values — the Studio lets an editor create a second
 *     document with an existing key. Nothing is hidden any more, but the key
 *     is what relations and deep links (`/learn?topic=river`) resolve against,
 *     so a duplicate makes those ambiguous.
 *  2. broken references — a relation pointing at a deleted document.
 *  3. missing files — a resource or guide whose download button is disabled.
 *  4. oversized media — the video files that will stall a mobile connection.
 *  5. missing translations — bilingual fields with no Kiswahili value, which
 *     silently fall back to English on /sw.
 *
 * Exit code is 1 when a hard error is found, so it can gate a deploy.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

// Load .env.local without a dotenv dependency (tsx runs this directly).
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  // No .env.local — rely on the ambient environment.
}

const projectId = process.env.SANITY_PROJECT_ID ?? "i9s1a5ax";
const dataset = process.env.SANITY_DATASET ?? "production";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-11-06",
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN || undefined,
});

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

let errors = 0;
let warnings = 0;

function problem(level: "error" | "warn", title: string, lines: string[]) {
  if (level === "error") errors++;
  else warnings++;
  const tag = level === "error" ? `${RED}✗ ERROR${RESET}` : `${YELLOW}! WARN ${RESET}`;
  console.log(`\n${tag}  ${title}`);
  for (const line of lines) console.log(`   ${DIM}${line}${RESET}`);
}

function ok(msg: string) {
  console.log(`${GREEN}✓${RESET} ${msg}`);
}

type Doc = {
  _id: string;
  _type: string;
  key?: string | null;
  order?: number | null;
  title?: { language: string; value?: string }[] | null;
  file?: { asset?: { size?: number; mimeType?: string } } | null;
  guide?: { asset?: { size?: number } } | null;
  videoFile?: { asset?: { size?: number; url?: string } } | null;
  mediaUrl?: string | null;
  relatedTopic?: { _ref?: string } | null;
  relatedResource?: { _ref?: string } | null;
};

function label(doc: Doc): string {
  const en = doc.title?.find((t) => t.language === "en")?.value;
  return en ? `"${en.trim()}"` : doc._id;
}

function mb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(0)} MB`;
}

async function main() {
  console.log(`\nSanity content audit — ${projectId}/${dataset}\n${"─".repeat(52)}`);

  const docs = await client.fetch<Doc[]>(
    `*[!(_id in path("drafts.**"))]{
      _id, _type, key, order,
      title, file{asset->{size, mimeType}}, guide{asset->{size}},
      videoFile{asset->{size, url}}, mediaUrl,
      relatedTopic, relatedResource
    } | order(_type asc, order asc)`,
  );

  console.log(`${docs.length} documents\n`);

  // ── 1. duplicate keys ───────────────────────────────────────────────────
  const byTypeKey = new Map<string, Doc[]>();
  for (const d of docs) {
    if (!d.key) continue;
    const k = `${d._type}:${d.key}`;
    byTypeKey.set(k, [...(byTypeKey.get(k) ?? []), d]);
  }
  const dupes = [...byTypeKey.entries()].filter(([, v]) => v.length > 1);
  if (dupes.length) {
    for (const [k, v] of dupes) {
      problem("warn", `Duplicate key "${k.split(":")[1]}" on ${k.split(":")[0]}`, [
        ...v.map((d) => `${d._id}  ${label(d)}`),
        "Relations and deep links resolve to only one of these — rename the key or delete the spare.",
      ]);
    }
  } else {
    ok("No duplicate keys");
  }

  // ── 2. broken references ────────────────────────────────────────────────
  const ids = new Set(docs.map((d) => d._id));
  const broken: string[] = [];
  for (const d of docs) {
    for (const field of ["relatedTopic", "relatedResource"] as const) {
      const ref = d[field]?._ref;
      if (ref && !ids.has(ref)) broken.push(`${d._id} → ${field} = ${ref}`);
    }
  }
  if (broken.length) {
    problem("error", "Broken references", broken);
  } else {
    ok("No broken references");
  }

  // ── 3. missing files ────────────────────────────────────────────────────
  const missing: string[] = [];
  for (const d of docs) {
    if (d._type === "resource" && !d.file?.asset) missing.push(`${label(d)} (${d._id})`);
    if (d._type === "campaign" && d.guide && !d.guide.asset) missing.push(`${label(d)} guide (${d._id})`);
  }
  if (missing.length) {
    problem("warn", "Downloadable items with no file", [
      ...missing,
      "Their download button renders disabled on the site.",
    ]);
  } else {
    ok("Every resource and guide has a file");
  }

  // ── 4. oversized media ──────────────────────────────────────────────────
  const heavy: string[] = [];
  for (const d of docs) {
    const size = d.videoFile?.asset?.size ?? 0;
    if (size > 25 * 1024 * 1024) {
      heavy.push(`${mb(size).padStart(9)}  ${d._type}/${d.key ?? d._id}  ${label(d)}`);
    }
  }
  if (heavy.length) {
    const total = docs.reduce((n, d) => n + (d.videoFile?.asset?.size ?? 0), 0);
    problem("warn", `Video files over 25 MB (${mb(total)} total)`, [
      ...heavy,
      "These stream from the Sanity CDN on click — but a 300 MB file will not play",
      "on a 3G connection. Compress to 720p H.264 around 10–30 MB per module.",
    ]);
  } else {
    ok("All video files are under 25 MB");
  }

  // ── 5. Kiswahili coverage ───────────────────────────────────────────────
  const untranslated: string[] = [];
  for (const d of docs) {
    if (!["topic", "resource", "campaign", "workItem", "settings"].includes(d._type)) continue;
    const en = d.title?.find((t) => t.language === "en")?.value;
    const sw = d.title?.find((t) => t.language === "sw")?.value;
    if (en && !sw) untranslated.push(`${d._type}/${d.key ?? d._id}  ${label(d)}`);
  }
  if (untranslated.length) {
    problem("warn", "No Kiswahili title (falls back to English on /sw)", untranslated);
  } else {
    ok("Every item has a Kiswahili title");
  }

  // ── summary ─────────────────────────────────────────────────────────────
  console.log(`\n${"─".repeat(52)}`);
  if (errors) console.log(`${RED}${errors} error(s)${RESET}, ${warnings} warning(s)`);
  else if (warnings) console.log(`${GREEN}No errors${RESET}, ${warnings} warning(s)`);
  else console.log(`${GREEN}All checks passed${RESET}`);

  process.exit(errors ? 1 : 0);
}

main().catch((err) => {
  console.error("Audit failed to run:", err);
  process.exit(1);
});
