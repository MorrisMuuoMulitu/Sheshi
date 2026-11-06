"use client";

import { useEffect, useRef, useState } from "react";
import { T, type Locale } from "@/lib/i18n";
import { closeModal } from "@/lib/ui";

type Status = "idle" | "sending" | "ok" | "error";

/** Share-type buttons (st1…st6) → story.kind values accepted by /api/story. */
const SHARE_KINDS = ["photos", "template", "blueprint", "story", "podcast", "video"] as const;

/**
 * The two legacy modals (Share Story + Upload/CMS), ported with their
 * original markup — submit handlers now POST to the Phase 4 API routes
 * (`/api/story`, `/api/upload`) with inline success/error states.
 */
export default function Modals({ locale }: { locale: Locale }) {
  const t = T[locale];
  const [shareOpen, setShareOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  // Share modal state
  const [shareKind, setShareKind] = useState<(typeof SHARE_KINDS)[number]>("photos");
  const [shName, setShName] = useState("");
  const [shEmail, setShEmail] = useState("");
  const [shTitle, setShTitle] = useState("");
  const [shDesc, setShDesc] = useState("");
  const [shStatus, setShStatus] = useState<Status>("idle");
  const [shError, setShError] = useState("");
  const shareFilesRef = useRef<HTMLInputElement>(null);
  const [shareFiles, setShareFiles] = useState<File[]>([]);

  // Upload modal state
  const [upType, setUpType] = useState("template");
  const [upTitle, setUpTitle] = useState("");
  const [upTitleSw, setUpTitleSw] = useState("");
  const [upDesc, setUpDesc] = useState("");
  const [upEmail, setUpEmail] = useState("");
  const [upUrl, setUpUrl] = useState("");
  const [upStatus, setUpStatus] = useState<Status>("idle");
  const [upError, setUpError] = useState("");
  const upFilesRef = useRef<HTMLInputElement>(null);
  const [upFile, setUpFile] = useState<File | null>(null);

  useEffect(() => {
    const onShare = () => setShareOpen(true);
    const onUpload = (e: Event) => {
      const ctx = (e as CustomEvent<"resource" | "work">).detail;
      const sel = document.getElementById("modal-type") as HTMLSelectElement | null;
      if (sel) sel.value = ctx === "work" ? "podcast" : "template";
      setUpType(ctx === "work" ? "podcast" : "template");
      const title = document.getElementById("modal-title");
      if (title) title.textContent = ctx === "work" ? "Upload New Content" : "Add New Resource";
      setUploadOpen(true);
    };
    const onClose = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id === "share-modal") setShareOpen(false);
      if (id === "upload-modal") setUploadOpen(false);
    };
    window.addEventListener("eh:open-share", onShare);
    window.addEventListener("eh:open-upload", onUpload);
    window.addEventListener("eh:close-modal", onClose);
    return () => {
      window.removeEventListener("eh:open-share", onShare);
      window.removeEventListener("eh:open-upload", onUpload);
      window.removeEventListener("eh:close-modal", onClose);
    };
  }, []);

  const overlayClick = (close: () => void) => (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close();
  };

  const saveShare = async () => {
    if (shStatus === "sending") return;
    setShStatus("sending");
    setShError("");
    try {
      const fd = new FormData();
      fd.append("kind", shareKind);
      fd.append("title", shTitle);
      fd.append("description", shDesc);
      fd.append("name", shName);
      fd.append("email", shEmail);
      fd.append("website", ""); // honeypot
      for (const f of shareFiles) fd.append("files", f);
      const res = await fetch("/api/story", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Submission failed");
      setShStatus("ok");
      setTimeout(() => {
        setShareOpen(false);
        setShStatus("idle");
        setShName("");
        setShEmail("");
        setShTitle("");
        setShDesc("");
        setShareFiles([]);
        if (shareFilesRef.current) shareFilesRef.current.value = "";
      }, 1600);
    } catch (err) {
      setShStatus("error");
      setShError(err instanceof Error ? err.message : "Submission failed");
    }
  };

  const saveCMS = async () => {
    if (upStatus === "sending") return;
    setUpStatus("sending");
    setUpError("");
    try {
      const fd = new FormData();
      fd.append("type", upType);
      fd.append("title", upTitle);
      fd.append("titleSw", upTitleSw);
      fd.append("description", upDesc);
      fd.append("email", upEmail);
      fd.append("url", upUrl);
      fd.append("website", ""); // honeypot
      if (upFile) fd.append("files", upFile);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Submission failed");
      setUpStatus("ok");
      setTimeout(() => {
        setUploadOpen(false);
        setUpStatus("idle");
        setUpTitle("");
        setUpTitleSw("");
        setUpDesc("");
        setUpEmail("");
        setUpUrl("");
        setUpFile(null);
        if (upFilesRef.current) upFilesRef.current.value = "";
      }, 1600);
    } catch (err) {
      setUpStatus("error");
      setUpError(err instanceof Error ? err.message : "Submission failed");
    }
  };

  return (
    <>
      {/* SHARE MODAL */}
      <div
        className="modal-overlay"
        id="share-modal"
        style={{ display: shareOpen ? "flex" : "none" }}
        onClick={overlayClick(() => setShareOpen(false))}
      >
        <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="sm-title">
          <button type="button" className="modal-close" onClick={() => closeModal("share-modal")} aria-label="Close">✕</button>
          <h3 id="sm-title">{t["sm-title"] ?? "Share Your Story"}</h3>
          <p style={{ fontSize: 14, color: "rgba(0,0,0,.55)", marginBottom: 20 }} id="sm-sub">
            {t["sm-sub"] ?? "What would you like to share with the Enviro-Hension community?"}
          </p>
          <div className="share-type-grid">
            {([
              ["📸", "st1"],
              ["📄", "st2"],
              ["📐", "st3"],
              ["✍️", "st4"],
              ["🎙️", "st5"],
              ["🎬", "st6"],
            ] as const).map(([icon, key], i) => (
              <button
                type="button"
                key={key}
                className={`stype-btn${shareKind === SHARE_KINDS[i] ? " active" : ""}`}
                aria-pressed={shareKind === SHARE_KINDS[i]}
                onClick={() => setShareKind(SHARE_KINDS[i])}
              >
                <span className="sticon">{icon}</span>
                <span id={key}>{t[key] ?? key}</span>
              </button>
            ))}
          </div>
          <label className="m-lbl" id="sm-nl" htmlFor="sm-name">{t["sm-nl"] ?? "Your Name"}</label>
          <input
            id="sm-name"
            className="m-in"
            type="text"
            placeholder="Full name"
            value={shName}
            onChange={(e) => setShName(e.target.value)}
          />
          <label className="m-lbl" id="sm-el" htmlFor="sm-email">{t["sm-el"] ?? "Email"}</label>
          <input
            id="sm-email"
            className="m-in"
            type="email"
            placeholder="your@email.com"
            value={shEmail}
            onChange={(e) => setShEmail(e.target.value)}
          />
          <label className="m-lbl" id="sm-tl" htmlFor="sm-story-title">{t["sm-tl"] ?? "Title / Caption"}</label>
          <input
            id="sm-story-title"
            className="m-in"
            type="text"
            placeholder="e.g. Our river cleanup in Machakos"
            value={shTitle}
            onChange={(e) => setShTitle(e.target.value)}
          />
          <label className="m-lbl" id="sm-dl" htmlFor="sm-desc">{t["sm-dl"] ?? "Description"}</label>
          <textarea
            id="sm-desc"
            className="m-ta"
            placeholder="Tell your story..."
            value={shDesc}
            onChange={(e) => setShDesc(e.target.value)}
          />
          <button
            type="button"
            className="m-upload-area"
            onClick={() => shareFilesRef.current?.click()}
          >
            <p>
              📎 <strong>Click to attach files</strong> (photos, PDF, video, audio)
            </p>
            <p style={{ marginTop: 4, fontSize: 12 }}>
              {shareFiles.length > 0
                ? `${shareFiles.length} file(s) selected`
                : "Max 50MB per file"}
            </p>
          </button>
          <input
            type="file"
            id="share-file-inp"
            ref={shareFilesRef}
            style={{ display: "none" }}
            multiple
            accept="image/*,.pdf,.mp4,.mp3,.docx,.zip"
            onChange={(e) => setShareFiles(Array.from(e.target.files ?? []))}
          />
          {shStatus === "error" && (
            <p role="alert" style={{ color: "#b3261e", fontSize: 13, marginTop: 10 }}>
              {shError}
            </p>
          )}
          {shStatus === "ok" && (
            <p role="status" style={{ fontSize: 13, marginTop: 10 }}>
              ✅ Story submitted! Our team will review and publish it on the site.
            </p>
          )}
          <button type="button" className="m-save" onClick={saveShare} disabled={shStatus === "sending"}>
            {shStatus === "sending"
              ? "…"
              : shStatus === "ok"
                ? "Submitted ✓"
                : "Submit Story →"}
          </button>
        </div>
      </div>

      {/* UPLOAD MODAL (CMS) */}
      <div
        className="modal-overlay"
        id="upload-modal"
        style={{ display: uploadOpen ? "flex" : "none" }}
        onClick={overlayClick(() => setUploadOpen(false))}
      >
        <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button type="button" className="modal-close" onClick={() => closeModal("upload-modal")} aria-label="Close">✕</button>
          <h3 id="modal-title">Upload Content</h3>
          <label className="m-lbl" id="ml-type">{t["ml-type"] ?? "Content Type"}</label>
          <select
            className="m-sel"
            id="modal-type"
            value={upType}
            onChange={(e) => setUpType(e.target.value)}
          >
            <option value="template">Template / Blueprint</option>
            <option value="toolkit">Toolkit</option>
            <option value="zine">Zine</option>
            <option value="podcast">Podcast Episode</option>
            <option value="documentary">Documentary</option>
            <option value="blog">Blog Post</option>
          </select>
          <label className="m-lbl" id="ml-title" htmlFor="ml-title-inp">{t["ml-title"] ?? "Title (English)"}</label>
          <input
            id="ml-title-inp"
            className="m-in"
            type="text"
            placeholder="e.g. River Cleanup Blueprint v2"
            value={upTitle}
            onChange={(e) => setUpTitle(e.target.value)}
          />
          <label className="m-lbl" id="ml-title-sw" htmlFor="ml-title-sw-inp">{t["ml-title-sw"] ?? "Title (Kiswahili)"}</label>
          <input
            id="ml-title-sw-inp"
            className="m-in"
            type="text"
            placeholder="e.g. Ramani ya Kusafisha Mto v2"
            value={upTitleSw}
            onChange={(e) => setUpTitleSw(e.target.value)}
          />
          <label className="m-lbl" id="ml-desc" htmlFor="ml-desc-inp">{t["ml-desc"] ?? "Short Description"}</label>
          <textarea
            id="ml-desc-inp"
            className="m-ta"
            placeholder="Describe this resource in 1–2 sentences..."
            value={upDesc}
            onChange={(e) => setUpDesc(e.target.value)}
          />
          <label className="m-lbl" id="ml-email" htmlFor="ml-email-inp">
            {t["ml-email"] ?? "Your Email (for follow-up)"}
          </label>
          <input
            id="ml-email-inp"
            className="m-in"
            type="email"
            placeholder="your@email.com"
            value={upEmail}
            onChange={(e) => setUpEmail(e.target.value)}
          />
          <button
            type="button"
            className="m-upload-area"
            onClick={() => upFilesRef.current?.click()}
          >
            <p>
              📎 <strong>Click to choose file</strong> (PDF, MP3, MP4, DOCX…)
            </p>
            {upFile && (
              <p style={{ marginTop: 4, fontSize: 12 }}>Selected: {upFile.name}</p>
            )}
          </button>
          <input
            type="file"
            id="file-inp"
            ref={upFilesRef}
            style={{ display: "none" }}
            accept=".pdf,.mp3,.mp4,.docx,.zip"
            onChange={(e) => setUpFile(e.target.files?.[0] ?? null)}
          />
          <input
            className="m-in"
            type="url"
            aria-label="Or paste a URL instead of uploading"
            placeholder="https://... (paste URL instead of upload)"
            value={upUrl}
            onChange={(e) => setUpUrl(e.target.value)}
          />
          {upStatus === "error" && (
            <p role="alert" style={{ color: "#b3261e", fontSize: 13, marginTop: 10 }}>
              {upError}
            </p>
          )}
          {upStatus === "ok" && (
            <p role="status" style={{ fontSize: 13, marginTop: 10 }}>
              ✅ Submitted! An editor will review and publish it.
            </p>
          )}
          <button type="button" className="m-save" onClick={saveCMS} disabled={upStatus === "sending"}>
            {upStatus === "sending"
              ? "…"
              : upStatus === "ok"
                ? "Submitted ✓"
                : "Submit for Review →"}
          </button>
        </div>
      </div>
    </>
  );
}
