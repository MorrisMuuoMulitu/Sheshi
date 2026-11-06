import { defineField, defineType } from "sanity";

export const story = defineType({
  name: "story",
  title: "Story",
  type: "document",
  description: "Community submissions via the Share Your Story modal (photos, templates, blueprints, stories, podcasts, videos).",
  fields: [
    defineField({
      name: "kind",
      title: "Content type",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "📷 Photos", value: "photos" },
          { title: "📄 Template", value: "template" },
          { title: "🗺️ Blueprint", value: "blueprint" },
          { title: "📖 Story", value: "story" },
          { title: "🎙️ Podcast", value: "podcast" },
          { title: "🎬 Video", value: "video" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Title / Caption", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "titleSw",
      title: "Title (Kiswahili)",
      type: "string",
      description: "Optional SW title from the upload modal (site falls back to EN when empty).",
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "authorName", title: "Your name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "email", title: "Email", type: "email", validation: (r) => r.required() }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
      description: "Link pasted instead of a file upload (upload modal).",
    }),
    defineField({
      name: "attachments",
      title: "Attachments",
      type: "array",
      of: [{ type: "image" }, { type: "file" }],
      description: "Photos and files uploaded with the submission (images, PDF, MP3, MP4, DOCX, ZIP).",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "New", value: "new" },
          { title: "Approved", value: "approved" },
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
    select: { title: "title", subtitle: "authorName", status: "status", media: "kind" },
    prepare: ({ title, subtitle, status }) => ({
      title,
      subtitle: `${status === "new" ? "🆕 " : ""}${subtitle ?? ""}`,
    }),
  },
});
