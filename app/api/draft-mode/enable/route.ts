import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Draft-mode entry point for Sanity Presentation.
 *
 * The Studio's preview iframe loads
 *
 *   /api/draft-mode/enable?secret=…&sanity-preview-pathname=/en/learn
 *
 * This route validates the shared secret, switches Next into draft mode (which
 * makes every `'use cache'` scope re-execute on each request — see the Next 16
 * draft-mode guide), and redirects to the page being edited.
 *
 * `SANITY_PREVIEW_SECRET` must match the value the deployment is configured
 * with. If it is unset the route refuses to enable preview rather than
 * leaving an unauthenticated bypass of the published content in place.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.SANITY_PREVIEW_SECRET;
  const { searchParams } = req.nextUrl;

  if (!secret) {
    return NextResponse.json(
      {
        error: "SANITY_PREVIEW_SECRET is not configured",
        hint: "Add SANITY_PREVIEW_SECRET to the environment to enable Presentation.",
      },
      { status: 500 },
    );
  }

  if (searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // Sanity passes the page being edited in this param; fall back to home.
  const target = searchParams.get("sanity-preview-pathname") || "/en";
  // Only allow same-origin, absolute-path redirects.
  const path = target.startsWith("/") ? target : "/en";

  const draft = await draftMode();
  draft.enable();

  redirect(path);
}
