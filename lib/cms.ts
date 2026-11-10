/**
 * Server-side content access (PLAN.md Phase 3).
 *
 * Every getter is a `use cache` scope (Next 16 cacheComponents):
 *  - `cacheTag('cms')`  → invalidated on demand by POST /api/revalidate
 *  - `cacheLife('minutes')` → self-refresh ≈ legacy ISR revalidate=60
 *
 * PLAN.md Phase 3.4: if Sanity is unreachable (or returns nothing) the getter
 * falls back to the seeded static data — the site must never blank out.
 */
import { cacheLife, cacheTag } from "next/cache";
import { draftMode } from "next/headers";
import { clientFor } from "./sanity";
import {
  campaignsQuery,
  resourcesQuery,
  settingsQuery,
  storiesQuery,
  topicsQuery,
  workItemsQuery,
} from "./queries";
import { T, type Locale } from "./i18n";
import { topicData, topicCards } from "./topics";
import { resources, campaigns, episodes, works } from "./content";
import {
  RESOURCE_BADGE,
  type ActCampaign,
  type LearnTopic,
  type LibraryResource,
  type SiteSettings,
  type StoryCard,
  type WorkCard,
  type WorkEpisode,
} from "./views";

/** story.kind → card icon (same set the share modal uses). */
const STORY_ICON: Record<string, string> = {
  photos: "📸",
  template: "📄",
  blueprint: "📐",
  story: "✍️",
  podcast: "🎙️",
  video: "🎬",
};

/** CMS bilingual field value: [{_key, language, value}, …]. */
type BiItem = { language?: string | null; value?: string | null };

/** Pick a language from a bilingual field with fallbacks (locale → en → first). */
function pickBi(items: BiItem[] | undefined | null, locale: Locale): string {
  if (!Array.isArray(items) || items.length === 0) return "";
  const exact = items.find((x) => x.language === locale && x.value);
  if (exact?.value) return exact.value;
  const en = items.find((x) => x.language === "en" && x.value);
  if (en?.value) return en.value;
  return items.find((x) => x.value)?.value ?? "";
}

/** Same precedence as the legacy pages' `tx(key, fallback)` helper. */
function tx(locale: Locale, key: string, fallback: string): string {
  return T[locale][key] ?? fallback;
}

/**
 * Pick a language from a bilingual field WITHOUT falling back to English.
 * Used where an English-only CMS value would leak into the Kiswahili UI —
 * the caller's own localized fallback is better than the English original.
 */
function pickBiExact(items: BiItem[] | undefined | null, locale: Locale): string {
  if (!Array.isArray(items) || items.length === 0) return "";
  const exact = items.find((x) => x.language === locale && x.value);
  return exact?.value ?? "";
}

// ── Learn page ──────────────────────────────────────────────────────────────

export async function getLearnTopics(locale: Locale): Promise<LearnTopic[]> {
  // Reading draftMode() inside a 'use cache' scope makes Next bypass the
  // cache for draft requests (see the Next 16 draft-mode guide), so the
  // Presentation pane always sees the editor's latest save.
  "use cache";
  cacheTag("cms");
  cacheLife("minutes");
  const { isEnabled: preview } = await draftMode();
  const client = clientFor(preview);
  try {
    const docs = await client.fetch(topicsQuery);
    if (!docs || docs.length === 0) throw new Error("no topic documents");
    console.log(`[cms] topics: ${docs.length} docs from Sanity (${locale})`);
    return docs.map((d): LearnTopic => {
      const card = topicCards.find((c) => c.key === d.key);
      return {
        docId: d._id,
        key: d.key ?? card?.key ?? "",
        i: d.order ?? card?.i ?? 0,
        thumb: d.thumbClass ?? card?.thumb ?? "th1",
        icon: d.icon ?? card?.icon ?? "🌱",
        title: pickBi(d.title, locale),
        desc: pickBi(d.cardDescription, locale),
        pill: pickBi(d.stepPill, locale),
        level: pickBi(d.level, locale),
        intro: pickBi(d.intro, locale),
        steps: (d.steps ?? []).map((s) => ({
          h: pickBi(s?.heading, locale),
          p: pickBi(s?.body, locale),
        })),
        res: pickBi(d.resourceTitle, locale),
        resD: pickBi(d.resourceDescription, locale),
        videoUrl: d.videoFile?.asset?.url ?? d.videoUrl ?? undefined,
        kitFileUrl: d.relatedResource?.file?.asset?.url ?? undefined,
        kitResKey: d.relatedResource?.key ?? undefined,
      };
    });
  } catch (err) {
    console.warn("[cms] topics: Sanity unreachable — using static fallback:", err);
    return staticLearnTopics(locale);
  }
}

