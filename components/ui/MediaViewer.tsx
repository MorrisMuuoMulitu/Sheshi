"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, ExternalLink, X } from "lucide-react";
import { type Locale } from "@/lib/i18n";
import { forceDownloadHref, kindLabel, mediaKind, type MediaKind } from "@/lib/media";
import type { MediaRequest } from "@/lib/ui";

/**
 * In-app media viewer.
 *
 * PDFs, videos, audio and images open inside the site instead of triggering a
 * download. Download and "open in a new tab" stay available, but they are the
 * secondary actions — the primary experience is right here.
 *
 * Opened with `openMedia({ url, title })` (lib/ui.ts), which fires an
 * `eh:open-media` event so any surface can call it without prop drilling.
 */
export default function MediaViewer({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [item, setItem] = useState<MediaRequest | null>(null);
  const [kind, setKind] = useState<MediaKind>("unknown");
  const [loaded, setLoaded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  // Listen for open requests from anywhere on the page.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<MediaRequest>).detail;
      if (!detail?.url) return;
      lastFocused.current = document.activeElement as HTMLElement | null;
      setKind(mediaKind(detail.url, (detail.kind as MediaKind) ?? "unknown"));
      setLoaded(false);
      setItem(detail);
    };
    window.addEventListener("eh:open-media", onOpen);
    return () => window.removeEventListener("eh:open-media", onOpen);
  }, []);

  // Never leave the spinner up: the PDF <iframe> does not fire `load` in
  // browsers without a built-in PDF viewer, and a slow file should not look
  // like a broken one.
  useEffect(() => {
    if (!item) return;
    const t = window.setTimeout(() => setLoaded(true), 6000);
    return () => window.clearTimeout(t);
  }, [item]);

  const close = useCallback(() => {
    setItem(null);
    setLoaded(false);
    lastFocused.current?.focus();
  }, []);

  // Escape closes; Tab stays inside; the page behind does not scroll.
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const f = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), iframe, video, [tabindex]:not([tabindex="-1"])',
      );
      if (!f || f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [item, close]);

  if (!item) return null;

  const label = kindLabel(kind, isEn);

  return (
    <div
      className="viewer"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="viewer-panel" ref={panelRef}>
        <header className="viewer-head">
          <div className="viewer-title">
            <span className="viewer-kind">{label}</span>
            <h2>{item.title}</h2>
          </div>
          <div className="viewer-actions">
            <a
              className="viewer-action"
              href={forceDownloadHref(item.url, item.title)}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <Download size={16} aria-hidden="true" />
              <span>{isEn ? "Download" : "Pakua"}</span>
            </a>
            <a
              className="viewer-action"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} aria-hidden="true" />
              <span>{isEn ? "New tab" : "Tab mpya"}</span>
            </a>
            <button
              type="button"
              className="viewer-close"
              onClick={close}
              aria-label={isEn ? "Close viewer" : "Funga"}
            >
              <X aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="viewer-body">
          {!loaded && (
            <div className="viewer-loading" aria-hidden="true">
              <span className="viewer-spinner" />
            </div>
          )}

          {kind === "video" && (
            <video
              className="viewer-media"
              src={item.url}
              poster={item.poster}
              controls
              autoPlay
              playsInline
              preload="metadata"
              onLoadedData={() => setLoaded(true)}
              onError={() => setLoaded(true)}
            />
          )}

          {kind === "audio" && (
            <div className="viewer-audio">
              <audio
                src={item.url}
                controls
                autoPlay
                preload="metadata"
                onLoadedData={() => setLoaded(true)}
                onError={() => setLoaded(true)}
              />
            </div>
          )}

          {kind === "image" && (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary CMS asset, no fixed dimensions
            <img
              className="viewer-image"
              src={item.url}
              alt={item.title}
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
            />
          )}

          {kind === "pdf" && (
            <iframe
              className="viewer-pdf"
              src={`${item.url}#view=FitH`}
              title={item.title}
              onLoad={() => setLoaded(true)}
            />
          )}

          {(kind === "document" || kind === "link" || kind === "unknown") && (
            <div className="viewer-fallback">
              <p>
                {isEn
                  ? "This file type cannot be shown inside the site. Open it in a new tab, or download it."
                  : "Aina hii ya faili haiwezi kuonyeshwa hapa. Ifungue kwenye tab mpya, au ipakue."}
              </p>
              <div className="viewer-fallback-actions">
                <a className="btn btn-brand" href={item.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} aria-hidden="true" />
                  {isEn ? "Open in new tab" : "Fungua kwenye tab mpya"}
                </a>
                <a
                  className="btn btn-secondary"
                  href={forceDownloadHref(item.url, item.title)}
                  download
                >
                  <Download size={16} aria-hidden="true" />
                  {isEn ? "Download" : "Pakua"}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
