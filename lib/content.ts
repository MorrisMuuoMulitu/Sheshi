/**
 * Shared legacy-derived content arrays, moved out of the page components so
 * that both the pages (until Phase 3 switches them to Sanity reads) and
 * `scripts/seed.ts` consume a single source of truth.
 *
 * Bilingual title/description strings for these items live in `lib/i18n.ts`
 * under the keys referenced here (`r1t…`, `ca1t/d/b…`, `po1t…`, `w1t…`).
 */

export type Resource = {
  cat: "tp" | "kt" | "zn";
  rt: string;
  id: string;
  title: string;
  desc: string;
  langs: string[];
};

export const resources: Resource[] = [
  { cat: "tp", rt: "📄 Template", id: "r1", title: "Event Planning Checklist", desc: "Step-by-step organizer with roles, timelines, and logistics for community events.", langs: ["en", "sw"] },
  { cat: "kt", rt: "🧰 Toolkit", id: "r2", title: "River Cleanup Field Kit", desc: "Complete blueprint: equipment lists, safety protocol, volunteer briefings.", langs: ["en", "sw"] },
  { cat: "zn", rt: "📰 Zine", id: "r3", title: "Maji ni Uhai", desc: "Print-ready A5 community zine on water conservation — in Kiswahili.", langs: ["sw"] },
  { cat: "kt", rt: "🧰 Toolkit", id: "r4", title: "Advocacy & Media Guide", desc: "How to engage local media, write press releases, and run effective social campaigns.", langs: ["en", "sw"] },
  { cat: "tp", rt: "📄 Template", id: "r5", title: "Community Action Plan", desc: "6-month environmental action plan with goals, milestones, and KPI tracking.", langs: ["en", "sw"] },
  { cat: "zn", rt: "📰 Zine", id: "r6", title: "Youth Climate Voices", desc: "Stories from young Kenyan environmental leaders. Bilingual A5 print-ready zine.", langs: ["en", "sw"] },
];

export type Campaign = {
  icon: string;
  i: number;
  title: string;
  desc: string;
  tags: string[];
};

export const campaigns: Campaign[] = [
  { icon: "🏞️", i: 1, title: "River Cleanup Campaign", desc: "Full mobilization guide: pre-event, event day, and follow-up. Proven for 200+ volunteers.", tags: ["Planning", "Volunteers", "Logistics"] },
  { icon: "🌳", i: 2, title: "Tree Planting Drive", desc: "Coordinate large-scale planting with schools, county governments, and businesses.", tags: ["Partnerships", "Schools", "Govt"] },
  { icon: "♻️", i: 3, title: "Zero Waste Community", desc: "Waste audit templates, segregation campaigns, and how to engage local authorities.", tags: ["Waste Audit", "Education"] },
  { icon: "🤝", i: 4, title: "Start a Local Chapter", desc: "How to register and run an environmental community group in your constituency.", tags: ["Registration", "Governance"] },
];

export type Episode = { n: number; i: number; title: string; dur: string };

export const episodes: Episode[] = [
  { n: 14, i: 1, title: "Mazungumzo: Mto Nairobi Leo", dur: "38 min · Kiswahili" },
  { n: 13, i: 2, title: "Forests, Floods & Community Power", dur: "44 min · English" },
  { n: 12, i: 3, title: "Youth Voices: The Next Green Generation", dur: "31 min · EN/SW" },
];

export type Work = {
  wc: "doc" | "blg";
  i: number;
  icon: string;
  badge: string;
  title: string;
  date: string;
  lang: string;
};

export const works: Work[] = [
  { wc: "doc", i: 1, icon: "🎬", badge: "Documentary · 22min", title: "The Kerio Valley Restoration Project", date: "Feb 2025", lang: "EN/SW" },
  { wc: "doc", i: 2, icon: "🎬", badge: "Documentary · 35min", title: "Salt of the Earth: Coastal Women Leaders", date: "Nov 2024", lang: "EN/SW" },
  { wc: "blg", i: 3, icon: "✍️", badge: "Blog Post", title: "Why Youth Leadership Is the Climate Solution Kenya Needs", date: "Jan 2025", lang: "EN" },
  { wc: "blg", i: 4, icon: "✍️", badge: "Blog Post", title: "Hali ya Hewa Nairobi: Ripoti ya Jamii", date: "Dec 2024", lang: "SW" },
];