function staticLearnTopics(locale: Locale): LearnTopic[] {
  return topicCards.map((c) => {
    const t = topicData[c.key];
    const i = c.i;
    return {
      docId: `topic-${c.key}`,
      key: c.key,
      i,
      thumb: c.thumb,
      icon: c.icon,
      title: tx(locale, `tc-t${i}`, t.title),
      desc: tx(locale, `tc-d${i}`, c.desc),
      pill: tx(locale, `tc-p${i}`, c.pill),
      level: tx(locale, `tc-lv${i}`, ""),
      intro: t.intro,
      steps: t.steps.map((s) => ({ h: s.h, p: s.p })),
      res: t.res,
      resD: t.resD,
    };
  });
}

// ── Build page ──────────────────────────────────────────────────────────────

export async function getResources(locale: Locale): Promise<LibraryResource[]> {
  // Reading draftMode() inside a 'use cache' scope makes Next bypass the
  // cache for draft requests (see the Next 16 draft-mode guide), so the
  // Presentation pane always sees the editor's latest save.
  "use cache";
  cacheTag("cms");
  cacheLife("minutes");
  const { isEnabled: preview } = await draftMode();
  const client = clientFor(preview);
  try {
    const docs = await client.fetch(resourcesQuery);
    if (!docs || docs.length === 0) throw new Error("no resource documents");
    console.log(`[cms] resources: ${docs.length} docs from Sanity (${locale})`);
    return docs.map((d): LibraryResource => {
      const cat = (d.category ?? "tp") as LibraryResource["cat"];
      return {
        cat,
        rt: RESOURCE_BADGE[cat],
        docId: d._id,
        id: d.key ?? "",
        updatedAt: d._updatedAt ?? undefined,
        title: pickBi(d.title, locale),
        desc: pickBi(d.description, locale),
        langs: d.languages ?? [],
        fileUrl: d.file?.asset?.url ?? undefined,
      };
    });
  } catch (err) {
    console.warn("[cms] resources: Sanity unreachable — using static fallback:", err);
    return staticResources(locale);
  }
}

function staticResources(locale: Locale): LibraryResource[] {
  return resources.map((r) => ({
    ...r,
    docId: `resource-${r.id}`,
    rt: RESOURCE_BADGE[r.cat],
    title: tx(locale, `${r.id}t`, r.title),
  }));
}

// ── Act page ────────────────────────────────────────────────────────────────

