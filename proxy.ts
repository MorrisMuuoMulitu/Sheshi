import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "sw"];

/**
 * Locale routing (plan decision D7): everything lives under /en/... or /sw/...
 * Bare paths redirect to the preferred locale from Accept-Language (default en).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Already localized — pass through.
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return;
  }

  const accept = (request.headers.get("accept-language") ?? "").toLowerCase();
  const preferred = accept.includes("sw") ? "sw" : "en";
  const rest = pathname === "/" ? "" : pathname;

  return NextResponse.redirect(new URL(`/${preferred}${rest}`, request.url));
}

export const config = {
  // Skip Next internals, API routes, and files (anything with a dot).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
