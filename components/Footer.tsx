"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { type Locale } from "@/lib/i18n";
import { openShareModal } from "@/lib/ui";
import type { SiteSettings } from "@/lib/views";
import { socialBrandIcon } from "@/components/ui/SocialIcons";

/**
 * Shared footer — contact details, socials, tagline, and legal lines come
 * from the CMS `settings` singleton. Socials without a URL render as
 * visibly disabled (no `href="#"` anywhere).
 */
export default function Footer({
  locale,
  settings,
}: {
  locale: Locale;
  settings: SiteSettings;
}) {
  const base = `/${locale}`;
  const isEn = locale === "en";

  const navigate = isEn
    ? [
        { href: `${base}/learn`, label: "Learn" },
        { href: `${base}/build`, label: "Build" },
        { href: `${base}/act`, label: "Act" },
        { href: `${base}/work`, label: "Our Work" },
        { href: `${base}/contact`, label: "Contact" },
      ]
    : [
        { href: `${base}/learn`, label: "Jifunze" },
        { href: `${base}/build`, label: "Jenga" },
        { href: `${base}/act`, label: "Tenda" },
        { href: `${base}/work`, label: "Kazi Yetu" },
        { href: `${base}/contact`, label: "Wasiliana" },
      ];

  const resources = isEn
    ? [
        { href: `${base}/build`, label: "Templates" },
        { href: `${base}/build`, label: "Toolkits" },
        { href: `${base}/build`, label: "Zines" },
      ]
    : [
        { href: `${base}/build`, label: "Violezo" },
        { href: `${base}/build`, label: "Zana" },
        { href: `${base}/build`, label: "Machapisho" },
      ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src="/logo.png" alt="" width={88} height={88} />
            <h2>{settings.siteName.toUpperCase()}</h2>
            <p>{settings.tagline}</p>
            <div className="footer-socials">
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
          </div>

          <nav className="footer-col" aria-label={isEn ? "Navigate" : "Navigate"}>
            <h2>{isEn ? "Navigate" : "Navigate"}</h2>
            {navigate.map((l) => (
              <Link key={l.href + l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>

          <nav className="footer-col" aria-label={isEn ? "Resources" : "Rasilimali"}>
            <h2>{isEn ? "Resources" : "Rasilimali"}</h2>
            {resources.map((l) => (
              <Link key={l.href + l.label} href={l.href}>
                {l.label}
              </Link>
            ))}
            <button type="button" onClick={() => openShareModal()}>
              {isEn ? "Share a Story" : "Shiriki Hadithi"}
            </button>
          </nav>

          <div className="footer-col">
            <h2>{isEn ? "Contact" : "Wasiliana"}</h2>
            <address>
              {settings.siteName}
              <br />
              <span className="row" style={{ gap: 8, justifyContent: "flex-start" }}>
                <MapPin size={14} aria-hidden="true" />
                {settings.city}
              </span>
              <br />
              <br />
              <a href={`mailto:${settings.contactEmail}`} className="row" style={{ gap: 8 }}>
                <Mail size={14} aria-hidden="true" />
                {settings.contactEmail}
              </a>
              {settings.phone && (
                <>
                  <br />
                  <a href={`tel:${settings.phone.replace(/\s+/g, "")}`}>{settings.phone}</a>
                </>
              )}
            </address>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{settings.copyright}</p>
          <p>{settings.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}
