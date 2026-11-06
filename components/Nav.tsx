"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { T, type Locale } from "@/lib/i18n";

const items = [
  { id: "home", path: "", key: "nl-home", fallback: "Home" },
  { id: "learn", path: "learn", key: "nl-learn", fallback: "Learn" },
  { id: "build", path: "build", key: "nl-build", fallback: "Build" },
  { id: "act", path: "act", key: "nl-act", fallback: "Act" },
  { id: "work", path: "work", key: "nl-work", fallback: "Our Work" },
  { id: "contact", path: "contact", key: "nl-contact", fallback: "Contact" },
];

export default function Nav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = T[locale];
  const base = `/${locale}`;

  const isActive = (path: string) =>
    path === "" ? pathname === base : pathname.startsWith(`${base}/${path}`);

  /** Same page, other language. */
  const otherLocale: Locale = locale === "en" ? "sw" : "en";
  const switchHref = pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`;

  return (
    <>
      <nav id="main-nav">
        <Link className="nav-logo" href={base} onClick={() => setOpen(false)}>
          <img id="nav-logo-img" src="/logo.png" alt="" />
          <span className="nav-brand">ENVIRO-HENSION</span>
        </Link>
        <ul className="nav-links">
          {items.map((it) => (
            <li key={it.id}>
              <Link
                href={it.path === "" ? base : `${base}/${it.path}`}
                id={`nl-${it.id}`}
                className={isActive(it.path) ? "active" : undefined}
              >
                {t[it.key] ?? it.fallback}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-r">
          <div className="lang-sw">
            <Link
              className={`lb${locale === "en" ? " on" : ""}`}
              id="lb-en"
              href={switchHref}
            >
              EN
            </Link>
            <Link
              className={`lb${locale === "sw" ? " on" : ""}`}
              id="lb-sw"
              href={switchHref}
            >
              SW
            </Link>
          </div>
          <Link className="nav-cta" id="t-join" href={`${base}/contact`}>
            {t["t-join"] ?? "Join Movement"}
          </Link>
          <button
            className={`hamburger${open ? " open" : ""}`}
            id="hamburger-btn"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`mobile-menu${open ? " open" : ""}`} id="mobile-menu">
        {items.map((it) => (
          <Link
            key={it.id}
            href={it.path === "" ? base : `${base}/${it.path}`}
            id={`mn-${it.id}`}
            onClick={() => setOpen(false)}
          >
            {t[it.key] ?? it.fallback}
          </Link>
        ))}
        <div className="m-lang">
          <Link className={locale === "en" ? "on" : ""} href={switchHref}>
            EN — English
          </Link>
          <Link className={locale === "sw" ? "on" : ""} href={switchHref}>
            SW — Kiswahili
          </Link>
        </div>
      </div>
    </>
  );
}
