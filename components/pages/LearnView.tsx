"use client";

import { useState } from "react";
import { T, type Locale } from "@/lib/i18n";
import type { LearnTopic } from "@/lib/views";

/**
 * Learn page — topic grid + step-by-step detail (client interactivity).
 * Data arrives localized from the server (lib/cms.ts).
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
                <div className="tdv-overlay" onClick={(e) => (e.currentTarget.style.display = "none")}>
                  <div className="tdv-play">
                    <div className="tri"></div>
                  </div>
                </div>
              </div>
              <div className="res-hint">
                <div className="rh-ey">Resources for this topic</div>
                <h4 id="td-res-t">{topic.res}</h4>
                <p id="td-res-d">{topic.resD}</p>
                <button className="dl-btn" style={{ background: "var(--black)", color: "var(--sage)" }}>
                  ⬇ Download Kit
                </button>
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
              <div className="tvo-overlay" onClick={() => setIntroHidden(true)}>
                <div className="tvo-play">
                  <div className="tri"></div>
                </div>
                <div className="tvo-lbl" id="t-tvo">
                  {tx("t-tvo", "Introduction to Environmental Action")}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="sec-wrap" style={{ paddingTop: 44 }}>
          <div className="topic-grid">
            {topics.map((c) => (
              <div className="topic-card" key={c.key} onClick={() => openTopic(c.key)}>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
