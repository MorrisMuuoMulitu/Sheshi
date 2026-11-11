"use client";

/** Client-side modal plumbing — mirrors the legacy global openShareModal()/closeModal(). */
export function openShareModal() {
  window.dispatchEvent(new CustomEvent("eh:open-share"));
}

export function openUploadModal(ctx: "resource" | "work") {
  window.dispatchEvent(new CustomEvent("eh:open-upload", { detail: ctx }));
}

export function closeModal(id: string) {
  window.dispatchEvent(new CustomEvent("eh:close-modal", { detail: id }));
}

/** Open the in-app media viewer for a file or link. */
export function openMedia(payload: {
  url: string;
  title: string;
  kind?: string;
  poster?: string;
}) {
  window.dispatchEvent(new CustomEvent("eh:open-media", { detail: payload }));
}

export type MediaRequest = {
  url: string;
  title: string;
  kind?: string;
  poster?: string;
};
