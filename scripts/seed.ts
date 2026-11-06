/**
 * Seed the Enviro-Hension Sanity dataset with the legacy site's content.
 *
 * Usage:  npm run seed
 *
 * Idempotent: documents use deterministic ids (`topic-river`, `resource-r1`,
 * …) and are upserted, so re-running refreshes values without duplicating.
 *
 * Bilingual fields follow PLAN.md D4: English always seeded, Kiswahili seeded
 * where a translation exists in `lib/i18n.ts`; missing SW items are left out
 * so Studio shows an empty cell for editors to fill (site readers fall back
 * to English).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient, type SanityClient } from "@sanity/client";
import { T, type Locale } from "../lib/i18n";
import { topicData, topicCards } from "../lib/topics";
import { resources, campaigns, episodes, works } from "../lib/content";

const PROJECT_ID = process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "i9s1a5ax";
const DATASET = process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const API_VERSION = "2026-11-06";

/**
 * Candidate tokens: explicit env var first, then the local Sanity CLI login
 * (`authToken` is the session token the project API accepts; `accessToken` is
 * an OAuth token that does not work against project endpoints).
 * Each is validated with a tiny query before use.
 */
function candidateTokens(): string[] {
  const envToken = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
  const out: string[] = [];
  if (envToken) out.push(envToken);

  // Sanity CLI ≥ v4 stores auth in ~/.config/sanity/config.json
  try {
    const configFile = path.join(os.homedir(), ".config", "sanity", "config.json");
    const cfg = JSON.parse(fs.readFileSync(configFile, "utf8")) as Record<string, string>;
    for (const k of ["authToken", "accessToken"]) {
      const v = cfg[k];
      if (v) out.push(v);
    }
  } catch {
    /* fall through to legacy location */
  }

  // Older CLI versions used ~/.config/sanity/auth.yml
  try {
    const authFile = path.join(os.homedir(), ".config", "sanity", "auth.yml");
    const m = fs.readFileSync(authFile, "utf8").match(/token:\s*["']?([^"'\s]+)/);
    if (m?.[1]) out.push(m[1]);
  } catch {
    /* handled below */
  }

  if (out.length === 0) {
    throw new Error(
      "No Sanity token found. Set SANITY_API_WRITE_TOKEN or run `npx sanity login` first.",
    );
  }
  return out;
}

type BiItem = { _key: string; language: string; value?: string };

/** Build an internationalized-array value: always EN, SW only when provided. */
function bi(en?: string | null, sw?: string | null): BiItem[] {
  const items: BiItem[] = [];
  if (en) items.push({ _key: "en", language: "en", value: en });
  if (sw && sw !== en) items.push({ _key: "sw", language: "sw", value: sw });
  return items;
}

/** Dictionary lookup with fallback (same behavior as pages' `tx()`). */
function tx(locale: Locale, key: string, fallback: string): string {
  return T[locale][key] ?? fallback;
}

type Doc = Record<string, unknown> & { _id: string; _type: string };

async function upsert(client: SanityClient, doc: Doc): Promise<"created" | "updated"> {
  const { _id, ...body } = doc;
  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: _id });
  if (!existing) {
    await client.createIfNotExists({ _id, ...body });
    return "created";
  }
  await client.patch(_id).set(body).commit();
  return "updated";
}

