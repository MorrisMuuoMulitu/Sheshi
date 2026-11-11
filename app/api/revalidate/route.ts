import { revalidateTag } from "next/cache";

/**
 * On-demand revalidation webhook (PLAN.md Phase 3.2).
 *
 * Point a Sanity webhook at it:
 *   https://<your-site>/api/revalidate
 *   trigger: <dataset>.mutate (create/update/delete)
 *   header:  x-revalidate-secret: $REVALIDATE_SECRET
 *
 * Or curl it after content changes:
 *   curl -X POST https://<site>/api/revalidate \
 *        -H "x-revalidate-secret: $REVALIDATE_SECRET"
 *
 * Invalidates the 'cms' cache tag used by every getter in lib/cms.ts.
 */
const secret = process.env.REVALIDATE_SECRET;

export async function POST(req: Request) {
  if (!secret) {
    return Response.json(
      { error: "REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  const headerSecret = req.headers.get("x-revalidate-secret");
  const body = (await req.json().catch(() => null)) as { secret?: string } | null;
  if (headerSecret !== secret && body?.secret !== secret) {
    return Response.json({ error: "Invalid secret" }, { status: 401 });
  }

  // Two-arg form is required in Next 16. `expire: 0` makes the tag expire
  // immediately (a webhook wants "publish → live now"; the "max" profile would
  // serve stale content until the 1-minute cacheLife window elapses).
  // `expire: 0` makes the entry immediately stale, which the App Router's
  // client navigation cannot always resolve — a visitor navigating while a
  // webhook fires gets "This page couldn't load". A short non-zero window
  // keeps publish-to-live effectively immediate without that edge case.
  revalidateTag("cms", { expire: 30 });
  // Also mark the prerendered route output stale: on Vercel the CDN holds the
  // static HTML separately from the `use cache` entries, so tag invalidation
  // alone leaves the edge copy in place.
  //
  // Revalidate the pages explicitly rather than with `revalidatePath("/",
  // "layout")`: invalidating the whole layout leaves the App Router's client
  // navigation broken for the next visitor (the route tree ends up showing
  // "This page couldn't load"). Content only lives on these routes.
  // `revalidatePath("/", "layout")` is deliberately not used: invalidating the
  // whole layout breaks client navigation for the next visitor. The tag above
  // covers every getter in lib/cms.ts.
  return Response.json({ revalidated: true, time: new Date().toISOString() });
}

export async function GET() {
  return Response.json({ error: "Use POST" }, { status: 405 });
}
