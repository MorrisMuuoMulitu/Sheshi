import { defineField, defineType } from "sanity";

export const message = defineType({
  name: "message",
  title: "Message",
  type: "document",
  description: "Inbound contact-form messages and newsletter signups (arrives with status “new”).",
  fields: [
    defineField({
      name: "channel",
      title: "Channel",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Contact form", value: "contact" },
          { title: "Newsletter", value: "newsletter" },
        ],
      },
      validation: (r) => r.required(),
      initialValue: "contact",
    }),
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "email", validation: (r) => r.required() }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
      hidden: (ctx) => ctx.document?.channel === "newsletter",
    }),
    defineField({
      name: "body",
      title: "Message",
      type: "text",
      hidden: (ctx) => ctx.document?.channel === "newsletter",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "New", value: "new" },
          { title: "Read", value: "read" },
          { title: "Closed", value: "closed" },
        ],
      },
      initialValue: "new",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Created at",
      type: "datetime",
      initialValue: new Date().toISOString(),
      readOnly: true,
    }),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { title: "subject", subtitle: "name", email: "email", status: "status", channel: "channel" },
    prepare: ({ title, subtitle, email, status, channel }) => ({
      title: title || (channel === "newsletter" ? "Newsletter signup" : "(no subject)"),
      subtitle: `${status === "new" ? "🆕 " : ""}${subtitle ?? ""} · ${email ?? ""}`,
    }),
  },
});
