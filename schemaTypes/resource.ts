import { defineField, defineType } from "sanity";
import { bi } from "./helpers";

export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "string",
      description: "Stable id from the legacy library (r1…r6) — used by translation keys.",
      validation: (r) => r.required().regex(/^r[0-9]+$/, "resource key"),
    }),
    bi("title", "Title"),
    bi("description", "Description", "text"),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Determines the badge and the Build-page filter.",
      options: {
        layout: "radio",
        list: [
          { title: "📄 Template", value: "tp" },
          { title: "🧰 Toolkit", value: "kt" },
          { title: "📰 Zine", value: "zn" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "languages",
      title: "Available languages",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            layout: "radio",
            list: [
              { title: "EN", value: "en" },
              { title: "SW", value: "sw" },
            ],
          },
        },
      ],
      options: { layout: "tags" },
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "file",
      title: "Download file (PDF)",
      type: "file",
      description: "Uploaded file powering the Download button (wired in Phase 5).",
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
    select: { title: "title", subtitle: "category" },
    prepare: ({ title, subtitle }) => ({
      title: (title as { value?: string }[] | undefined)?.find((t) => t?.value)?.value ?? "(untitled)",
      subtitle: subtitle === "tp" ? "Template" : subtitle === "kt" ? "Toolkit" : subtitle === "zn" ? "Zine" : "",
    }),
  },
});
