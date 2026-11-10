import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { internationalizedArray } from "sanity-plugin-internationalized-array";
import { schemaTypes, structure } from "./schemaTypes";

const languages = [
  { id: "en", title: "English" },
  { id: "sw", title: "Kiswahili" },
];

/**
 * The site the Presentation pane renders. Locally that is the Next dev
 * server; on Vercel it is the deployment URL. Set `SANITY_STUDIO_PREVIEW_URL`
 * when the Studio is deployed somewhere else.
 */
const PREVIEW_URL =
  process.env.SANITY_STUDIO_PREVIEW_URL?.replace(/\/$/, "") ?? "http://localhost:3002";

/**
 * Shared secret for the draft-mode handshake. It must match
 * `SANITY_PREVIEW_SECRET` in the Next app's environment.
 */
const PREVIEW_SECRET = process.env.SANITY_STUDIO_PREVIEW_SECRET ?? "";

/**
 * Presentation puts the real page next to the document being edited, and lets
 * an editor click any element on the page to jump to its field.
 *
 * Flow: the pane loads `/api/draft-mode/enable` once to switch the site into
 * Next draft mode — which makes every `'use cache'` scope re-execute, so the
 * editor sees their unpublished save — then keeps the iframe on the page that
 * is being edited.
 *
 * Requires: `SANITY_PREVIEW_SECRET` on the site (the enable route refuses to
 * run without it) and `SANITY_API_READ_TOKEN` so the site may read drafts.
 */
const presentation = presentationTool({
  name: "presentation",
  title: "Live preview",
  previewUrl: {
    initial: PREVIEW_URL,
    previewMode: {
      enable: `${PREVIEW_URL}/api/draft-mode/enable?secret=${encodeURIComponent(PREVIEW_SECRET)}`,
      disable: `${PREVIEW_URL}/api/draft-mode/disable`,
    },
  },
  allowOrigins: [PREVIEW_URL],
  resolve: {
    locations: {
      settings: {
        locations: [{ title: "Home", href: `${PREVIEW_URL}/en` }],
      },
      topic: {
        locations: [
          { title: "Learn", href: `${PREVIEW_URL}/en/learn` },
          { title: "Jifunze (SW)", href: `${PREVIEW_URL}/sw/learn` },
        ],
      },
      resource: {
        locations: [
          { title: "Build", href: `${PREVIEW_URL}/en/build` },
          { title: "Jenga (SW)", href: `${PREVIEW_URL}/sw/build` },
        ],
      },
      campaign: {
        locations: [
          { title: "Act", href: `${PREVIEW_URL}/en/act` },
          { title: "Tenda (SW)", href: `${PREVIEW_URL}/sw/act` },
        ],
      },
      workItem: {
        locations: [
          { title: "Our Work", href: `${PREVIEW_URL}/en/work` },
          { title: "Kazi Yetu (SW)", href: `${PREVIEW_URL}/sw/work` },
        ],
      },
      story: {
        locations: [
          { title: "Our Work", href: `${PREVIEW_URL}/en/work` },
          { title: "Kazi Yetu (SW)", href: `${PREVIEW_URL}/sw/work` },
        ],
      },
    },
  },
});

export default defineConfig({
  name: "default",
  title: "EnviroHension",
  projectId: "i9s1a5ax",
  dataset: "production",

  plugins: [
    // Presentation first — it is the tool editors use most.
    presentation,
    structureTool({ structure }),
    visionTool(),
    internationalizedArray({
      languages,
      defaultLanguages: ["en"],
      fieldTypes: ["string", "text"],
      languageFilter: {
        documentTypes: ["topic", "resource", "campaign", "workItem", "settings"],
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
