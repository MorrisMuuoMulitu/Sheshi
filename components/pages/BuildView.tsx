"use client";

import { useState } from "react";
import { T, type Locale } from "@/lib/i18n";
import { openUploadModal } from "@/lib/ui";
import type { LibraryResource } from "@/lib/views";

const filters = [
  { cat: "all", id: "fb-all", label: "All" },
  { cat: "tp", id: "fb-tp", label: "Templates" },
  { cat: "kt", id: "fb-kt", label: "Toolkits" },
  { cat: "zn", id: "fb-zn", label: "Zines" },
];

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
  const [cat, setCat] = useState("all");

  return (
    <div className="page active" id="page-build">
      <div className="build-inner">
        <div className="sec-ey" id="t-bey">
          {tx("t-bey", "Resource Library")}
        </div>
        <h2 className="sec-h" id="t-bh">
          {tx("t-bh", "Download. Adapt. Deploy.")}
        </h2>
        <p className="sec-p" id="t-bp">
          {tx("t-bp", "Free bilingual resources — blueprints, toolkits, zines, templates — all downloadable.")}
        </p>
        <div className="cms-banner">
          <div className="cms-icon">⬆️</div>
          <div className="cms-txt">
            <h4 id="t-cms-h">{tx("t-cms-h", "Add a New Resource")}</h4>
            <p id="t-cms-p">
              {tx("t-cms-p", "Upload a template, toolkit, or zine — no developer needed.")}{" "}
              <a onClick={() => openUploadModal("resource")} style={{ cursor: "pointer" }}>
                Click here →
              </a>
            </p>
          </div>
        </div>
        <div className="filter-row">
          {filters.map((f) => (
            <button
              key={f.cat}
              className={`fr-btn${cat === f.cat ? " on" : ""}`}
              id={f.id}
              onClick={() => setCat(f.cat)}
            >
              {tx(f.id, f.label)}
            </button>
          ))}
        </div>
        <div className="res-grid" id="res-grid">
          {resources.map((r) => (
            <div
              className="res-card"
              key={r.id}
              data-cat={r.cat}
              style={{ display: cat === "all" || cat === r.cat ? "block" : "none" }}
            >
              <div className={`rt ${r.cat}`}>{r.rt}</div>
              <div className="rc-t" id={`${r.id}t`}>
                {r.title}
              </div>
              <div className="rc-d">{r.desc}</div>
              <div className="rc-foot">
                <div className="rc-langs">
                  {r.langs.map((l) => (
                    <span className={`ldot ${l}`} key={l}>
                      {l.toUpperCase()}
                    </span>
                  ))}
                </div>
                <button className="dl-btn">⬇ Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
