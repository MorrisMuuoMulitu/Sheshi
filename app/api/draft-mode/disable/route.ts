import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

/**
 * Leave draft mode and return to the published content.
 *
 * `/api/draft-mode/disable?redirect=/en/learn`
 */
export async function GET(req: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  const target = req.nextUrl.searchParams.get("redirect") || "/en";
  redirect(target.startsWith("/") ? target : "/en");
}
