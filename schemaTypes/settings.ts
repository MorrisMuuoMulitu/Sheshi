import { defineField, defineType } from "sanity";
import { bi } from "./helpers";

export const settings = defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  description: "Singleton driving footer contact details, social links, and site chrome (Phase 5 wiring).",
  fields: [
    defineField({ name: "siteName", title: "Site name", type: "string" }),
    defineField({ name: "tagline", title: "Footer tagline", type: "text" }),
    defineField({ name: "contactEmail", title: "Contact email", type: "email" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "city", title: "City / Country", type: "string" }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          title: "Social link",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                layout: "radio",
                list: ["X", "LinkedIn", "Facebook", "Instagram", "YouTube"],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon (glyph or emoji)",
              type: "string",
              description: "Legacy glyphs: 𝕏, in, f, 📸, ▶",
            }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "copyright",
      title: "Footer copyright line",
      type: "string",
      description: "e.g. © 2025 Enviro-Hension. All rights reserved.",
    }),
    defineField({
      name: "footerNote",
      title: "Footer bottom note",
      type: "string",
      description: "e.g. Built for Kenya's environmental leaders",
    }),
    defineField({
      name: "heroVideoUrl",
      title: "Hero video URL",
      type: "url",
      description: "Home hero background video — replace the Google stock sample in Phase 5.",
    }),
    bi("subscribeBlurb", "Newsletter blurb", "text", {
      description: "Text above the newsletter input on the Contact page.",
    }),
  ],
  preview: {
    select: { title: "siteName", subtitle: "contactEmail" },
    prepare: ({ title, subtitle }) => ({ title: title ?? "Site Settings", subtitle }),
  },
});