function buildDocs(): Doc[] {
  const docs: Doc[] = [];

  // ── Topics (6) ────────────────────────────────────────────────────────────
  for (const card of topicCards) {
    const topic = topicData[card.key];
    const i = card.i;
    docs.push({
      _id: `topic-${card.key}`,
      _type: "topic",
      key: card.key,
      title: bi(tx("en", `tc-t${i}`, topic.title), tx("sw", `tc-t${i}`, "")),
      intro: bi(topic.intro, ""), // no SW translation in the legacy dict — left for editors
      cardDescription: bi(tx("en", `tc-d${i}`, card.desc), tx("sw", `tc-d${i}`, "")),
      stepPill: bi(tx("en", `tc-p${i}`, card.pill), tx("sw", `tc-p${i}`, "")),
      level: bi(tx("en", `tc-lv${i}`, ""), tx("sw", `tc-lv${i}`, "")),
      icon: card.icon,
      thumbClass: card.thumb,
      steps: topic.steps.map((s, idx) => ({
        _key: `step-${idx + 1}`,
        heading: bi(s.h, ""),
        body: bi(s.p, ""),
      })),
      resourceTitle: bi(topic.res, ""),
      resourceDescription: bi(topic.resD, ""),
      // Phase 5.1: the topic's Download Kit downloads this resource's file.
      ...(card.key === "river"
        ? { relatedResource: { _type: "reference", _ref: "resource-r2" } }
        : {}),
      order: i,
    });
  }

  // ── Resources (6) ─────────────────────────────────────────────────────────
  resources.forEach((r, idx) => {
    docs.push({
      _id: `resource-${r.id}`,
      _type: "resource",
      key: r.id,
      title: bi(tx("en", `${r.id}t`, r.title), tx("sw", `${r.id}t`, "")),
      description: bi(r.desc, ""),
      category: r.cat,
      languages: r.langs,
      order: idx + 1,
    });
  });

  // ── Campaigns (4) ─────────────────────────────────────────────────────────
  // Phase 5.1: “Get the Guide” opens the related Learn topic; ca4 has no
  // matching topic, so it links to a library resource (and gets a guide file).
  const campaignTopic: Record<string, string> = {
    ca1: "topic-river",
    ca2: "topic-trees",
    ca3: "topic-waste",
  };
  for (const c of campaigns) {
    docs.push({
      _id: `campaign-ca${c.i}`,
      _type: "campaign",
      key: `ca${c.i}`,
      icon: c.icon,
      title: bi(tx("en", `ca${c.i}t`, c.title), tx("sw", `ca${c.i}t`, "")),
      description: bi(tx("en", `ca${c.i}d`, c.desc), tx("sw", `ca${c.i}d`, "")),
      buttonLabel: bi(tx("en", `ca${c.i}b`, "📥 Get the Guide"), tx("sw", `ca${c.i}b`, "")),
      tags: c.tags,
      ...(campaignTopic[`ca${c.i}`]
        ? { relatedTopic: { _type: "reference", _ref: campaignTopic[`ca${c.i}`] } }
        : {}),
      ...(c.i === 4
        ? { relatedResource: { _type: "reference", _ref: "resource-r5" } }
        : {}),
      order: c.i,
    });
  }

  // ── Work items: podcast episodes (3) + documentaries/blogs (4) ────────────
  for (const e of episodes) {
    docs.push({
      _id: `workitem-ep${e.n}`,
      _type: "workItem",
      key: `po${e.i}`,
      kind: "pod",
      title: bi(tx("en", `po${e.i}t`, e.title), tx("sw", `po${e.i}t`, "")),
      badge: "Podcast Episode",
      episodeNumber: e.n,
      meta: e.dur,
      language: e.dur.includes("Kiswahili") ? "SW" : e.dur.includes("English") ? "EN" : "EN/SW",
      order: e.i,
    });
  }
  for (const w of works) {
    docs.push({
      _id: `workitem-w${w.i}`,
      _type: "workItem",
      key: `w${w.i}`,
      kind: w.wc,
      title: bi(tx("en", `w${w.i}t`, w.title), tx("sw", `w${w.i}t`, "")),
      badge: w.badge,
      date: w.date,
      language: w.lang,
      icon: w.icon,
      order: w.i,
    });
  }

  // ── Settings singleton (1) ────────────────────────────────────────────────
  docs.push({
    _id: "settings",
    _type: "settings",
    siteName: "Enviro-Hension",
    tagline: "Discover, Engage, Empower. Building environmental capacity across Kenya — in English and Kiswahili.",
    contactEmail: "info@envirohension.org",
    phone: "", // Phase 5.2: legacy placeholder phone removed until a real number exists
    city: "Nairobi, Kenya",
    socials: [
      { _key: "x", platform: "X", icon: "𝕏", url: "" },
      { _key: "linkedin", platform: "LinkedIn", icon: "in", url: "" },
      { _key: "facebook", platform: "Facebook", icon: "f", url: "" },
      { _key: "instagram", platform: "Instagram", icon: "📸", url: "" },
      { _key: "youtube", platform: "YouTube", icon: "▶", url: "" },
    ],
    copyright: "© 2025 Enviro-Hension. All rights reserved.",
    footerNote: "Built for Kenya's environmental leaders",
    // Phase 5.3: stock Google sample removed — player hidden until real media.
    heroVideoUrl: "",
    // Phase 5b: Learn page intro video — hidden (disabled placeholder) until set.
    learnIntroVideoUrl: "",
    subscribeBlurb: bi("Monthly digest of tools, events, and stories. No spam.", ""),
  });

  return docs;
}

