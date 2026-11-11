import { defineField, defineType } from "sanity";
import { bi, bilingualTitle } from "./helpers";

export const topic = defineType({
  name: "topic",
  title: "Learn Topic",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      description: "Stable id used by the Learn page (river, trees, waste, coastal, air, energy).",
      validation: (r) => r.required().regex(/^[a-z][a-z0-9-]*$/, "key"),
    }),
    bi("title", "Title"),
    bi("intro", "Intro (topic detail page)", "text"),
    bi("cardDescription", "Card description", "text"),
    bi("stepPill", "Card step pill (e.g. “6 Steps” / “Hatua 6”)"),
    bi("level", "Level (Beginner / Intermediate / Advanced)"),
    defineField({
      name: "icon",
      title: "Card icon (emoji)",
      type: "string",
      description: "Emoji shown on the topic card, e.g. 🏞️",
    }),
    defineField({
      name: "image",
      title: "Card photo",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional photograph for this module's card and header. Leave empty and the card uses its colour + icon instead. Landscape works best (about 1600×1000).",
    }),
    defineField({
      name: "thumbClass",
      title: "Card thumbnail class",
      type: "string",
      description: "Legacy thumbnail class: th1–th6 (background artwork on the card).",
      options: { list: ["th1", "th2", "th3", "th4", "th5", "th6"] },
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [
        {
          type: "object",
          title: "Step",
          fields: [
            bi("heading", "Heading"),
            bi("body", "Body", "text"),
          ],
          preview: {
            select: { heading: "heading" },
            prepare: ({ heading }) => ({ title: (heading as { value?: string }[] | undefined)?.find((h) => h?.value)?.value ?? "Step" }),
          },
        },
      ],
    }),
    bi("resourceTitle", "Recommended resource — title", "string", {
      description: "Resource callout shown beside the topic video (legacy topic.res).",
    }),
    bi("resourceDescription", "Recommended resource — description", "text", {
      description: "Legacy topic.resD.",
    }),
    defineField({
      name: "videoFile",
      title: "Topic video (upload)",
      type: "file",
      options: { accept: "video/*" },
      description:
        "Upload the topic's video (MP4/WebM). Takes priority over the external URL. The Learn page plays it in the topic detail.",
    }),
    defineField({
      name: "videoUrl",
      title: "Topic video (external URL)",
      type: "url",
      description:
        "Alternative to uploading — link a hosted video file (MP4/WebM). Used when no file is uploaded.",
    }),
    defineField({
      name: "relatedResource",
      title: "Related resource",
      type: "reference",
      to: [{ type: "resource" }],
      description: "The topic's Download Kit button downloads this resource's file (falls back to the library).",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Position in the topic grid (1–6).",
      validation: (r) => r.required().min(1),
    }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: bilingualTitle("title"),
});
