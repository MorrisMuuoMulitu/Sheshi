import { defineField, defineType } from "sanity";
import { bi } from "./helpers";

export const workItem = defineType({
  name: "workItem",
  title: "Work Item",
  type: "document",
  description: "Podcast episode, documentary, or blog post shown on the Our Work page.",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      description: "Stable id from the legacy site (po1…, w1…).",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "🎙️ Podcast", value: "pod" },
          { title: "🎬 Documentary", value: "doc" },
          { title: "✍️ Blog", value: "blg" },
        ],
      },
      validation: (r) => r.required(),
    }),
    bi("title", "Title"),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      description: "Card badge, e.g. “Documentary · 22min” or “Blog Post”.",
    }),
    defineField({
      name: "episodeNumber",
      title: "Episode number",
      type: "number",
      description: "Podcasts only (e.g. 14).",
      hidden: (ctx) => ctx.document?.kind !== "pod",
    }),
    defineField({
      name: "meta",
      title: "Meta line",
      type: "string",
      description: "Podcast duration/language line, e.g. “38 min · Kiswahili”.",
      hidden: (ctx) => ctx.document?.kind !== "pod",
    }),
    defineField({
      name: "date",
      title: "Display date",
      type: "string",
      description: "Legacy display date, e.g. “Feb 2025”.",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        layout: "radio",
        list: ["EN", "SW", "EN/SW"],
      },
    }),
    defineField({
      name: "icon",
      title: "Card icon (emoji)",
      type: "string",
      description: "🎬 for documentaries, ✍️ for blog posts.",
    }),
    defineField({
      name: "mediaUrl",
      title: "Media URL",
      type: "url",
      description: "Audio/video or article link (wired up in Phase 5).",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      description: "Blog post content (optional until Phase 5).",
      hidden: (ctx) => ctx.document?.kind !== "blg",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (r) => r.required().min(1),
    }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", subtitle: "kind", date: "date", num: "episodeNumber" },
    prepare: ({ title, subtitle, date, num }) => {
      const t = (title as { value?: string }[] | undefined)?.find((x) => x?.value)?.value ?? "(untitled)";
      const kind = subtitle === "pod" ? `🎙️ Ep ${num ?? "—"} ` : subtitle === "doc" ? "🎬 " : "✍️ ";
      return { title: t, subtitle: `${kind}${date ?? ""}` };
    },
  },
});
