/**
 * Page view-model shapes for the content pages (Phase 3). These mirror the
 * legacy inline data shapes exactly, so the ported views render identically.
 *
 * Plain types only — imported by both server (`lib/cms.ts`) and client
 * (`components/pages/*View.tsx`), so no runtime imports from server modules.
 */
import type { Resource } from "./content";

export type { Resource };

export type Bi = "en" | "sw";

export type LearnStep = { h: string; p: string };

export type LearnTopic = {
  key: string;
  i: number;
  thumb: string;
  icon: string;
  title: string;
  /** Card description (CMS cardDescription / legacy tc-dN). */
  desc: string;
  /** Card pill, e.g. “6 Steps” / “Hatua 6”. */
  pill: string;
  level: string;
  intro: string;
  steps: LearnStep[];
  res: string;
  resD: string;
  /** Topic video URL (uploaded file or external link) — null when not set. */
  videoUrl?: string;
  /** Direct download URL of the related resource's file, when set. */
  kitFileUrl?: string;
  /** Related resource key — used for the fallback link to the library. */
  kitResKey?: string;
};

export type LibraryResource = Resource & {
  rt: string;
  /** Sanity file URL powering the Download button (undefined → disabled). */
  fileUrl?: string;
};

export type ActCampaign = {
  icon: string;
  i: number;
  title: string;
  desc: string;
  tags: string[];
  btn: string;
  /** Guide file URL — “Get the Guide” downloads it when set. */
  guideUrl?: string;
  /** Related topic key — button opens /learn?topic=… when no file. */
  topicKey?: string;
  /** Related resource key — button opens /build when no file/topic. */
  resourceKey?: string;
};

export type WorkEpisode = {
  n: number;
  i: number;
  title: string;
  dur: string;
  /** Real audio URL — the ▶ button plays it when set (otherwise disabled). */
  mediaUrl?: string;
};

export type WorkCard = {
  wc: "doc" | "blg";
  i: number;
  icon: string;
  badge: string;
  title: string;
  date: string;
  lang: string;
};

/** A published community story (Work page section). */
export type StoryCard = {
  kind: string;
  icon: string;
  title: string;
  desc: string;
  author: string;
  date: string;
  href?: string;
};

/** Badge label per resource category (legacy `rt` values). */
export const RESOURCE_BADGE: Record<Resource["cat"], string> = {
  tp: "📄 Template",
  kt: "🧰 Toolkit",
  zn: "📰 Zine",
};

/**
 * Site settings singleton (footer contact, socials, hero video).
 * `socials[].url` empty means “not configured yet” → rendered disabled.
 */
export type SiteSettings = {
  siteName: string;
  tagline: string;
  contactEmail: string;
  phone: string;
  city: string;
  socials: { platform: string; icon: string; url: string }[];
  copyright: string;
  footerNote: string;
  heroVideoUrl: string;
  /** Learn page “Introduction to Environmental Action” video (optional). */
  learnIntroVideoUrl: string;
  subscribeBlurb: string;
};

/**
 * Force a Sanity CDN file download with a friendly filename.
 * cdn.sanity.io honors `?dl=<name>` (Content-Disposition: attachment).
 */
export function downloadHref(url: string, title: string): string {
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "download";
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}dl=${encodeURIComponent(`${slug}.pdf`)}`;
}
