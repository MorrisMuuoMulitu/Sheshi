"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download, Play } from "lucide-react";
import { T, type Locale } from "@/lib/i18n";
import { downloadHref, type LearnTopic } from "@/lib/views";
import { Icon, terrainFor } from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";

/**
 * Learn page — topic grid + step-by-step detail (client interactivity).
 * Data arrives localized from the server (lib/cms.ts).
 * Supports `?topic=<key>` deep links (used by the Act page's
 * “Get the Guide” → related topic, Phase 5.1).
 */
export default function LearnView({
  locale,
  topics,
  introVideoUrl,
}: {
  locale: Locale;
  topics: LearnTopic[];
  introVideoUrl?: string;
}) {
  const t = T[locale];
  const tx = (k: string, fb: string) => t[k] ?? fb;
  const isEn = locale === "en";

  const [active, setActive] = useState<string | null>(null);
  // Which topic's video has been started (keeps the overlay hidden afterwards).
  const [startedFor, setStartedFor] = useState<string | null>(null);
  const [introStarted, setIntroStarted] = useState(false);

  // Deep link: /learn?topic=river opens that topic on mount.
  // (One-shot post-hydration navigation; `window` doesn't exist during prerender,
  // so this cannot move into useState's initializer without a hydration mismatch.)
  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get("topic");
    if (key && topics.some((tc) => tc.key === key)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot deep link
      setActive(key);
      window.scrollTo(0, 0);
    }
  }, [topics]);

  const openTopic = (key: string) => {
    setActive(key);
    window.scrollTo(0, 0);
  };
  const closeTopic = () => {
    setActive(null);
    setStartedFor(null);
    window.scrollTo(0, 0);
  };

  /** Play a topic/intro video element by id, when it exists. */
  const playVideo = (id: string) => {
    const video = document.getElementById(id) as HTMLVideoElement | null;
    if (video) void video.play();
  };

  const topic = active ? topics.find((tc) => tc.key === active) ?? null : null;

  if (topic && active) {
    return (
      <div className="page" id="page-learn">
        <div id="topic-detail">
          <section className="topic-detail-hero">
            <div className="container">
              <button type="button" className="td-back" onClick={closeTopic}>
                <ArrowLeft size={16} aria-hidden="true" />
                <span id="t-back">{tx("t-back", "Back to Topics")}</span>
              </button>
              <h1 className="td-title" id="td-title">
                {topic.title}
              </h1>
              <p className="td-intro" id="td-intro">
                {topic.intro}
              </p>
            </div>
          </section>

          <div className="container section">
            <div className="td-grid">
              <div>
                <div className="video-frame">
                  {topic.videoUrl ? (
                    <>
                      <video
                        id="td-video-el"
                        src={topic.videoUrl}
                        controls
                        playsInline
                        preload="metadata"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {startedFor !== topic.key && (
                        <button
                          type="button"
                          className="video-overlay"
                          aria-label={tx("t-td-play", "Play topic video")}
                          onClick={() => {
                            playVideo("td-video-el");
                            setStartedFor(topic.key);
                          }}
                        >
                          <div className="play-btn">
                            <Play size={24} aria-hidden="true" style={{ marginLeft: 2 }} />
                          </div>
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="video-overlay is-disabled" aria-disabled="true">
                      <div className="play-btn">
                        <Play size={24} aria-hidden="true" style={{ marginLeft: 2 }} />
                      </div>
                      <div className="vo-label">{tx("t-td-soon", "Video coming soon")}</div>
                    </div>
                  )}
                </div>

                <div className="res-hint">
                  <div className="rh-ey">
                    {isEn ? "Resources for this topic" : "Rasilimali za mada hii"}
                  </div>
                  <h3 id="td-res-t">{topic.res}</h3>
                  <p id="td-res-d">{topic.resD}</p>
                  {topic.kitFileUrl ? (
                    <a
                      className="btn btn-primary"
                      href={downloadHref(topic.kitFileUrl, topic.res)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download size={16} aria-hidden="true" />
                      {isEn ? "Download Kit" : "Pakua Kifurushi"}
                    </a>
                  ) : (
                    <Link className="btn btn-primary" href={`/${locale}/build`}>
                      <Download size={16} aria-hidden="true" />
                      {isEn ? "Download Kit" : "Pakua Kifurushi"}
                    </Link>
                  )}
                </div>
              </div>

              <div>
                <p className="eyebrow" id="t-steps-ey" style={{ marginBottom: "var(--space-5)" }}>
                  {tx("t-steps-ey", "Step-by-Step Guide")}
                </p>
                <ol className="steps-list" id="steps-list">
                  {topic.steps.map((s, i) => (
                    <li className="step" key={i}>
                      <span className="step-num" aria-hidden="true">
                        {i + 1}
                      </span>
                      <div className="step-txt">
                        <h3>{s.h}</h3>
                        <p>{s.p}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page" id="page-learn">
      <div id="topic-list">
        <section className="page-head">
          <div className="container">
            <p className="eyebrow" id="t-lh-ey">
              {isEn ? "Learn" : "Jifunze"}
            </p>
            <h1 id="t-lh">{tx("t-lh", "Choose What to Learn")}</h1>
            <p id="t-lp">
              {tx(
                "t-lp",
                "Select a topic. Each module has an intro video and step-by-step guide — in English and Kiswahili.",
              )}
            </p>
          </div>
        </section>

        {introVideoUrl && (
          <div className="container section-tight">
            <div className="video-frame">
              <video
                id="tvo-vid"
                src={introVideoUrl}
                controls
                playsInline
                preload="metadata"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {!introStarted && (
                <button
                  type="button"
                  className="video-overlay"
                  aria-label={tx("t-tvo", "Play introduction video")}
                  onClick={() => {
                    playVideo("tvo-vid");
                    setIntroStarted(true);
                  }}
                >
                  <div className="play-btn">
                    <Play size={24} aria-hidden="true" style={{ marginLeft: 2 }} />
                  </div>
                  <div className="vo-label" id="t-tvo">
                    {tx("t-tvo", "Introduction to Environmental Action")}
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="container section" style={{ paddingTop: 0 }}>
          <div className="topic-grid">
            {topics.map((c, idx) => (
              <Reveal key={c.docId} delay={(idx % 3) + 1}>
                <button type="button" className="topic-card" onClick={() => openTopic(c.key)}>
                  <div className={`tc-thumb ${terrainFor(c.icon)}`}>
                    <Icon name={c.icon} size={44} strokeWidth={1.5} />
                  </div>
                  <div className="tc-body">
                    <span className="tc-title" id={`tc-t${c.i}`}>
                      {c.title}
                    </span>
                    <span className="tc-desc" id={`tc-d${c.i}`}>
                      {c.desc}
                    </span>
                    <span className="tc-foot">
                      <span className="badge badge-brand" id={`tc-p${c.i}`}>
                        {c.pill}
                      </span>
                      <span className="tc-arr">
                        <ArrowRight size={15} aria-hidden="true" />
                      </span>
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
