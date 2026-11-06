"use client";

import { useState } from "react";
import { T, type Locale } from "@/lib/i18n";
import type { ActCampaign } from "@/lib/views";

type Status = "idle" | "sending" | "ok" | "error";

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

  // Event submission form → POST /api/event
  const [evName, setEvName] = useState("");
  const [evLoc, setEvLoc] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evOrg, setEvOrg] = useState("");
  const [evStatus, setEvStatus] = useState<Status>("idle");
  const [evError, setEvError] = useState("");

  const submitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (evStatus === "sending") return;
    setEvStatus("sending");
    setEvError("");
    try {
      const res = await fetch("/api/event", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: evName,
          location: evLoc,
          date: evDate,
          organizer: evOrg,
          website: "", // honeypot
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Submission failed");
      setEvStatus("ok");
      setEvName("");
      setEvLoc("");
      setEvDate("");
      setEvOrg("");
    } catch (err) {
      setEvStatus("error");
      setEvError(err instanceof Error ? err.message : "Submission failed");
    }
  };

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
        <form className="event-box" onSubmit={submitEvent}>
          <div className="eb-l">
            <h3 id="t-evh">{tx("t-evh", "Submit Your Event")}</h3>
            <p id="t-evp">
              {tx("t-evp", "Planning community action? List it on Enviro-Hension and reach volunteers across Kenya.")}
            </p>
          </div>
          <div>
            <div className="fi-row">
              <input
                className="fi"
                type="text"
                id="ev-nm"
                placeholder="Event name"
                value={evName}
                onChange={(e) => setEvName(e.target.value)}
                required
              />
              <input
                className="fi"
                type="text"
                id="ev-loc"
                placeholder="Location / County"
                value={evLoc}
                onChange={(e) => setEvLoc(e.target.value)}
                required
              />
            </div>
            <div className="fi-row">
              <input
                className="fi"
                type="date"
                id="ev-dt"
                value={evDate}
                onChange={(e) => setEvDate(e.target.value)}
                required
              />
              <input
                className="fi"
                type="text"
                id="ev-org"
                placeholder="Your name / org"
                value={evOrg}
                onChange={(e) => setEvOrg(e.target.value)}
                required
              />
            </div>
            {/* honeypot */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: -9999, opacity: 0, height: 0, width: 0 }}
            />
            <button className="fi-sub" id="t-evsub" type="submit" disabled={evStatus === "sending"}>
              {evStatus === "sending"
                ? "…"
                : evStatus === "ok"
                  ? "✅ " + tx("t-evsub-ok", "Event Submitted")
                  : tx("t-evsub", "Submit Event →")}
            </button>
            {evStatus === "error" && (
              <p role="alert" style={{ color: "#b3261e", fontSize: 13, marginTop: 10 }}>
                {evError}
              </p>
            )}
            {evStatus === "ok" && (
              <p role="status" style={{ fontSize: 13, marginTop: 10 }}>
                {tx("t-evsub-done", "Thanks! An editor will review and list your event.")}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
