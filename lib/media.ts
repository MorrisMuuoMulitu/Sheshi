/**
 * Media helpers for the in-app viewer.
 *
 * Everything the library offers — PDFs, video, audio, images, and links to
 * documents we cannot render ourselves — opens inside the site first. A
 * download stays available, but it is the fallback, not the default.
 */

export type MediaKind = "video" | "audio" | "pdf" | "image" | "document" | "link" | "unknown";

const EXT: Record<string, MediaKind> = {
  mp4: "video",
  webm: "video",
  mov: "video",
  m4v: "video",
  mp3: "audio",
  wav: "audio",
  m4a: "audio",
  ogg: "audio",
  pdf: "pdf",
  png: "image",
  jpg: "image",
  jpeg: "image",
  webp: "image",
  avif: "image",
  gif: "image",
  doc: "document",
  docx: "document",
  ppt: "document",
  pptx: "document",
  xls: "document",
  xlsx: "document",
  odt: "document",
  ods: "document",
  odp: "document",
};

/** A file extension from a URL, ignoring query strings and content hashes. */
export function extensionOf(url: string): string {
  const path = url.split("?")[0].split("#")[0];
  const last = path.split("/").pop() ?? "";
  return last.includes(".") ? (last.split(".").pop() ?? "").toLowerCase() : "";
}

/** Classify a URL so the viewer can choose a renderer. */
export function mediaKind(url: string, fallback: MediaKind = "unknown"): MediaKind {
  const ext = extensionOf(url);
  if (EXT[ext]) return EXT[ext];
  if (/\.(mp4|webm)(\?|$)/i.test(url)) return "video";
  if (/\.pdf(\?|$)/i.test(url)) return "pdf";
  if (/^https?:\/\//.test(url)) return "link";
  return fallback;
}

/** A human filename for the download attribute. */
export function downloadName(url: string, title: string): string {
  const ext = extensionOf(url) || "pdf";
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "download";
  return `${slug}.${ext}`;
}

/** Force a download (used by the download buttons). */
export function forceDownloadHref(url: string, title: string): string {
  // cdn.sanity.io honours ?dl=<name> (Content-Disposition: attachment).
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}dl=${encodeURIComponent(downloadName(url, title))}`;
}

/** Human label for the viewer header. */
export function kindLabel(kind: MediaKind, isEn: boolean): string {
  const en: Record<MediaKind, string> = {
    video: "Video",
    audio: "Audio",
    pdf: "PDF document",
    image: "Image",
    document: "Document",
    link: "Link",
    unknown: "File",
  };
  const sw: Record<MediaKind, string> = {
    video: "Video",
    audio: "Sauti",
    pdf: "Hati ya PDF",
    image: "Picha",
    document: "Hati",
    link: "Kiungo",
    unknown: "Faili",
  };
  return (isEn ? en : sw)[kind];
}

/** True when the viewer can render the file itself rather than offering a link. */
export function canPreview(kind: MediaKind): boolean {
  return kind === "video" || kind === "audio" || kind === "pdf" || kind === "image";
}
