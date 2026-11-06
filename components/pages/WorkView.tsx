"use client";

import { useState } from "react";
import { T, type Locale } from "@/lib/i18n";
import { openUploadModal } from "@/lib/ui";
import type { StoryCard, WorkCard, WorkEpisode } from "@/lib/views";

const tabs = [
  { cat: "all", id: "wt-all", label: "All" },
  { cat: "pod", id: "wt-pod", label: "Podcasts" },
  { cat: "doc", id: "wt-doc", label: "Documentaries" },
  { cat: "blg", id: "wt-blg", label: "Blog" },
];

/** Our Work page — podcast episodes + documentary/blog card grid. */
export default function WorkView({
  locale,
  episodes,
  works,
  stories = [],
}: {
  locale: Locale;
  episodes: WorkEpisode[];
  works: WorkCard[];
  stories?: StoryCard[];
}) {
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
                      {e.title}
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
                      {w.title}
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
        {cat === "all" && stories.length > 0 && (
          <div id="story-section" style={{ marginTop: 32 }}>
            <div className="pod-card" style={{ padding: "28px 24px" }}>
              <h3 id="t-str-h">{tx("t-str-h", "Community Stories")}</h3>
              <p style={{ fontSize: 14, color: "rgba(0,0,0,.55)", margin: "4px 0 18px" }}>
                {tx(
                  "t-str-p",
                  "Submitted by communities across Kenya — reviewed and published by our editors.",
                )}
              </p>
              <div className="work-grid">
                {stories.map((s, i) => (
                  <div className="work-card" key={`${s.kind}-${i}`} data-wc="story">
                    <div className="wc-thumb doc">
                      {s.icon}
                      <div className="wc-badge">
                        {tx(`stk-${s.kind}`, "Community")}
                      </div>
                    </div>
                    <div className="wc-body">
                      <div className="wc-t">{s.title}</div>
                      {s.desc && (
                        <div style={{ fontSize: 13, color: "rgba(0,0,0,.55)", marginTop: 6 }}>
                          {s.desc}
                        </div>
                      )}
                      <div className="wc-meta">
                        <span className="wc-date">{s.author}</span>
                        <span className="wc-lang">{s.date}</span>
                      </div>
                      {s.href && (
                        <a
                          className="dl-btn"
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ marginTop: 12, display: "inline-block" }}
                        >
                          ⬇ Open
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
