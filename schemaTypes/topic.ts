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
