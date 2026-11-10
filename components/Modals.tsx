"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, FileText, Film, Link2, Loader2, Mic, PenLine, X } from "lucide-react";
import { T, type Locale } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

type Status = "idle" | "sending" | "ok" | "error";

/** Share-type buttons (st1…st6) → story.kind values accepted by /api/story. */
const SHARE_KINDS = ["photos", "template", "blueprint", "story", "podcast", "video"] as const;

const SHARE_ICONS = [Camera, FileText, Link2, PenLine, Mic, Film];

/**
 * The two legacy modals (Share Story + Upload/CMS), ported with their
 * original markup — submit handlers now POST to the Phase 4 API routes
 * (`/api/story`, `/api/upload`) with inline success/error states.
 *
 * Accessibility (ui-ux-pro-max §1 `escape-routes`, §8 `focus-management`):
 * both dialogs trap focus, close on Escape, restore focus to the trigger,
 * and lock the page behind them.
 */
export default function Modals({ locale }: { locale: Locale }) {
  const t = T[locale];
  const isEn = locale === "en";
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

  // Remember what had focus before a dialog opened, to restore it on close.
  const lastFocused = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onShare = () => {
      lastFocused.current = document.activeElement as HTMLElement | null;
      setShareOpen(true);
    };
    const onUpload = (e: Event) => {
      const ctx = (e as CustomEvent<"resource" | "work">).detail;
      const sel = document.getElementById("modal-type") as HTMLSelectElement | null;
      if (sel) sel.value = ctx === "work" ? "podcast" : "template";
      setUpType(ctx === "work" ? "podcast" : "template");
      const title = document.getElementById("modal-title");
      if (title) title.textContent = ctx === "work" ? "Upload New Content" : "Add New Resource";
      lastFocused.current = document.activeElement as HTMLElement | null;
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

  // Focus trap + Escape + scroll lock while a dialog is open.
  useEffect(() => {
    const open = shareOpen || uploadOpen;
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (shareOpen) setShareOpen(false);
        else setUploadOpen(false);
        lastFocused.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    // Move focus into the dialog so screen readers announce it. The first
    // focusable control is preferred over the container itself.
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]',
    );
    (firstFocusable ?? dialogRef.current)?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [shareOpen, uploadOpen]);

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
        lastFocused.current?.focus();
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
        lastFocused.current?.focus();
      }, 1600);
    } catch (err) {
      setUpStatus("error");
      setUpError(err instanceof Error ? err.message : "Submission failed");
    }
  };

  return (
    <>
      {/* SHARE MODAL */}
      {shareOpen && (
        <div
          className="modal-overlay"
          id="share-modal"
          onClick={overlayClick(() => setShareOpen(false))}
        >
          <div
            ref={shareOpen ? dialogRef : undefined}
            className="modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sm-title"
            aria-describedby="sm-sub"
            tabIndex={-1}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => {
                setShareOpen(false);
                lastFocused.current?.focus();
              }}
              aria-label={isEn ? "Close dialog" : "Funga mazungumzo"}
            >
              <X aria-hidden="true" />
            </button>
            <h2 id="sm-title">{t["sm-title"] ?? "Share Your Story"}</h2>
            <p className="modal-sub" id="sm-sub">
              {t["sm-sub"] ?? "What would you like to share with the Enviro-Hension community?"}
            </p>

            <div className="choice-grid">
              {SHARE_ICONS.map((IconCmp, i) => {
                const key = `st${i + 1}`;
                const kind = SHARE_KINDS[i];
                return (
                  <button
                    type="button"
                    key={key}
                    className={`choice${shareKind === kind ? " is-active" : ""}`}
                    aria-pressed={shareKind === kind}
                    onClick={() => setShareKind(kind)}
                  >
                    <IconCmp aria-hidden="true" />
                    <span id={key}>{t[key] ?? key}</span>
                  </button>
                );
              })}
            </div>

            <div className="stack stack-4">
              <div className="field">
                <label className="field-label" id="sm-nl" htmlFor="sm-name">
                  {t["sm-nl"] ?? "Your Name"}
                </label>
                <input
                  id="sm-name"
                  className="input"
                  type="text"
                  autoComplete="name"
                  placeholder={isEn ? "Full name" : "Jina kamili"}
                  value={shName}
                  onChange={(e) => setShName(e.target.value)}
                />
              </div>
              <div className="field">
                <label className="field-label" id="sm-el" htmlFor="sm-email">
                  {t["sm-el"] ?? "Email"}
                </label>
                <input
                  id="sm-email"
                  className="input"
                  type="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={shEmail}
                  onChange={(e) => setShEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <label className="field-label" id="sm-tl" htmlFor="sm-story-title">
                  {t["sm-tl"] ?? "Title / Caption"}
                </label>
                <input
                  id="sm-story-title"
                  className="input"
                  type="text"
                  placeholder={
                    isEn ? "e.g. Our river cleanup in Machakos" : "Mfano: kusafisha mto Machakos"
                  }
                  value={shTitle}
                  onChange={(e) => setShTitle(e.target.value)}
                />
              </div>
              <div className="field">
                <label className="field-label" id="sm-dl" htmlFor="sm-desc">
                  {t["sm-dl"] ?? "Description"}
                </label>
                <textarea
                  id="sm-desc"
                  className="textarea"
                  placeholder={isEn ? "Tell your story..." : "Simulia hadithi yako..."}
                  value={shDesc}
                  onChange={(e) => setShDesc(e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              className="dropzone"
              style={{ marginTop: "var(--space-4)" }}
              onClick={() => shareFilesRef.current?.click()}
            >
              <Icon name="paperclip" size={22} />
              <span>
                <strong>{isEn ? "Click to attach files" : "Bofya kuambatisha faili"}</strong>
                {isEn ? " (photos, PDF, video, audio)" : " (picha, PDF, video, sauti)"}
              </span>
              <span className="text-xs">
                {shareFiles.length > 0
                  ? `${shareFiles.length} file(s) selected`
                  : isEn
                    ? "Max 50MB per file"
                    : "Kioyo cha 50MB kwa kila faili"}
              </span>
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
              <p className="form-status form-status-error" role="alert" style={{ marginTop: 12 }}>
                <Icon name="error" size={16} />
                {shError}
              </p>
            )}
            {shStatus === "ok" && (
              <p className="form-status form-status-success" role="status" style={{ marginTop: 12 }}>
                <CheckCircle2 size={16} aria-hidden="true" />
                {isEn
                  ? "Story submitted! Our team will review and publish it on the site."
                  : "Hadithi imetumwa! Timu yetu itaipitisha kwenye tovuti."}
              </p>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={saveShare}
                disabled={shStatus === "sending"}
              >
                {shStatus === "sending" ? (
                  <Loader2 size={16} aria-hidden="true" className="spin" />
                ) : null}
                {shStatus === "sending"
                  ? isEn
                    ? "Sending…"
                    : "Inatuma…"
                  : shStatus === "ok"
                    ? isEn
                      ? "Submitted ✓"
                      : "Imetumwa ✓"
                    : isEn
                      ? "Submit Story →"
                      : "Tuma Hadithi →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL (CMS) */}
      {uploadOpen && (
        <div
          className="modal-overlay"
          id="upload-modal"
          onClick={overlayClick(() => setUploadOpen(false))}
        >
          <div
            ref={uploadOpen ? dialogRef : undefined}
            className="modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => {
                setUploadOpen(false);
                lastFocused.current?.focus();
              }}
              aria-label={isEn ? "Close dialog" : "Funga mazungumzo"}
            >
              <X aria-hidden="true" />
            </button>
            <h2 id="modal-title">Upload Content</h2>

            <div className="stack stack-4">
              <div className="field">
                <label className="field-label" id="ml-type" htmlFor="modal-type">
                  {t["ml-type"] ?? "Content Type"}
                </label>
                <select
                  className="select"
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
              </div>

              <div className="field">
                <label className="field-label" id="ml-title" htmlFor="ml-title-inp">
                  {t["ml-title"] ?? "Title (English)"}
                </label>
                <input
                  id="ml-title-inp"
                  className="input"
                  type="text"
                  placeholder={isEn ? "e.g. River Cleanup Blueprint v2" : "Mfano: Ramani ya Kusafisha Mto v2"}
                  value={upTitle}
                  onChange={(e) => setUpTitle(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="field-label" id="ml-title-sw" htmlFor="ml-title-sw-inp">
                  {t["ml-title-sw"] ?? "Title (Kiswahili)"}
                </label>
                <input
                  id="ml-title-sw-inp"
                  className="input"
                  type="text"
                  placeholder={isEn ? "e.g. Ramani ya Kusafisha Mto v2" : "Mfano: Blue Print ya Kusafisha Mto v2"}
                  value={upTitleSw}
                  onChange={(e) => setUpTitleSw(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="field-label" id="ml-desc" htmlFor="ml-desc-inp">
                  {t["ml-desc"] ?? "Short Description"}
                </label>
                <textarea
                  id="ml-desc-inp"
                  className="textarea"
                  placeholder={
                    isEn ? "Describe this resource in 1–2 sentences..." : "Eleza rasilimali hii kwa maneno 1–2..."
                  }
                  value={upDesc}
                  onChange={(e) => setUpDesc(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="field-label" id="ml-email" htmlFor="ml-email-inp">
                  {t["ml-email"] ?? "Your Email (for follow-up)"}
                </label>
                <input
                  id="ml-email-inp"
                  className="input"
                  type="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={upEmail}
                  onChange={(e) => setUpEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              className="dropzone"
              style={{ marginTop: "var(--space-4)" }}
              onClick={() => upFilesRef.current?.click()}
            >
              <Icon name="upload" size={22} />
              <span>
                <strong>{isEn ? "Click to choose file" : "Bofya kuchagua faili"}</strong>
                {isEn ? " (PDF, MP3, MP4, DOCX…)" : " (PDF, MP3, MP4, DOCX…)"}
              </span>
              {upFile && <span className="text-xs">Selected: {upFile.name}</span>}
            </button>
            <input
              type="file"
              id="file-inp"
              ref={upFilesRef}
              style={{ display: "none" }}
              accept=".pdf,.mp3,.mp4,.docx,.zip"
              onChange={(e) => setUpFile(e.target.files?.[0] ?? null)}
            />

            <div className="field" style={{ marginTop: "var(--space-4)" }}>
              <label className="field-label" htmlFor="ml-url">
                {isEn ? "Or paste a URL instead of uploading" : "Au bandika kiungo badala ya kupakia"}
              </label>
              <input
                className="input"
                id="ml-url"
                type="url"
                inputMode="url"
                placeholder="https://…"
                value={upUrl}
                onChange={(e) => setUpUrl(e.target.value)}
              />
            </div>

            {upStatus === "error" && (
              <p className="form-status form-status-error" role="alert" style={{ marginTop: 12 }}>
                <Icon name="error" size={16} />
                {upError}
              </p>
            )}
            {upStatus === "ok" && (
              <p className="form-status form-status-success" role="status" style={{ marginTop: 12 }}>
                <CheckCircle2 size={16} aria-hidden="true" />
                {isEn
                  ? "Submitted! An editor will review and publish it."
                  : "Imetumwa! Mhariri ataipitisha na kuichapisha."}
              </p>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={saveCMS}
                disabled={upStatus === "sending"}
              >
                {upStatus === "sending" ? (
                  <Loader2 size={16} aria-hidden="true" className="spin" />
                ) : null}
                {upStatus === "sending"
                  ? isEn
                    ? "Sending…"
                    : "Inatuma…"
                  : upStatus === "ok"
                    ? isEn
                      ? "Submitted ✓"
                      : "Imetumwa ✓"
                    : isEn
                      ? "Submit for Review →"
                      : "Tuma kwa Ukaguzi →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
