import { createClient } from "@sanity/client";

/**
 * Read-only Sanity client for the Next.js app (PLAN.md D2/Phase 3.1).
 *
 * - pinned apiVersion for stable query behavior
 * - `useCdn: true` for edge-cached reads; the app's own 'use cache' layer
 *   (lib/cms.ts) sits on top with a 1-minute life + on-demand tag revalidation
 * - public dataset → no token required for published content
 */
export const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_PROJECT_ID ?? "i9s1a5ax";
export const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? process.env.SANITY_DATASET ?? "production";
export const SANITY_API_VERSION = "2026-11-06";

/** Where the Studio lives — the visual-editing overlay talks to this origin. */
export const SANITY_STUDIO_URL =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "https://envirohension.sanity.studio";

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN || undefined,
});

/**
 * Fields whose exact value the application logic depends on.
 *
 * Stega encoding appends invisible characters to strings so the preview
 * overlay can map a clicked element back to its field. That is harmless for
 * text that is only displayed, but it would break anything the code compares
 * or uses as a key — filtering by `category`, resolving an icon from `icon`,
 * following a `url`, or a `?topic=<key>` deep link.
 *
 * Encoding is skipped when ANY segment of a value's source path is listed
 * here, which also covers nested projections such as `relatedResource->{ key }`.
 */
const NEVER_ENCODE = new Set([
  "_id",
  "_type",
  "key",
  "slug",
  "icon",
  "thumbClass",
  "category",
  "languages",
  "lang",
  "platform",
  "kind",
  "wc",
  "order",
  "url",
  "asset",
  "href",
  "mediaUrl",
  "videoUrl",
  "guideUrl",
  "fileUrl",
  "imageUrl",
  "status",
]);

/**
 * Editor preview client — used only inside draft mode (Sanity Presentation).
 *
 * The `drafts` perspective returns unpublished edits in place of the published
 * version (and documents that were never published). It requires a read token
 * and must not use the CDN, or the editor would see stale content.
 *
 * `stega` is what makes click-to-edit work: every displayed string carries an
 * invisible marker identifying its document and field path, which the
 * `<VisualEditing />` overlay reads to jump the Studio to that field.
 */
export const hasPreviewToken = Boolean(process.env.SANITY_API_READ_TOKEN);

export const previewClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN || undefined,
  perspective: "drafts",
  stega: {
    enabled: true,
    studioUrl: SANITY_STUDIO_URL,
    filter: ({ sourcePath }) =>
      !sourcePath.some((segment) => typeof segment === "string" && NEVER_ENCODE.has(segment)),
  },
});

/** Pick the client for the current request. */
export function clientFor(preview: boolean) {
  return preview ? previewClient : sanityClient;
}
