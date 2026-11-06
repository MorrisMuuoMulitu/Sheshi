/**
 * POST /api/contact — contact form → `message` doc (channel: contact, status: new).
 * Guards: honeypot + per-IP rate limit (lib/api.ts).
 */
import { errorResponse, HttpError, isHoneypotTripped, allowRequest, clientIp, requireEmail, requireString } from "@/lib/api";
import { getWriteClient, hasWriteToken } from "@/lib/sanityWrite";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    if (!allowRequest(ip)) throw new HttpError(429, "Too many submissions — please try again later.");

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) throw new HttpError(400, "Invalid request body");

    // Honeypot: pretend success, store nothing.
    if (isHoneypotTripped(body)) return Response.json({ ok: true });

    if (!hasWriteToken()) throw new HttpError(503, "Submissions are temporarily unavailable.");

    const name = requireString(body.name, "name", 200);
    const email = requireEmail(body.email);
    const subject = requireString(body.subject, "subject", 300);
    const message = requireString(body.body ?? body.message, "message", 5000);

    await getWriteClient().create({
      _type: "message",
      channel: "contact",
      name,
      email,
      subject,
      body: message,
      status: "new",
      createdAt: new Date().toISOString(),
    });

    return Response.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
