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
