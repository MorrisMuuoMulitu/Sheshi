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
};

export type LibraryResource = Resource & { rt: string };

export type ActCampaign = {
  icon: string;
  i: number;
  title: string;
  desc: string;
  tags: string[];
  btn: string;
};

export type WorkEpisode = { n: number; i: number; title: string; dur: string };

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
