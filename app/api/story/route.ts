/**
 * POST /api/story — Share-Your-Story modal (multipart) → Sanity asset uploads
 * + `story` doc with status: new (PLAN.md Phase 4.2).
 *
 * Guards: honeypot + per-IP rate limit. Files: max 10 per submission,
 * 50MB each (matches the modal's stated limit).
 */
import {
  allowRequest,
  clientIp,
  errorResponse,
  HttpError,
  isHoneypotTripped,
  optionalString,
  requireEmail,
  requireString,
} from "@/lib/api";
import { getWriteClient, hasWriteToken } from "@/lib/sanityWrite";

const MAX_FILES = 10;
const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB — matches the modal copy

/** Share-modal type buttons (st1…st6) → story.kind values. */
const KIND_MAP: Record<string, string> = {
  st1: "photos",
  photos: "photos",
  st2: "template",
  template: "template",
  st3: "blueprint",
  blueprint: "blueprint",
  st4: "story",
  story: "story",
  st5: "podcast",
  podcast: "podcast",
  st6: "video",
  video: "video",
};

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    if (!allowRequest(ip)) throw new HttpError(429, "Too many submissions — please try again later.");

    const form = await req.formData().catch(() => null);
    if (!form) throw new HttpError(400, "Invalid request body (expected multipart form data)");

    // Honeypot: pretend success, store nothing.
    if (isHoneypotTripped(Object.fromEntries(form.entries()))) {
      return Response.json({ ok: true });
    }

    if (!hasWriteToken()) throw new HttpError(503, "Submissions are temporarily unavailable.");

    const kindRaw = String(form.get("kind") ?? "story");
    const kind = KIND_MAP[kindRaw] ?? "story";
    const title = requireString(form.get("title"), "title", 300);
    const description = optionalString(form.get("description"), "description", 5000);
    const authorName = requireString(form.get("name"), "name", 200);
    const email = requireEmail(form.get("email"));

    const client = getWriteClient();

    // Upload attachments: images → image asset, everything else → file asset.
    const attachments: Array<Record<string, unknown>> = [];
    const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length > MAX_FILES) throw new HttpError(400, `At most ${MAX_FILES} files per submission`);
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        throw new HttpError(413, `"${file.name}" is larger than 50MB`);
      }
      const isImage = file.type.startsWith("image/");
      const asset = await client.assets.upload(
        isImage ? "image" : "file",
        file,
        { filename: file.name },
      );
      attachments.push({
        _type: isImage ? "image" : "file",
        asset: { _type: "reference", _ref: asset._id },
      });
    }

    await client.create({
      _type: "story",
      kind,
      title,
      description,
      authorName,
      email,
      attachments,
      status: "new",
      submittedAt: new Date().toISOString(),
    });

    return Response.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
