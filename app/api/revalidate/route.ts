import { revalidatePath, revalidateTag } from "next/cache";

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
  revalidateTag("cms", { expire: 0 });
  // Also mark the prerendered route output stale: on Vercel the CDN holds the
  // static HTML separately from the `use cache` entries, so tag invalidation
  // alone leaves the edge copy in place. The root layout covers every page.
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, time: new Date().toISOString() });
}

export async function GET() {
  return Response.json({ error: "Use POST" }, { status: 405 });
}
