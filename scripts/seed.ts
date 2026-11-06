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
    phone: "+254 700 000 000",
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
    heroVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    subscribeBlurb: bi("Monthly digest of tools, events, and stories. No spam.", ""),
  });

  return docs;
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
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
