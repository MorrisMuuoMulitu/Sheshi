"use client";

import { useState } from "react";
import { T, type Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/views";

type Status = "idle" | "sending" | "ok" | "error";

/**
 * Contact page — newsletter + contact form, both submitting to the
 * Phase 4 API routes (`/api/newsletter`, `/api/contact`) with inline
 * success/error states (no alerts). Socials + newsletter blurb come from
 * the CMS settings singleton (Phase 5.2); socials without a URL render
 * visibly disabled instead of `href="#"`.
 */
export default function ContactView({
  locale,
  settings,
}: {
  locale: Locale;
  settings: SiteSettings;
}) {
  const t = T[locale];
  const tx = (k: string, fb: string) => t[k] ?? fb;

  // Newsletter
  const [nlEmail, setNlEmail] = useState("");
  const [nlStatus, setNlStatus] = useState<Status>("idle");
  const [nlError, setNlError] = useState("");

  // Contact form
  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cSubject, setCSubject] = useState("");
  const [cBody, setCBody] = useState("");
  const [cStatus, setCStatus] = useState<Status>("idle");
  const [cError, setCError] = useState("");

  const submitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nlStatus === "sending") return;
    setNlStatus("sending");
    setNlError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: nlEmail, website: "" }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Subscription failed");
      setNlStatus("ok");
      setNlEmail("");
    } catch (err) {
      setNlStatus("error");
      setNlError(err instanceof Error ? err.message : "Subscription failed");
    }
  };

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cStatus === "sending") return;
    setCStatus("sending");
    setCError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: cName,
          email: cEmail,
          subject: cSubject,
          body: cBody,
          website: "", // honeypot
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Send failed");
      setCStatus("ok");
      setCName("");
      setCEmail("");
      setCSubject("");
      setCBody("");
    } catch (err) {
      setCStatus("error");
      setCError(err instanceof Error ? err.message : "Send failed");
    }
  };

  return (
    <div className="page active" id="page-contact">
      <div className="contact-inner">
        <div className="contact-grid">
          <div>
            <div className="sec-ey inv" style={{ marginBottom: 10 }} id="t-cey">
              {tx("t-cey", "Get In Touch")}
            </div>
            <h2 className="cti" id="t-ch">
              {tx("t-ch", "Let's Build This Together")}
            </h2>
            <p className="ctp" id="t-cp">
              {tx(
                "t-cp",
                "Reach out to partner, volunteer, or share your community's work. We respond in both English and Kiswahili.",
              )}
            </p>
            <div className="csoc-row">
              {settings.socials.map((s) =>
                s.url ? (
                  <a
                    key={s.platform}
                    className="csoc"
                    href={s.url}
                    title={s.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.icon}
                  </a>
                ) : (
                  <span
                    key={s.platform}
                    className="csoc"
                    title={`${s.platform} — link coming soon`}
                    aria-disabled="true"
                    style={{ opacity: 0.4, cursor: "not-allowed" }}
                  >
                    {s.icon}
                  </span>
                ),
              )}
            </div>
            <form className="nl-box" onSubmit={submitNewsletter}>
              <h4 id="t-nlh">{tx("t-nlh", "Stay in the Loop")}</h4>
              <p id="t-nlp">
                {settings.subscribeBlurb || tx("t-nlp", "Monthly digest of tools, events, and stories. No spam.")}
              </p>
              {/* honeypot — hidden from real users */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                style={{ position: "absolute", left: -9999, opacity: 0, height: 0, width: 0 }} />
              <div className="nl-row">
                <input
                  className="nl-in"
                  type="email"
                  placeholder="your@email.com"
                  id="nl-inp"
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  required
                />
                <button className="nl-sub" id="t-nlb" type="submit" disabled={nlStatus === "sending"}>
                  {nlStatus === "sending"
                    ? "…"
                    : nlStatus === "ok"
                      ? "✅ " + tx("t-nlb-ok", "Subscribed")
                      : tx("t-nlb", "Subscribe")}
                </button>
              </div>
              {nlStatus === "error" && (
                <p role="alert" style={{ color: "#b3261e", fontSize: 13, marginTop: 8 }}>
                  {nlError}
                </p>
              )}
              {nlStatus === "ok" && (
                <p role="status" style={{ fontSize: 13, marginTop: 8 }}>
                  {tx("t-nlb-done", "You're on the list — asante!")}
                </p>
              )}
            </form>
          </div>
          <form className="cform" onSubmit={submitContact}>
            <h3 id="t-cfh">{tx("t-cfh", "Send a Message")}</h3>
            <label className="cf-l" htmlFor="cf-name" id="t-cfl1">
              {tx("t-cfl1", "Your Name")}
            </label>
            <input
              className="cf-in"
              id="cf-name"
              type="text"
              placeholder="Full name"
              value={cName}
              onChange={(e) => setCName(e.target.value)}
              required
            />
            <label className="cf-l" htmlFor="cf-email" id="t-cfl2">
              {tx("t-cfl2", "Email")}
            </label>
            <input
              className="cf-in"
              id="cf-email"
              type="email"
              placeholder="you@email.com"
              value={cEmail}
              onChange={(e) => setCEmail(e.target.value)}
              required
            />
            <label className="cf-l" htmlFor="cf-subject" id="t-cfl3">
              {tx("t-cfl3", "Subject")}
            </label>
            <input
              className="cf-in"
              id="cf-subject"
              type="text"
              placeholder="What's this about?"
              value={cSubject}
              onChange={(e) => setCSubject(e.target.value)}
              required
            />
            <label className="cf-l" htmlFor="cf-body" id="t-cfl4">
              {tx("t-cfl4", "Message")}
            </label>
            <textarea
              className="cf-ta"
              id="cf-body"
              placeholder="Your message..."
              value={cBody}
              onChange={(e) => setCBody(e.target.value)}
              required
            />
            {/* honeypot */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
              style={{ position: "absolute", left: -9999, opacity: 0, height: 0, width: 0 }} />
            <button className="cf-sub" id="t-cfb" type="submit" disabled={cStatus === "sending"}>
              {cStatus === "sending"
                ? "…"
                : cStatus === "ok"
                  ? "✅ " + tx("t-cfb-sent", "Message Sent")
                  : tx("t-cfb", "Send Message →")}
            </button>
            {cStatus === "error" && (
              <p role="alert" style={{ color: "#b3261e", fontSize: 13, marginTop: 10 }}>
                {cError}
              </p>
            )}
            {cStatus === "ok" && (
              <p role="status" style={{ fontSize: 13, marginTop: 10 }}>
                {tx("t-cfb-done", "Thanks! We'll get back to you soon.")}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
