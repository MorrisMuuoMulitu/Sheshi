"use client";

import { T, type Locale } from "@/lib/i18n";
import type { ActCampaign } from "@/lib/views";

/** Act (Community Action) page — campaign cards + event submission box. */
export default function ActView({
  locale,
  campaigns,
}: {
  locale: Locale;
  campaigns: ActCampaign[];
}) {
  const t = T[locale];
  const tx = (k: string, fb: string) => t[k] ?? fb;

  return (
    <div className="page active" id="page-act">
      <div className="act-inner">
        <div className="sec-ey" id="t-aey">
          {tx("t-aey", "Community Action")}
        </div>
        <h2 className="sec-h" id="t-ah">
          {tx("t-ah", "Organize. Mobilize. Lead.")}
        </h2>
        <p className="sec-p" id="t-ap">
          {tx("t-ap", "Turn knowledge into action with campaign guides built for Kenyan communities.")}
        </p>
        <div className="camp-grid">
          {campaigns.map((c) => (
            <div className="camp-card" key={c.i}>
              <div className="cc-icon">{c.icon}</div>
              <div className="cc-t" id={`ca${c.i}t`}>
                {c.title}
              </div>
              <div className="cc-d" id={`ca${c.i}d`}>
                {c.desc}
              </div>
              <div className="cc-tags">
                {c.tags.map((tag) => (
                  <span className="ctag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <button className="cc-btn" id={`ca${c.i}b`}>
                {c.btn}
              </button>
            </div>
          ))}
        </div>
        <div className="event-box">
          <div className="eb-l">
            <h3 id="t-evh">{tx("t-evh", "Submit Your Event")}</h3>
            <p id="t-evp">
              {tx("t-evp", "Planning community action? List it on Enviro-Hension and reach volunteers across Kenya.")}
            </p>
          </div>
          <div>
            <div className="fi-row">
              <input className="fi" type="text" id="ev-nm" placeholder="Event name" />
              <input className="fi" type="text" id="ev-loc" placeholder="Location / County" />
            </div>
            <div className="fi-row">
              <input className="fi" type="date" id="ev-dt" />
              <input className="fi" type="text" id="ev-org" placeholder="Your name / org" />
            </div>
            <button className="fi-sub" id="t-evsub">
              {tx("t-evsub", "Submit Event →")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
