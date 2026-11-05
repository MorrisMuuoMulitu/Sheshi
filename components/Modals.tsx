"use client";

import { useEffect, useState } from "react";
import { T, type Locale } from "@/lib/i18n";
import { closeModal } from "@/lib/ui";

/**
 * The two legacy modals (Share Story + Upload/CMS), ported verbatim.
 * Their submit handlers still show the legacy alerts — replaced by real
 * API-route submissions in Phase 4 of PLAN.md.
 */
export default function Modals({ locale }: { locale: Locale }) {
  const t = T[locale];
  const [shareOpen, setShareOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    const onShare = () => setShareOpen(true);
    const onUpload = (e: Event) => {
      const ctx = (e as CustomEvent<"resource" | "work">).detail;
      const sel = document.getElementById("modal-type") as HTMLSelectElement | null;
      if (sel) sel.value = ctx === "work" ? "podcast" : "template";
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

  const saveShare = () => {
    alert("✅ Story submitted! Our team will review and publish it on the site.");
    setShareOpen(false);
  };
  const saveCMS = () => {
    alert("✅ Content saved! In production this pushes to Sanity CMS and goes live immediately.");
    setUploadOpen(false);
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
        <div className="modal-box">
          <button className="modal-close" onClick={() => closeModal("share-modal")}>✕</button>
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
              <div
                key={key}
                className={`stype-btn${i === 0 ? " active" : ""}`}
                onClick={(e) => {
                  e.currentTarget.parentElement
                    ?.querySelectorAll(".stype-btn")
                    .forEach((b) => b.classList.remove("active"));
                  e.currentTarget.classList.add("active");
                }}
              >
                <span className="sticon">{icon}</span>
                <span id={key}>{t[key] ?? key}</span>
              </div>
            ))}
          </div>
          <label className="m-lbl" id="sm-nl">{t["sm-nl"] ?? "Your Name"}</label>
          <input className="m-in" type="text" placeholder="Full name" />
          <label className="m-lbl" id="sm-el">{t["sm-el"] ?? "Email"}</label>
          <input className="m-in" type="email" placeholder="your@email.com" />
          <label className="m-lbl" id="sm-tl">{t["sm-tl"] ?? "Title / Caption"}</label>
          <input className="m-in" type="text" placeholder="e.g. Our river cleanup in Machakos" />
          <label className="m-lbl" id="sm-dl">{t["sm-dl"] ?? "Description"}</label>
          <textarea className="m-ta" placeholder="Tell your story..." />
          <div
            className="m-upload-area"
            onClick={() => document.getElementById("share-file-inp")?.click()}
          >
            <p>
              📎 <strong>Click to attach files</strong> (photos, PDF, video, audio)
            </p>
            <p style={{ marginTop: 4, fontSize: 12 }}>Max 50MB per file</p>
          </div>
          <input
            type="file"
            id="share-file-inp"
            style={{ display: "none" }}
            multiple
            accept="image/*,.pdf,.mp4,.mp3,.docx,.zip"
          />
          <button className="m-save" onClick={saveShare}>Submit Story →</button>
        </div>
      </div>

      {/* UPLOAD MODAL (CMS) */}
      <div
        className="modal-overlay"
        id="upload-modal"
        style={{ display: uploadOpen ? "flex" : "none" }}
        onClick={overlayClick(() => setUploadOpen(false))}
      >
        <div className="modal-box">
          <button className="modal-close" onClick={() => closeModal("upload-modal")}>✕</button>
          <h3 id="modal-title">Upload Content</h3>
          <label className="m-lbl" id="ml-type">{t["ml-type"] ?? "Content Type"}</label>
          <select className="m-sel" id="modal-type" defaultValue="template">
            <option value="template">Template / Blueprint</option>
            <option value="toolkit">Toolkit</option>
            <option value="zine">Zine</option>
            <option value="podcast">Podcast Episode</option>
            <option value="documentary">Documentary</option>
            <option value="blog">Blog Post</option>
          </select>
          <label className="m-lbl" id="ml-title">{t["ml-title"] ?? "Title (English)"}</label>
          <input className="m-in" type="text" placeholder="e.g. River Cleanup Blueprint v2" />
          <label className="m-lbl" id="ml-title-sw">{t["ml-title-sw"] ?? "Title (Kiswahili)"}</label>
          <input className="m-in" type="text" placeholder="e.g. Ramani ya Kusafisha Mto v2" />
          <label className="m-lbl" id="ml-desc">{t["ml-desc"] ?? "Short Description"}</label>
          <textarea className="m-ta" placeholder="Describe this resource in 1–2 sentences..." />
          <div
            className="m-upload-area"
            onClick={() => document.getElementById("file-inp")?.click()}
          >
            <p>
              📎 <strong>Click to choose file</strong> (PDF, MP3, MP4, DOCX…)
            </p>
          </div>
          <input
            type="file"
            id="file-inp"
            style={{ display: "none" }}
            accept=".pdf,.mp3,.mp4,.docx,.zip"
          />
          <input className="m-in" type="url" placeholder="https://... (paste URL instead of upload)" />
          <button className="m-save" onClick={saveCMS}>Save &amp; Publish →</button>
        </div>
      </div>
    </>
  );
}
