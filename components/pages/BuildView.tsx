"use client";

import { useState } from "react";
import { Download, Eye, Upload } from "lucide-react";
import { T, type Locale } from "@/lib/i18n";
import { openMedia, openUploadModal } from "@/lib/ui";
import { downloadHref, type LibraryResource } from "@/lib/views";
import { Icon } from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import PageHead from "@/components/ui/PageHead";

const filters = [
  { cat: "all", id: "fb-all", label: "All" },
  { cat: "tp", id: "fb-tp", label: "Templates" },
  { cat: "kt", id: "fb-kt", label: "Toolkits" },
  { cat: "zn", id: "fb-zn", label: "Zines" },
];

/** Category → icon (replaces the emoji baked into the legacy badge string). */
const CAT_ICON: Record<string, string> = {
  tp: "file",
  kt: "package",
  zn: "newspaper",
};

/** Build (Resource Library) page — filterable resource grid. */
export default function BuildView({
  locale,
  resources,
}: {
  locale: Locale;
  resources: LibraryResource[];
}) {
  const t = T[locale];
  const tx = (k: string, fb: string) => t[k] ?? fb;
  const isEn = locale === "en";
  const [cat, setCat] = useState("all");

  const visible = resources.filter((r) => cat === "all" || cat === r.cat);

  return (
    <div className="page" id="page-build">
      <PageHead
        eyebrow={tx("t-bey", "Resource Library")}
        title={tx("t-bh", "Download. Adapt. Deploy.")}
        lede={tx(
          "t-bp",
          "Free bilingual resources — blueprints, toolkits, zines, templates — all downloadable.",
        )}
        image="/img/field-working.jpg"
        imageAlt={
          isEn
            ? "Farm workers picking tea on a hillside near Kericho, Kenya"
            : "Wakulima wakichuna chai kwenye kilima karibu na Kericho, Kenya"
        }
      />

      <div className="container section">
        <div className="cms-banner">
          <span className="icon-tile">
            <Icon name="upload" size={24} />
          </span>
          <div style={{ flex: 1, minWidth: 220 }}>
            <h3 id="t-cms-h">{tx("t-cms-h", "Add a New Resource")}</h3>
            <p id="t-cms-p">
              {tx("t-cms-p", "Upload a template, toolkit, or zine — no developer needed.")}{" "}
              <button
                type="button"
                className="text-link"
                onClick={() => openUploadModal("resource")}
              >
                {isEn ? "Click here" : "Bofya hapa"} →
              </button>
            </p>
          </div>
        </div>

        <div className="chip-row" role="group" aria-label={isEn ? "Filter resources" : "Chuja rasilimali"}>
          {filters.map((f) => (
            <button
              key={f.cat}
              type="button"
              className={`chip${cat === f.cat ? " is-active" : ""}`}
              id={f.id}
              onClick={() => setCat(f.cat)}
              aria-pressed={cat === f.cat}
            >
              {tx(f.id, f.label)}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="empty-state" style={{ marginTop: "var(--space-8)" }}>
            <Icon name="package" size={32} />
            <h3>{isEn ? "No resources in this category yet" : "Hakuna rasilimali kwa kategoria hii bado"}</h3>
            <p>
              {isEn
                ? "Be the first to add one — upload a template or toolkit for your community."
                : "Wewe ndiye mwingi wa kwanza kuongeza — pakua kiolezo au zana kwa jamii yako."}
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => openUploadModal("resource")}
            >
              <Upload size={16} aria-hidden="true" />
              {isEn ? "Add a resource" : "Ongeza rasilimali"}
            </button>
          </div>
        ) : (
          <div className="res-grid" id="res-grid" style={{ marginTop: "var(--space-8)" }}>
            {visible.map((r, idx) => (
              <Reveal key={r.docId} delay={(idx % 3) + 1}>
                <article className="res-card" data-cat={r.cat}>
                  <span className="badge badge-brand">
                    <Icon name={CAT_ICON[r.cat]} size={13} />
                    {tx(`cat-${r.cat}`, r.rt.replace(/^\S+\s*/, ""))}
                  </span>
                  <h3 id={`${r.id}t`}>{r.title}</h3>
                  <p>{r.desc}</p>
                  <div className="res-foot">
                    <div className="res-langs">
                      {r.langs.map((l) => (
                        <span
                          className={`lang-dot${l === "en" ? " is-primary" : ""}`}
                          key={l}
                          lang={l}
                        >
                          {l.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    {r.fileUrl ? (
                      <div className="res-actions">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => openMedia({ url: r.fileUrl!, title: r.title })}
                        >
                          <Eye size={14} aria-hidden="true" />
                          {isEn ? "View" : "Tazama"}
                        </button>
                        <a
                          className="dl-btn"
                          href={downloadHref(r.fileUrl, r.title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={isEn ? "Download" : "Pakua"}
                        >
                          <Download size={14} aria-hidden="true" />
                        </a>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="dl-btn"
                        disabled
                        title={isEn ? "File coming soon" : "Faili itakuja"}
                      >
                        <Download size={14} aria-hidden="true" />
                        {isEn ? "Download" : "Pakua"}
                      </button>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
