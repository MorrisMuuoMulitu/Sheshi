/**
 * POST /api/newsletter — email signup → `message` doc (channel: newsletter).
 * Guards: honeypot + per-IP rate limit.
 */
import { errorResponse, HttpError, isHoneypotTripped, allowRequest, clientIp, requireEmail } from "@/lib/api";
import { getWriteClient, hasWriteToken } from "@/lib/sanityWrite";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    if (!allowRequest(ip)) throw new HttpError(429, "Too many submissions — please try again later.");

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) throw new HttpError(400, "Invalid request body");

    if (isHoneypotTripped(body)) return Response.json({ ok: true });

    if (!hasWriteToken()) throw new HttpError(503, "Submissions are temporarily unavailable.");

    const email = requireEmail(body.email);

    await getWriteClient().create({
      _type: "message",
      channel: "newsletter",
      email,
      status: "new",
      createdAt: new Date().toISOString(),
    });

    return Response.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
