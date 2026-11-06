/**
 * Submission guards for the public API routes (PLAN.md Phase 4.3):
 * per-IP in-memory rate limiting + honeypot detection.
 *
 * Note: the throttle is per server instance (fine for a single Vercel
 * function instance; it degrades to "best effort" under horizontal scaling —
 * acceptable for PLAN.md's "basic IP throttle" requirement).
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 8; // submissions per IP per window (all write routes share one bucket)

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/** Prune expired buckets opportunistically so the map can't grow unbounded. */
function prune(now: number) {
  if (buckets.size < 1000) return;
  for (const [ip, b] of buckets) if (b.resetAt <= now) buckets.delete(ip);
}

/** Returns true when the IP still has budget left for this window. */
export function allowRequest(ip: string): boolean {
  const now = Date.now();
  prune(now);
  const b = buckets.get(ip);
  if (!b || b.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (b.count >= MAX_PER_WINDOW) return false;
  b.count += 1;
  return true;
}

/** Client IP from headers (Vercel sets x-forwarded-for; fall back to a sentinel). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Honeypot: a hidden field real users never fill. If present/non-empty the
 * request is silently accepted (200) but dropped — bots think they succeeded.
 */
export function isHoneypotTripped(fields: Record<string, unknown>): boolean {
  const v = fields.website ?? fields.wsx ?? fields.hp;
  return typeof v === "string" && v.trim().length > 0;
}

// ── Validation helpers ──────────────────────────────────────────────────────

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function requireString(
  value: unknown,
  field: string,
  max = 5000,
  min = 1,
): string {
  if (typeof value !== "string" || value.trim().length < min) {
    throw new HttpError(400, `${field} is required`);
  }
  const v = value.trim();
  if (v.length > max) throw new HttpError(400, `${field} is too long (max ${max} characters)`);
  return v;
}

export function optionalString(value: unknown, field: string, max = 5000): string {
  if (value == null || value === "") return "";
  return requireString(value, field, max, 0);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requireEmail(value: unknown): string {
  const v = requireString(value, "email", 254).toLowerCase();
  if (!EMAIL_RE.test(v)) throw new HttpError(400, "A valid email address is required");
  return v;
}

export function requireDate(value: unknown, field: string): string {
  const v = requireString(value, field, 40);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(v))) {
    throw new HttpError(400, `${field} must be a valid date (YYYY-MM-DD)`);
  }
  return v;
}

/** Standard JSON error response — never leaks internals. */
export function errorResponse(err: unknown): Response {
  if (err instanceof HttpError) {
    return Response.json({ ok: false, error: err.message }, { status: err.status });
  }
  const msg = err instanceof Error ? err.message : String(err);
  // Sanity asset/API errors are user-fixable (bad file type, rejected upload):
  // surface a clean 4xx instead of a generic 500.
  if (/invalid image|could not process|unsupported|unprocessable/i.test(msg)) {
    return Response.json(
      { ok: false, error: "One of the files couldn't be processed — please check the file type and try again." },
      { status: 400 },
    );
  }
  console.error("[api] unexpected error:", msg);
  return Response.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
}
