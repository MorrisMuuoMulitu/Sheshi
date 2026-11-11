"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Pause, Play, Plus } from "lucide-react";
import { T, type Locale } from "@/lib/i18n";
import { openMedia, openUploadModal } from "@/lib/ui";
import type { StoryCard, WorkCard, WorkEpisode } from "@/lib/views";
import { Icon } from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import PageHead from "@/components/ui/PageHead";

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
  const isEn = locale === "en";
  const [cat, setCat] = useState("all");

  // Podcast playback (Phase 5.1): ▶ plays the episode's mediaUrl when set.
  const audioRefs = useRef<Record<number, HTMLAudioElement | null>>({});
  const [playing, setPlaying] = useState<number | null>(null);

  useEffect(() => {
    const refs = audioRefs.current;
    return () => {
      Object.values(refs).forEach((a) => a?.pause());
    };
  }, []);

  const togglePlay = (ep: WorkEpisode) => {
    const audio = audioRefs.current[ep.n];
    if (!ep.mediaUrl || !audio) return;
    if (playing === ep.n) {
      audio.pause();
      setPlaying(null);
      return;
    }
    // Only one episode plays at a time.
    Object.values(audioRefs.current).forEach((a) => {
      if (a && a !== audio) a.pause();
    });
    audio
      .play()
      .then(() => setPlaying(ep.n))
      .catch(() => setPlaying(null));
  };

  const showPods = cat === "all" || cat === "pod";
  const showGrid = cat !== "pod";

  return (
    <div className="page" id="page-work">
      <PageHead
        eyebrow={tx("t-wey", "Our Work")}
        title={tx("t-wh", "Stories. Voices. Impact.")}
        lede={tx(
          "t-wp",
          "Podcasts, documentaries, and blog posts from across Kenya's environmental movement.",
        )}
        image="/img/band-tea.jpg"
        imageAlt={
          isEn ? "A tea plantation stretching across a hillside in Kenya" : "Shamba la chai kwenye kilima nchini Kenya"
        }
      />

      <div className="container section">
        <button type="button" className="cms-banner" onClick={() => openUploadModal("work")}>
          <span className="icon-tile">
            <Plus size={22} aria-hidden="true" />
          </span>
          <div>
            <h3 id="t-wcms-h">{tx("t-wcms-h", "Upload New Content")}</h3>
            <p id="t-wcms-p">
              {tx("t-wcms-p", "Add a podcast, documentary, or blog post — no developer needed.")}
            </p>
          </div>
        </button>

        <div className="chip-row" role="group" aria-label={isEn ? "Filter content" : "Chuja maudhui"}>
          {tabs.map((tb) => (
            <button
              key={tb.cat}
              type="button"
              className={`chip${cat === tb.cat ? " is-active" : ""}`}
              id={tb.id}
              onClick={() => setCat(tb.cat)}
              aria-pressed={cat === tb.cat}
            >
              {tx(tb.id, tb.label)}
            </button>
          ))}
        </div>

        {showPods && (
          <section id="pod-section" style={{ marginTop: "var(--space-8)" }} aria-labelledby="t-pod-h">
            <div className="pod-card">
              <h2 id="t-pod-h">{tx("t-pod-h", "Latest Episodes")}</h2>
              {episodes.length === 0 ? (
                <div className="empty-state">
                  <Icon name="mic" size={32} />
                  <h3>{isEn ? "No episodes yet" : "Hakuna vipindi bado"}</h3>
                  <p>
                    {isEn
                      ? "Subscribe to the newsletter to hear new episodes as they land."
                      : "Jisajili kwa barua pepe ili kusikiliza vipindi vipya."}
                  </p>
                </div>
              ) : (
                episodes.map((e) => (
                  <div className="pod-row" key={e.docId}>
                    <span className="pod-num" aria-hidden="true">
                      {e.n}
                    </span>
                    <div className="pod-info">
                      <div className="pod-title" id={`po${e.i}t`}>
                        {e.title}
                      </div>
                      <div className="pod-dur">{e.dur}</div>
                    </div>
                    {e.mediaUrl ? (
                      <>
                        <audio
                          ref={(el) => {
                            audioRefs.current[e.n] = el;
                          }}
                          src={e.mediaUrl}
                          preload="none"
                        />
                        <button
                          type="button"
                          className="pod-play"
                          title={playing === e.n ? "Pause episode" : "Play episode"}
                          aria-label={
                            playing === e.n
                              ? `Pause episode: ${e.title}`
                              : `Play episode: ${e.title}`
                          }
                          aria-pressed={playing === e.n}
                          onClick={() => togglePlay(e)}
                        >
                          {playing === e.n ? (
                            <Pause size={16} aria-hidden="true" />
                          ) : (
                            <Play size={16} aria-hidden="true" style={{ marginLeft: 2 }} />
                          )}
                        </button>
                      </>
                    ) : (
                      <span
                        className="pod-play is-disabled"
                        title={isEn ? "Audio coming soon" : "Sauti itakuja"}
                        role="button"
                        aria-disabled="true"
                        aria-label={isEn ? "Audio coming soon" : "Sauti itakuja"}
                      >
                        <Play size={16} aria-hidden="true" />
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {showGrid && (
          <section className="work-grid" id="work-grid" style={{ marginTop: "var(--space-8)" }}>
            {works
              .filter((w) => cat === "all" || cat === w.wc)
              .map((w, idx) => (
                <Reveal key={w.docId} delay={(idx % 3) + 1}>
                  <article className="work-card" data-wc={w.wc}>
                    <div className={`wc-thumb ${w.wc}`}>
                      <Icon name={w.icon} size={42} strokeWidth={1.5} />
                      <div className="wc-badge">{w.badge}</div>
                    </div>
                    <div className="wc-body">
                      <h3 id={`w${w.i}t`}>{w.title}</h3>
                      <div className="wc-meta">
                        <span className="wc-date">{w.date}</span>
                        <span className="badge badge-brand">{w.lang}</span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
          </section>
        )}

        {cat === "all" && stories.length > 0 && (
          <section id="story-section" style={{ marginTop: "var(--space-16)" }} aria-labelledby="t-str-h">
            <div className="pod-card">
              <h2 id="t-str-h">{tx("t-str-h", "Community Stories")}</h2>
              <p className="wc-story-desc" style={{ margin: "4px 0 18px" }}>
                {tx(
                  "t-str-p",
                  "Submitted by communities across Kenya — reviewed and published by our editors.",
                )}
              </p>
              <div className="work-grid">
                {stories.map((s) => (
                  <article className="work-card" key={s.docId} data-wc="story">
                    <div className="wc-thumb story">
                      <Icon name={s.icon} size={42} strokeWidth={1.5} />
                      <div className="wc-badge">{tx(`stk-${s.kind}`, "Community")}</div>
                    </div>
                    <div className="wc-body">
                      <h3>{s.title}</h3>
                      {s.desc && <p className="wc-story-desc">{s.desc}</p>}
                      <div className="wc-meta">
                        <span className="wc-date">{s.author}</span>
                        <span className="badge">{s.date}</span>
                      </div>
                      {s.href && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openMedia({ url: s.href!, title: s.title })}
                          style={{ alignSelf: "flex-start", marginTop: 4 }}
                        >
                          <Eye size={14} aria-hidden="true" />
                          {isEn ? "Open" : "Fungua"}
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