export async function getCampaigns(locale: Locale): Promise<ActCampaign[]> {
  // Reading draftMode() inside a 'use cache' scope makes Next bypass the
  // cache for draft requests (see the Next 16 draft-mode guide), so the
  // Presentation pane always sees the editor's latest save.
  "use cache";
  cacheTag("cms");
  cacheLife("minutes");
  const { isEnabled: preview } = await draftMode();
  const client = clientFor(preview);
  try {
    const docs = await client.fetch(campaignsQuery);
    if (!docs || docs.length === 0) throw new Error("no campaign documents");
    console.log(`[cms] campaigns: ${docs.length} docs from Sanity (${locale})`);
    return docs.map((d): ActCampaign => ({
      docId: d._id,
      icon: d.icon ?? "📣",
      i: d.order ?? 0,
      title: pickBi(d.title, locale),
      desc: pickBi(d.description, locale),
      tags: d.tags ?? [],
      btn: pickBi(d.buttonLabel, locale) || "📥 Get the Guide",
      guideUrl: d.guide?.asset?.url ?? undefined,
      topicKey: d.relatedTopic?.key ?? undefined,
      resourceKey: d.relatedResource?.key ?? undefined,
    }));
  } catch (err) {
    console.warn("[cms] campaigns: Sanity unreachable — using static fallback:", err);
    return staticCampaigns(locale);
  }
}

function staticCampaigns(locale: Locale): ActCampaign[] {
  return campaigns.map((c) => ({
    docId: `campaign-ca${c.i}`,
    icon: c.icon,
    i: c.i,
    title: tx(locale, `ca${c.i}t`, c.title),
    desc: tx(locale, `ca${c.i}d`, c.desc),
    tags: c.tags,
    btn: tx(locale, `ca${c.i}b`, "📥 Get the Guide"),
  }));
}

// ── Work page ───────────────────────────────────────────────────────────────

export type WorkContent = { episodes: WorkEpisode[]; works: WorkCard[] };

export async function getWorkContent(locale: Locale): Promise<WorkContent> {
  // Reading draftMode() inside a 'use cache' scope makes Next bypass the
  // cache for draft requests (see the Next 16 draft-mode guide), so the
  // Presentation pane always sees the editor's latest save.
  "use cache";
  cacheTag("cms");
  cacheLife("minutes");
  const { isEnabled: preview } = await draftMode();
  const client = clientFor(preview);
  try {
    const docs = await client.fetch(workItemsQuery);
    if (!docs || docs.length === 0) throw new Error("no workItem documents");
    console.log(`[cms] workItems: ${docs.length} docs from Sanity (${locale})`);
    const episodes: WorkEpisode[] = [];
    const cardItems: WorkCard[] = [];
    for (const d of docs) {
      if (d.kind === "pod") {
        episodes.push({
          docId: d._id,
          n: d.episodeNumber ?? 0,
          i: d.order ?? 0,
          title: pickBi(d.title, locale),
          dur: d.meta ?? "",
          mediaUrl: d.mediaUrl ?? undefined,
        });
      } else if (d.kind === "doc" || d.kind === "blg") {
        cardItems.push({
          docId: d._id,
          wc: d.kind,
          i: d.order ?? 0,
          icon: d.icon ?? (d.kind === "doc" ? "🎬" : "✍️"),
          badge: d.badge ?? "",
          title: pickBi(d.title, locale),
          date: d.date ?? "",
          lang: d.language ?? "",
        });
      }
    }
    return { episodes, works: cardItems };
  } catch (err) {
    console.warn("[cms] work items: Sanity unreachable — using static fallback:", err);
    return staticWork(locale);
  }
}

function staticWork(locale: Locale): WorkContent {
  return {
    episodes: episodes.map((e) => ({
      docId: `workitem-ep${e.n}`,
      n: e.n,
      i: e.i,
      title: tx(locale, `po${e.i}t`, e.title),
      dur: e.dur,
    })),
    works: works.map((w) => ({
      docId: `workitem-w${w.i}`,
      wc: w.wc,
      i: w.i,
      icon: w.icon,
      badge: w.badge,
      title: tx(locale, `w${w.i}t`, w.title),
      date: w.date,
      lang: w.lang,
    })),
  };
}

// ── Community stories (published submissions, Work page) ────────────────────