/**
 * Minimal valid single-page PDF (Helvetica text) used as the placeholder
 * download for seeded resources/guides. Editors replace these files in
 * Studio — the point is that every Download button has a real file behind it.
 */
function placeholderPdf(title: string): Buffer {
  const clean = title.replace(/[^\x20-\x7E]/g, "?");
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const stream = [
    "BT /F1 20 Tf 60 730 Td (Enviro-Hension) Tj ET",
    `BT /F1 14 Tf 60 700 Td (${esc(clean)}) Tj ET`,
    "BT /F1 10 Tf 60 668 Td (Placeholder document.) Tj ET",
    "BT /F1 10 Tf 60 652 Td (Replace this file in Sanity Studio: Content > Resources / Campaigns.) Tj ET",
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf, "latin1");
}

/** Upload a placeholder PDF and attach it to a document — unless it already has a file. */
async function ensureFile(
  client: SanityClient,
  id: string,
  field: string,
  filename: string,
  title: string,
): Promise<"attached" | "kept"> {
  const existing = await client.fetch<boolean>(`defined(*[_id == $id][0].${field}.asset)`, { id });
  if (existing) return "kept";
  const asset = await client.assets.upload("file", placeholderPdf(title), {
    filename,
    contentType: "application/pdf",
  });
  await client
    .patch(id)
    .set({ [field]: { _type: "file", asset: { _type: "reference", _ref: asset._id } } })
    .commit();
  return "attached";
}

async function main() {
  const candidates = candidateTokens();

  let client: SanityClient | null = null;
  let lastError: unknown = null;
  for (const token of candidates) {
    const c = createClient({
      projectId: PROJECT_ID,
      dataset: DATASET,
      apiVersion: API_VERSION,
      token,
      useCdn: false,
    });
    try {
      await c.fetch("count(*[_type == 'topic'])");
      client = c;
      break;
    } catch (err) {
      lastError = err;
    }
  }
  if (!client) throw lastError ?? new Error("No working Sanity token.");

  const docs = buildDocs();
  console.log(`Seeding ${docs.length} documents into ${PROJECT_ID}/${DATASET} …`);

  let created = 0;
  let updated = 0;
  for (const doc of docs) {
    const result = await upsert(client, doc);
    if (result === "created") created++;
    else updated++;
    console.log(`  ${result === "created" ? "✔" : "↻"} ${doc._id}`);
  }

  console.log(`\nDone: ${created} created, ${updated} updated.`);

  // ── Phase 5.1: real files behind every Download button ────────────────────
  console.log("\nAttaching placeholder PDFs (skipped when a file already exists) …");
  let attached = 0;
  for (const r of resources) {
    const res = await ensureFile(client, `resource-${r.id}`, "file", `${r.id}.pdf`, r.title);
    if (res === "attached") attached++;
  }
  // ca4 has no matching topic — its “Get the Guide” downloads a real file.
  if ((await ensureFile(client, "campaign-ca4", "guide", "ca4-guide.pdf", "Start a Local Chapter Guide")) === "attached") {
    attached++;
  }
  console.log(`Files: ${attached} attached, ${resources.length + 1 - attached} already present.`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
