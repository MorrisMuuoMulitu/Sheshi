/**
 * POST /api/event — Act-page event submission → `event` doc (status: new).
 * Guards: honeypot + per-IP rate limit.
 */
import { errorResponse, HttpError, isHoneypotTripped, allowRequest, clientIp, requireDate, requireString } from "@/lib/api";
import { getWriteClient, hasWriteToken } from "@/lib/sanityWrite";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    if (!allowRequest(ip)) throw new HttpError(429, "Too many submissions — please try again later.");

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) throw new HttpError(400, "Invalid request body");

    if (isHoneypotTripped(body)) return Response.json({ ok: true });

    if (!hasWriteToken()) throw new HttpError(503, "Submissions are temporarily unavailable.");

    const name = requireString(body.name, "event name", 300);
    const location = requireString(body.location, "location", 200);
    const date = requireDate(body.date, "date");
    const organizer = requireString(body.organizer, "organizer", 200);

    await getWriteClient().create({
      _type: "event",
      name,
      location,
      date,
      organizer,
      status: "new",
      submittedAt: new Date().toISOString(),
    });

    return Response.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
