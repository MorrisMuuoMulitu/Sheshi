/**
 * POST /api/upload — Build/Work "add content" modal (multipart) → asset upload
 * + `story` doc with status: new (PLAN.md Phase 4.2).
 *
 * Same guards as /api/story. Accepts either a file or a pasted URL
 * (at least one required). The editor reviews it under Submissions and
 * publishes; content then flows into the site via the normal CMS queries.
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

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB

/** Upload-modal <select> values → story.kind values. */
const KIND_MAP: Record<string, string> = {
  template: "template",
  toolkit: "blueprint",
  zine: "story",
  podcast: "podcast",
  documentary: "video",
  blog: "story",
};

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    if (!allowRequest(ip)) throw new HttpError(429, "Too many submissions — please try again later.");

    const form = await req.formData().catch(() => null);
    if (!form) throw new HttpError(400, "Invalid request body (expected multipart form data)");

    if (isHoneypotTripped(Object.fromEntries(form.entries()))) {
      return Response.json({ ok: true });
    }

    if (!hasWriteToken()) throw new HttpError(503, "Submissions are temporarily unavailable.");

    const typeRaw = String(form.get("type") ?? "template");
    const kind = KIND_MAP[typeRaw] ?? "template";
    const title = requireString(form.get("title"), "title", 300);
    const titleSw = optionalString(form.get("titleSw"), "title (Kiswahili)", 300);
    const description = optionalString(form.get("description"), "description", 5000);
    const email = requireEmail(form.get("email"));
    const sourceUrl = optionalString(form.get("url"), "url", 2000);

    const file = form.getAll("files").find((f): f is File => f instanceof File && f.size > 0);
    if (!file && !sourceUrl) {
      throw new HttpError(400, "Attach a file or paste a URL");
    }

    const client = getWriteClient();

    let attachments: Array<Record<string, unknown>> = [];
    if (file) {
      if (file.size > MAX_FILE_BYTES) throw new HttpError(413, `"${file.name}" is larger than 50MB`);
      const isImage = file.type.startsWith("image/");
      const asset = await client.assets.upload(isImage ? "image" : "file", file, {
        filename: file.name,
      });
      attachments = [
        { _type: isImage ? "image" : "file", asset: { _type: "reference", _ref: asset._id } },
      ];
    }

    await client.create({
      _type: "story",
      kind,
      title,
      ...(titleSw ? { titleSw } : {}),
      ...(description ? { description } : {}),
      authorName: optionalString(form.get("name"), "name", 200) || "Community submission",
      email,
      ...(sourceUrl ? { sourceUrl } : {}),
      ...(attachments.length ? { attachments } : {}),
      status: "new",
      submittedAt: new Date().toISOString(),
    });

    return Response.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
