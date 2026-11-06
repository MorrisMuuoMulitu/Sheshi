import { defineField, defineType } from "sanity";
import { bi, bilingualTitle } from "./helpers";

export const campaign = defineType({
  name: "campaign",
  title: "Campaign",
  type: "document",
  description: "Campaign guide card on the Act page.",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      description: "Stable id from the legacy site (ca1…ca4).",
      validation: (r) => r.required().regex(/^ca[0-9]+$/, "campaign key"),
    }),
    defineField({
      name: "icon",
      title: "Icon (emoji)",
      type: "string",
      description: "Card icon, e.g. 🏞️",
    }),
    bi("title", "Title"),
    bi("description", "Description", "text"),
    bi("buttonLabel", "Button label (e.g. “Get the Guide”)"),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Small pill labels under the description.",
    }),
    defineField({
      name: "guide",
      title: "Guide file (PDF)",
      type: "file",
      description: "The downloadable guide behind the button (wired in Phase 5).",
    }),
    defineField({
      name: "relatedTopic",
      title: "Related topic",
      type: "reference",
      to: [{ type: "topic" }],
      description: "“Get the Guide” opens this Learn topic when no guide file is attached.",
    }),
    defineField({
      name: "relatedResource",
      title: "Related resource",
      type: "reference",
      to: [{ type: "resource" }],
      description: "Optional link to a library resource for this campaign.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (r) => r.required().min(1),
    }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: bilingualTitle("title"),
});
