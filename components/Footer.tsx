"use client";

import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import { openShareModal } from "@/lib/ui";
import type { SiteSettings } from "@/lib/views";

/**
 * Shared footer — ported from the legacy footerHTML() injector.
 * Contact details, socials, tagline, and legal lines now come from the
 * CMS `settings` singleton (PLAN.md Phase 5.2). Socials without a URL
 * render as visibly disabled (no `href="#"` anywhere).
 */
export default function Footer({
  locale,
  settings,
}: {
  locale: Locale;
  settings: SiteSettings;
}) {
  const base = `/${locale}`;
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="fg-brand">
          <img src="/logo.png" alt="Enviro-Hension" />
          <h3>{settings.siteName.toUpperCase()}</h3>
          <p>{settings.tagline}</p>
          <div className="footer-socials">
            {settings.socials.map((s) =>
              s.url ? (
                <a
                  key={s.platform}
                  className="fsoc"
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
                  className="fsoc"
                  title={`${s.platform} — link coming soon`}
                  aria-disabled="true"
                  style={{ opacity: 0.4, cursor: "not-allowed" }}
                >
                  {s.icon}
                </span>
              ),
            )}
          </div>
        </div>
        <div className="footer-col">
          <h4>Navigate</h4>
          <Link href={`${base}/learn`}>Learn</Link>
          <Link href={`${base}/build`}>Build</Link>
          <Link href={`${base}/act`}>Act</Link>
          <Link href={`${base}/work`}>Our Work</Link>
          <Link href={`${base}/contact`}>Contact</Link>
        </div>
        <div className="footer-col">
          <h4>Resources</h4>
          <Link href={`${base}/build`}>Templates</Link>
          <Link href={`${base}/build`}>Toolkits</Link>
          <Link href={`${base}/build`}>Zines</Link>
          <a onClick={() => openShareModal()} style={{ cursor: "pointer" }}>
            Share a Story
          </a>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <address>
            {settings.siteName}
            <br />
            {settings.city}
            <br />
            <br />
            {settings.contactEmail}
            {settings.phone && (
              <>
                <br />
                {settings.phone}
              </>
            )}
          </address>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{settings.copyright}</p>
        <p>{settings.footerNote}</p>
      </div>
    </footer>
  );
}
