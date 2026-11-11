import { defineField, defineType } from "sanity";
import { bi } from "./helpers";

/**
 * Site Settings — the singleton that drives the footer, contact details and
 * the two site-wide intro videos.
 *
 * Grouped so an editor can find things: Brand · Intro videos · Contact ·
 * Footer. The video slots are the ones Neema asked about — each accepts a
 * direct upload or a link, and the page degrades cleanly when either is empty.
 */
export const settings = defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  description: "Contact details, social links, and the intro videos. One document for the whole site.",
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "videos", title: "Intro videos" },
    { name: "contact", title: "Contact & social" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      group: "brand",
      description: "Shown in the footer and beside the logo.",
    }),
    defineField({
      name: "tagline",
      title: "Footer tagline",
      type: "text",
      rows: 2,
      group: "brand",
      description: "One or two sentences under the logo in the footer.",
    }),

    defineField({
      name: "heroImage",
      title: "Home page hero photograph",
      type: "image",
      group: "brand",
      options: { hotspot: true },
      description:
        "The large photograph behind the home page headline. Use a wide landscape shot (about 2400×1350). Leave empty and the site's default landscape is used.",
    }),

    // ── Videos ──────────────────────────────────────────────────────────
    defineField({
      name: "heroVideo",
      title: "Home page video",
      type: "object",
      group: "videos",
      description:
        "The “Watch: Our Story” video beside the home page headline. Upload an MP4 or WebM — or paste a direct link. Leave both empty and the page shows the logo instead.",
      fields: [
        defineField({
          name: "file",
          title: "Upload (preferred)",
          type: "file",
          options: { accept: "video/mp4,video/webm" },
          description:
            "Keep it under about 30 MB so it plays on mobile data. 720p is plenty.",
        }),
        defineField({
          name: "url",
          title: "…or link to a video file",
          type: "url",
          description:
            "Used only when nothing is uploaded. Must be a direct link to an MP4/WebM file — a YouTube or Vimeo page link will not play.",
        }),
      ],
    }),
    defineField({
      name: "learnIntroVideo",
      title: "Learn page intro video",
      type: "object",
      group: "videos",
      description:
        "The “Introduction to Environmental Action” video at the top of the Learn page. Upload an MP4 or WebM — or paste a direct link. Leaving it empty hides the video block.",
      fields: [
        defineField({
          name: "file",
          title: "Upload (preferred)",
          type: "file",
          options: { accept: "video/mp4,video/webm" },
          description:
            "Keep it under about 30 MB so it plays on mobile data. 720p is plenty.",
        }),
        defineField({
          name: "url",
          title: "…or link to a video file",
          type: "url",
          description:
            "Used only when nothing is uploaded. Must be a direct link to an MP4/WebM file — a YouTube or Vimeo page link will not play.",
        }),
      ],
    }),

    // ── Contact & social ────────────────────────────────────────────────
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "email",
      group: "contact",
    }),
    defineField({ name: "phone", title: "Phone", type: "string", group: "contact" }),
    defineField({
      name: "city",
      title: "City / Country",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      group: "contact",
      description:
        "Leave the URL empty for a platform you do not use yet — it shows as disabled rather than a broken link.",
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
              title: "Icon (legacy glyph)",
              type: "string",
              description:
                "No longer shown — the site uses the platform's real logo. Kept for old data.",
              hidden: true,
            }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
    bi("subscribeBlurb", "Newsletter blurb", "text", {
      group: "contact",
      description: "Text above the newsletter input on the Contact page.",
    }),

    // ── Footer ──────────────────────────────────────────────────────────
    defineField({
      name: "copyright",
      title: "Footer copyright line",
      type: "string",
      group: "footer",
      description: "e.g. © 2025 Enviro-Hension. All rights reserved.",
    }),
    defineField({
      name: "footerNote",
      title: "Footer bottom note",
      type: "string",
      group: "footer",
      description: "e.g. Built for Kenya's environmental leaders",
    }),
  ],
  preview: {
    select: { title: "siteName", subtitle: "contactEmail" },
    prepare: ({ title, subtitle }) => ({ title: title ?? "Site Settings", subtitle }),
  },
});
