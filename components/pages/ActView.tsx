"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { T, type Locale } from "@/lib/i18n";
import { downloadHref, type ActCampaign } from "@/lib/views";
import { Icon } from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";

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
  const isEn = locale === "en";

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
    <div className="page" id="page-act">
      <section className="page-head">
        <div className="container">
          <p className="eyebrow" id="t-aey">
            {tx("t-aey", "Community Action")}
          </p>
          <h1 id="t-ah">{tx("t-ah", "Organize. Mobilize. Lead.")}</h1>
          <p id="t-ap">
            {tx(
              "t-ap",
              "Turn knowledge into action with campaign guides built for Kenyan communities.",
            )}
          </p>
        </div>
      </section>

      <div className="container section">
        <div className="camp-grid">
          {campaigns.map((c, idx) => (
            <Reveal key={c.docId} delay={(idx % 3) + 1}>
              <article className="camp-card">
                <span className="icon-tile">
                  <Icon name={c.icon} size={24} />
                </span>
                <h3 id={`ca${c.i}t`}>{c.title}</h3>
                <p id={`ca${c.i}d`}>{c.desc}</p>
                <div className="camp-tags">
                  {c.tags.map((tag) => (
                    <span className="badge" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Get the Guide: file → download; topic → Learn; resource → library */}
                {c.guideUrl ? (
                  <a
                    className="btn btn-primary"
                    id={`ca${c.i}b`}
                    href={downloadHref(c.guideUrl, c.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download size={15} aria-hidden="true" />
                    {c.btn.replace(/^\S+\s*/, "")}
                  </a>
                ) : c.topicKey ? (
                  <Link
                    className="btn btn-primary"
                    id={`ca${c.i}b`}
                    href={`/${locale}/learn?topic=${c.topicKey}`}
                  >
                    {c.btn.replace(/^\S+\s*/, "")}
                  </Link>
                ) : c.resourceKey ? (
                  <Link className="btn btn-primary" id={`ca${c.i}b`} href={`/${locale}/build`}>
                    {c.btn.replace(/^\S+\s*/, "")}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    id={`ca${c.i}b`}
                    disabled
                    title={isEn ? "Guide coming soon" : "Mwongozo utakuja"}
                  >
                    {c.btn.replace(/^\S+\s*/, "")}
                  </button>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <form className="event-box" onSubmit={submitEvent} noValidate>
          <div>
            <p className="eyebrow" style={{ color: "var(--sage-300)" }}>
              {isEn ? "Community calendar" : "Kalenda ya jamii"}
            </p>
            <h2 id="t-evh">{tx("t-evh", "Submit Your Event")}</h2>
            <p id="t-evp">
              {tx(
                "t-evp",
                "Planning community action? List it on Enviro-Hension and reach volunteers across Kenya.",
              )}
            </p>
          </div>

          <div className="event-form">
            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="ev-nm">
                  {isEn ? "Event name" : "Jina la tukio"}
                </label>
                <input
                  className="input"
                  type="text"
                  id="ev-nm"
                  name="name"
                  autoComplete="off"
                  placeholder={isEn ? "River cleanup day" : "Siku ya kusafisha mto"}
                  value={evName}
                  onChange={(e) => setEvName(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="ev-loc">
                  {isEn ? "Location or county" : "Mahali au kaunti"}
                </label>
                <input
                  className="input"
                  type="text"
                  id="ev-loc"
                  name="location"
                  autoComplete="address-level2"
                  placeholder={isEn ? "Machakos County" : "Kaunti ya Machakos"}
                  value={evLoc}
                  onChange={(e) => setEvLoc(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="ev-dt">
                  {isEn ? "Event date" : "Tarehe ya tukio"}
                </label>
                <input
                  className="input"
                  type="date"
                  id="ev-dt"
                  name="date"
                  value={evDate}
                  onChange={(e) => setEvDate(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="ev-org">
                  {isEn ? "Your name or organisation" : "Jina lako au chamao"}
                </label>
                <input
                  className="input"
                  type="text"
                  id="ev-org"
                  name="organizer"
                  autoComplete="organization"
                  placeholder={isEn ? "Riverside Youth Group" : "Kundi ya Vijana wa Mto"}
                  value={evOrg}
                  onChange={(e) => setEvOrg(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* honeypot */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hp-field"
            />

            <div>
              <button
                className="btn btn-brand btn-block"
                id="t-evsub"
                type="submit"
                disabled={evStatus === "sending"}
              >
                {evStatus === "sending" ? (
                  <>
                    <Loader2 size={16} aria-hidden="true" className="spin" />
                    {isEn ? "Sending…" : "Inatuma…"}
                  </>
                ) : evStatus === "ok" ? (
                  <>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    {tx("t-evsub-ok", "Event Submitted")}
                  </>
                ) : (
                  tx("t-evsub", "Submit Event →")
                )}
              </button>

              {evStatus === "error" && (
                <p className="form-status form-status-error" role="alert" style={{ marginTop: 12 }}>
                  <Icon name="error" size={16} />
                  {evError}
                </p>
              )}
              {evStatus === "ok" && (
                <p className="form-status form-status-success" role="status" style={{ marginTop: 12 }}>
                  <Icon name="check" size={16} />
                  {tx("t-evsub-done", "Thanks! An editor will review and list your event.")}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
