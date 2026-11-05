"use client";

import { use, useState } from "react";
import { T, type Locale } from "@/lib/i18n";
import { openUploadModal } from "@/lib/ui";

const tabs = [
  { cat: "all", id: "wt-all", label: "All" },
  { cat: "pod", id: "wt-pod", label: "Podcasts" },
  { cat: "doc", id: "wt-doc", label: "Documentaries" },
  { cat: "blg", id: "wt-blg", label: "Blog" },
];

const episodes = [
  { n: 14, i: 1, title: "Mazungumzo: Mto Nairobi Leo", dur: "38 min · Kiswahili" },
  { n: 13, i: 2, title: "Forests, Floods & Community Power", dur: "44 min · English" },
  { n: 12, i: 3, title: "Youth Voices: The Next Green Generation", dur: "31 min · EN/SW" },
];

const works = [
  { wc: "doc", i: 1, icon: "🎬", badge: "Documentary · 22min", title: "The Kerio Valley Restoration Project", date: "Feb 2025", lang: "EN/SW" },
  { wc: "doc", i: 2, icon: "🎬", badge: "Documentary · 35min", title: "Salt of the Earth: Coastal Women Leaders", date: "Nov 2024", lang: "EN/SW" },
  { wc: "blg", i: 3, icon: "✍️", badge: "Blog Post", title: "Why Youth Leadership Is the Climate Solution Kenya Needs", date: "Jan 2025", lang: "EN" },
  { wc: "blg", i: 4, icon: "✍️", badge: "Blog Post", title: "Hali ya Hewa Nairobi: Ripoti ya Jamii", date: "Dec 2024", lang: "SW" },
];

export default function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params) as { locale: Locale };
  const t = T[locale];
  const tx = (k: string, fb: string) => t[k] ?? fb;
  const [cat, setCat] = useState("all");

  const showPods = cat === "all" || cat === "pod";
  const showGrid = cat !== "pod";

  return (
    <div className="page active" id="page-work">
      <div className="work-inner">
        <div className="sec-ey" id="t-wey">
          {tx("t-wey", "Our Work")}
        </div>
        <h2 className="sec-h" id="t-wh">
          {tx("t-wh", "Stories. Voices. Impact.")}
        </h2>
        <p className="sec-p" id="t-wp">
          {tx("t-wp", "Podcasts, documentaries, and blog posts from across Kenya's environmental movement.")}
        </p>
        <div className="work-cms" onClick={() => openUploadModal("work")} style={{ cursor: "pointer" }}>
          <div className="plus">＋</div>
          <h4 id="t-wcms-h">{tx("t-wcms-h", "Upload New Content")}</h4>
          <p id="t-wcms-p">
            {tx("t-wcms-p", "Add a podcast, documentary, or blog post — no developer needed.")}
          </p>
        </div>
        <div className="work-tabs">
          {tabs.map((tb) => (
            <button
              key={tb.cat}
              className={`wt${cat === tb.cat ? " on" : ""}`}
              id={tb.id}
              onClick={() => setCat(tb.cat)}
            >
              {tx(tb.id, tb.label)}
            </button>
          ))}
        </div>
        {showPods && (
          <div id="pod-section">
            <div className="pod-card">
              <h3 id="t-pod-h">{tx("t-pod-h", "Latest Episodes")}</h3>
              {episodes.map((e) => (
                <div className="pod-row" key={e.n}>
                  <div className="pod-num">{e.n}</div>
                  <div className="pod-info">
                    <div className="pod-title" id={`po${e.i}t`}>
                      {tx(`po${e.i}t`, e.title)}
                    </div>
                    <div className="pod-dur">{e.dur}</div>
                  </div>
                  <div className="pod-play">▶</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {showGrid && (
          <div className="work-grid" id="work-grid" style={{ marginTop: 24 }}>
            {works
              .filter((w) => cat === "all" || cat === w.wc)
              .map((w) => (
                <div className="work-card" key={w.i} data-wc={w.wc}>
                  <div className={`wc-thumb ${w.wc}`}>
                    {w.icon}
                    <div className="wc-badge">{w.badge}</div>
                  </div>
                  <div className="wc-body">
                    <div className="wc-t" id={`w${w.i}t`}>
                      {tx(`w${w.i}t`, w.title)}
                    </div>
                    <div className="wc-meta">
                      <span className="wc-date">{w.date}</span>
                      <span className="wc-lang">{w.lang}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
