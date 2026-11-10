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

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN || undefined,
});

/**
 * Editor preview client — used only inside draft mode (Sanity Presentation).
 *
 * The `drafts` perspective returns unpublished edits in place of the published
 * version (and documents that were never published). It requires a read token
 * and must not use the CDN, or the editor would see stale content.
 *
 * Without a token the client still works, but it only sees published
 * documents — the preview pane then shows the live site rather than the draft.
 * `hasPreviewToken` lets callers warn about that once.
 */
export const hasPreviewToken = Boolean(process.env.SANITY_API_READ_TOKEN);

export const previewClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN || undefined,
  perspective: "drafts",
});

/** Pick the client for the current request. */
export function clientFor(preview: boolean) {
  return preview ? previewClient : sanityClient;
}
