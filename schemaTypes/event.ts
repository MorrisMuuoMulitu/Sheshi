import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  description: "Community events submitted through the Act page (arrives with status “new”).",
  fields: [
    defineField({
      name: "name",
      title: "Event name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "location",
      title: "Location / County",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "organizer",
      title: "Organizer (name / org)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "New", value: "new" },
          { title: "Published", value: "published" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "new",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      initialValue: new Date().toISOString(),
      readOnly: true,
    }),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: {
    select: { title: "name", subtitle: "location", media: "status" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: media === "new" ? `🆕 ${subtitle ?? ""}` : subtitle,
    }),
  },
});