export async function getPublishedStories(locale: Locale): Promise<StoryCard[]> {
  // Reading draftMode() inside a 'use cache' scope makes Next bypass the
  // cache for draft requests (see the Next 16 draft-mode guide), so the
  // Presentation pane always sees the editor's latest save.
  "use cache";
  cacheTag("cms");
  cacheLife("minutes");
  const { isEnabled: preview } = await draftMode();
  const client = clientFor(preview);
  try {
    const docs = await client.fetch(storiesQuery);
    if (!docs) throw new Error("stories query failed");
    // Zero stories is a normal state (nothing submitted/approved yet).
    console.log(`[cms] stories: ${docs.length} published docs (${locale})`);
    return docs.map((d): StoryCard => ({
      docId: d._id,
      kind: d.kind ?? "story",
      icon: STORY_ICON[d.kind ?? "story"] ?? "✍️",
      title: locale === "sw" && d.titleSw ? d.titleSw : (d.title ?? ""),
      desc: d.description ?? "",
      author: d.authorName ?? "",
      date: d.submittedAt ? new Date(d.submittedAt).toLocaleDateString("en-GB") : "",
      href: d.sourceUrl ?? undefined,
    }));
  } catch (err) {
    console.warn("[cms] stories: Sanity unreachable — using empty list:", err);
    return [];
  }
}

// ── Site settings singleton (footer / contact / hero video) ────────────────

/** Legacy footer values — used only when Sanity is unreachable. */
const STATIC_SETTINGS: SiteSettings = {
  siteName: "Enviro-Hension",
  tagline:
    "Discover, Engage, Empower. Building environmental capacity across Kenya — in English and Kiswahili.",
  contactEmail: "info@envirohension.org",
  phone: "",
  city: "Nairobi, Kenya",
  socials: [],
  copyright: "© 2025 Enviro-Hension. All rights reserved.",
  footerNote: "Built for Kenya's environmental leaders",
  heroVideoUrl: "",
  learnIntroVideoUrl: "",
  subscribeBlurb: "Monthly digest of tools, events, and stories. No spam.",
};

export async function getSettings(locale: Locale): Promise<SiteSettings> {
  // Reading draftMode() inside a 'use cache' scope makes Next bypass the
  // cache for draft requests (see the Next 16 draft-mode guide), so the
  // Presentation pane always sees the editor's latest save.
  "use cache";
  cacheTag("cms");
  cacheLife("minutes");
  const { isEnabled: preview } = await draftMode();
  const client = clientFor(preview);
  try {
    const doc = await client.fetch(settingsQuery);
    if (!doc) throw new Error("settings document missing");
    console.log(`[cms] settings: from Sanity (${locale})`);
    return {
      siteName: doc.siteName ?? STATIC_SETTINGS.siteName,
      tagline: doc.tagline ?? STATIC_SETTINGS.tagline,
      contactEmail: doc.contactEmail ?? STATIC_SETTINGS.contactEmail,
      phone: doc.phone ?? "",
      city: doc.city ?? STATIC_SETTINGS.city,
      socials: (doc.socials ?? []).map((s) => ({
        platform: s.platform ?? "",
        icon: s.icon ?? "",
        url: s.url ?? "",
      })),
      copyright: doc.copyright ?? STATIC_SETTINGS.copyright,
      footerNote: doc.footerNote ?? STATIC_SETTINGS.footerNote,
      heroVideoUrl: doc.heroVideo?.file?.asset?.url ?? doc.heroVideo?.url ?? "",
      learnIntroVideoUrl:
        doc.learnIntroVideo?.file?.asset?.url ?? doc.learnIntroVideo?.url ?? "",
      subscribeBlurb:
        pickBiExact(doc.subscribeBlurb, locale) || tx(locale, "t-nlp", ""),
    };
  } catch (err) {
    console.warn("[cms] settings: Sanity unreachable — using static fallback:", err);
    return {
      ...STATIC_SETTINGS,
      subscribeBlurb: tx(locale, "t-nlp", STATIC_SETTINGS.subscribeBlurb),
    };
  }
}
