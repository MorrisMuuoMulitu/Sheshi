"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { T, type Locale } from "@/lib/i18n";
import { downloadHref, type LearnTopic } from "@/lib/views";

/**
 * Learn page — topic grid + step-by-step detail (client interactivity).
 * Data arrives localized from the server (lib/cms.ts).
 * Supports `?topic=<key>` deep links (used by the Act page's
 * “Get the Guide” → related topic, Phase 5.1).
 */
export default function LearnView({
  locale,
  topics,
}: {
  locale: Locale;
  topics: LearnTopic[];
}) {
  const t = T[locale];
  const tx = (k: string, fb: string) => t[k] ?? fb;

  const [active, setActive] = useState<string | null>(null);
  const [introHidden, setIntroHidden] = useState(false);

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
    window.scrollTo(0, 0);
  };

  const topic = active ? topics.find((tc) => tc.key === active) ?? null : null;

  if (topic && active) {
    return (
      <div className="page active" id="page-learn">
        <div id="topic-detail" style={{ display: "block" }}>
          <div className="td-hero">
            <button className="td-back" onClick={closeTopic}>
              ← <span id="t-back">{tx("t-back", "Back to Topics")}</span>
            </button>
            <h2 className="td-title" id="td-title">
              {topic.title}
            </h2>
            <p className="td-intro" id="td-intro">
              {topic.intro}
            </p>
          </div>
          <div className="td-grid">
            <div>
              <div className="td-video-box">
                <button
                  type="button"
                  className="tdv-overlay"
                  aria-label={tx("t-td-play", "Play topic video")}
                  onClick={(e) => (e.currentTarget.style.display = "none")}
                >
                  <div className="tdv-play">
                    <div className="tri"></div>
                  </div>
                </button>
              </div>
              <div className="res-hint">
                <div className="rh-ey">Resources for this topic</div>
                <h4 id="td-res-t">{topic.res}</h4>
                <p id="td-res-d">{topic.resD}</p>
                {topic.kitFileUrl ? (
                  <a
                    className="dl-btn"
                    style={{ background: "var(--black)", color: "var(--sage)" }}
                    href={downloadHref(topic.kitFileUrl, topic.res)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ⬇ Download Kit
                  </a>
                ) : (
                  <Link
                    className="dl-btn"
                    style={{ background: "var(--black)", color: "var(--sage)" }}
                    href={`/${locale}/build`}
                  >
                    ⬇ Download Kit
                  </Link>
                )}
              </div>
            </div>
            <div>
              <div className="step-ey" id="t-steps-ey">
                {tx("t-steps-ey", "Step-by-Step Guide")}
              </div>
              <div className="steps-list" id="steps-list">
                {topic.steps.map((s, i) => (
                  <div className="step" key={i}>
                    <div className="step-num">{i + 1}</div>
                    <div className="step-txt">
                      <h4>{s.h}</h4>
                      <p>{s.p}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page active" id="page-learn">
      <div id="topic-list">
        <div className="learn-hero">
          <h1 id="t-lh">{tx("t-lh", "Choose What to Learn")}</h1>
          <p id="t-lp">
            {tx(
              "t-lp",
              "Select a topic. Each module has an intro video and step-by-step guide — in English and Kiswahili.",
            )}
          </p>
          <div className="tvo-box">
            {!introHidden && (
              <button
                type="button"
                className="tvo-overlay"
                aria-label={tx("t-tvo", "Play introduction video")}
                onClick={() => setIntroHidden(true)}
              >
                <div className="tvo-play">
                  <div className="tri"></div>
                </div>
                <div className="tvo-lbl" id="t-tvo">
                  {tx("t-tvo", "Introduction to Environmental Action")}
                </div>
              </button>
            )}
          </div>
        </div>
        <div className="sec-wrap" style={{ paddingTop: 44 }}>
          <div className="topic-grid">
            {topics.map((c) => (
              <button
                type="button"
                className="topic-card"
                key={c.key}
                onClick={() => openTopic(c.key)}
              >
                <div className={`tc-thumb ${c.thumb}`}>{c.icon}</div>
                <div className="tc-body">
                  <div className="tc-title" id={`tc-t${c.i}`}>
                    {c.title}
                  </div>
                  <div className="tc-desc" id={`tc-d${c.i}`}>
                    {c.desc}
                  </div>
                  <div className="tc-foot">
                    <span className="tc-pill" id={`tc-p${c.i}`}>
                      {c.pill}
                    </span>
                    <div className="tc-arr">→</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
