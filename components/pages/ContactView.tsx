"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { T, type Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/views";
import { Icon } from "@/components/ui/Icon";
import { socialBrandIcon } from "@/components/ui/SocialIcons";

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
  const isEn = locale === "en";

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
    <div className="page" id="page-contact" style={{ background: "var(--bg-inverse)" }}>
      <div className="container section">
        <div className="contact-grid">
          <div>
            <p className="eyebrow" style={{ color: "var(--brand-300)" }} id="t-cey">
              {tx("t-cey", "Get In Touch")}
            </p>
            <h1 className="contact-title" id="t-ch">
              {tx("t-ch", "Let's Build This Together")}
            </h1>
            <p className="contact-lede" id="t-cp">
              {tx(
                "t-cp",
                "Reach out to partner, volunteer, or share your community's work. We respond in both English and Kiswahili.",
              )}
            </p>

            {settings.socials.length > 0 && (
              <div className="csoc-row">
                {settings.socials.map((s) => {
                  const IconCmp = socialBrandIcon(s.platform);
                  return s.url ? (
                    <a
                      key={s.platform}
                      className="social-btn"
                      href={s.url}
                      title={s.platform}
                      aria-label={`${s.platform} — ${settings.siteName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {IconCmp ? (
                        <IconCmp aria-hidden="true" />
                      ) : (
                        <span aria-hidden="true">{s.icon}</span>
                      )}
                    </a>
                  ) : (
                    <span
                      key={s.platform}
                      className="social-btn"
                      title={`${s.platform} — ${isEn ? "link coming soon" : "kiungo kitataka kuja"}`}
                      role="button"
                      aria-disabled="true"
                      aria-label={`${s.platform} — ${isEn ? "link coming soon" : "kiungo kitataka kuja"}`}
                    >
                      {IconCmp ? (
                        <IconCmp aria-hidden="true" />
                      ) : (
                        <span aria-hidden="true">{s.icon}</span>
                      )}
                    </span>
                  );
                })}
              </div>
            )}

            <form className="nl-box" onSubmit={submitNewsletter}>
              <h2 id="t-nlh">{tx("t-nlh", "Stay in the Loop")}</h2>
              <p id="t-nlp">
                {settings.subscribeBlurb ||
                  tx("t-nlp", "Monthly digest of tools, events, and stories. No spam.")}
              </p>
              {/* honeypot — hidden from real users */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hp-field"
              />
              <div className="nl-row">
                <input
                  className="input"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  id="nl-inp"
                  aria-label={isEn ? "Email address for the newsletter" : "Barua pepe kwa ajenda"}
                  autoComplete="email"
                  value={nlEmail}
                  onChange={(e) => setNlEmail(e.target.value)}
                  required
                />
                <button
                  className="btn btn-brand"
                  id="t-nlb"
                  type="submit"
                  disabled={nlStatus === "sending"}
                >
                  {nlStatus === "sending" ? (
                    <Loader2 size={16} aria-hidden="true" className="spin" />
                  ) : nlStatus === "ok" ? (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  ) : null}
                  {nlStatus === "ok"
                    ? tx("t-nlb-ok", "Subscribed")
                    : tx("t-nlb", "Subscribe")}
                </button>
              </div>
              {nlStatus === "error" && (
                <p className="form-status form-status-error" role="alert" style={{ marginTop: 10 }}>
                  <Icon name="error" size={16} />
                  {nlError}
                </p>
              )}
              {nlStatus === "ok" && (
                <p className="form-status form-status-success" role="status" style={{ marginTop: 10 }}>
                  <Icon name="check" size={16} />
                  {tx("t-nlb-done", "You're on the list — asante!")}
                </p>
              )}
            </form>
          </div>

          <form className="cform" onSubmit={submitContact} noValidate>
            <h2 id="t-cfh">{tx("t-cfh", "Send a Message")}</h2>

            <div className="field">
              <label className="field-label" htmlFor="cf-name" id="t-cfl1">
                {tx("t-cfl1", "Your Name")}
              </label>
              <input
                className="input"
                id="cf-name"
                name="name"
                type="text"
                placeholder={isEn ? "Full name" : "Jina kamili"}
                autoComplete="name"
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="cf-email" id="t-cfl2">
                {tx("t-cfl2", "Email")}
              </label>
              <input
                className="input"
                id="cf-email"
                name="email"
                type="email"
                placeholder="you@email.com"
                autoComplete="email"
                value={cEmail}
                onChange={(e) => setCEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="cf-subject" id="t-cfl3">
                {tx("t-cfl3", "Subject")}
              </label>
              <input
                className="input"
                id="cf-subject"
                name="subject"
                type="text"
                placeholder={isEn ? "What's this about?" : "Ni nini hasa?"}
                value={cSubject}
                onChange={(e) => setCSubject(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="cf-body" id="t-cfl4">
                {tx("t-cfl4", "Message")}
              </label>
              <textarea
                className="textarea"
                id="cf-body"
                name="body"
                placeholder={isEn ? "Your message..." : "Ujumbe wako..."}
                value={cBody}
                onChange={(e) => setCBody(e.target.value)}
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
              className="hp-field"
            />

            <button className="btn btn-brand btn-block" id="t-cfb" type="submit" disabled={cStatus === "sending"}>
              {cStatus === "sending" ? (
                <Loader2 size={16} aria-hidden="true" className="spin" />
              ) : cStatus === "ok" ? (
                <CheckCircle2 size={16} aria-hidden="true" />
              ) : null}
              {cStatus === "sending"
                ? isEn
                  ? "Sending…"
                  : "Inatuma…"
                : cStatus === "ok"
                  ? tx("t-cfb-sent", "Message Sent")
                  : tx("t-cfb", "Send Message →")}
            </button>

            {cStatus === "error" && (
              <p className="form-status form-status-error" role="alert" style={{ marginTop: 10 }}>
                <Icon name="error" size={16} />
                {cError}
              </p>
            )}
            {cStatus === "ok" && (
              <p className="form-status form-status-success" role="status" style={{ marginTop: 10 }}>
                <Icon name="check" size={16} />
                {tx("t-cfb-done", "Thanks! We'll get back to you soon.")}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
