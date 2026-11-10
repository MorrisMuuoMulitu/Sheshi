"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { T, type Locale } from "@/lib/i18n";
import ThemeToggle from "@/components/ui/ThemeToggle";

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
  // The route the drawer was opened on. The drawer is open only while the
  // route is unchanged, so a navigation (including browser back/forward)
  // closes it without needing a state update inside an effect.
  const [openedAt, setOpenedAt] = useState(pathname);
  const drawerOpen = open && openedAt === pathname;
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const t = T[locale];
  const base = `/${locale}`;

  const isActive = (path: string) =>
    path === "" ? pathname === base : pathname.startsWith(`${base}/${path}`);

  // The home page opens on a dark photographic hero, so the nav starts
  // transparent over it and becomes solid as soon as the page scrolls.
  const overHero = pathname === base && !scrolled && !open;

  /** Same page, other language. */
  const otherLocale: Locale = locale === "en" ? "sw" : "en";
  const switchHref = pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`;

  // Elevated nav shadow once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the drawer is open: lock the body, close on Escape, and trap focus.
  useEffect(() => {
    if (!drawerOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    // Move focus into the drawer so keyboard users land in the new context.
    drawerRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  const openDrawer = () => {
    setOpenedAt(pathname);
    setOpen(true);
  };

  const close = () => setOpen(false);

  return (
    <>
      <nav
        id="main-nav"
        className={`nav${scrolled ? " is-scrolled" : ""}${overHero ? " is-transparent" : ""}`}
      >
        <Link className="nav-logo" href={base} onClick={close}>
          <Image id="nav-logo-img" src="/mark-tile.png" alt="" width={72} height={64} priority />
          <span className="nav-brand">ENVIRO-HENSION</span>
        </Link>

        <ul className="nav-links">
          {items.map((it) => (
            <li key={it.id}>
              <Link
                href={it.path === "" ? base : `${base}/${it.path}`}
                id={`nl-${it.id}`}
                className={`nav-link${isActive(it.path) ? " is-active" : ""}`}
                aria-current={isActive(it.path) ? "page" : undefined}
              >
                {t[it.key] ?? it.fallback}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <div className="lang-switch" role="group" aria-label="Language">
            <Link
              className={`lb${locale === "en" ? " is-active" : ""}`}
              id="lb-en"
              href={switchHref}
              hrefLang="en"
              aria-current={locale === "en" ? "true" : undefined}
            >
              EN
            </Link>
            <Link
              className={`lb${locale === "sw" ? " is-active" : ""}`}
              id="lb-sw"
              href={switchHref}
              hrefLang="sw"
              aria-current={locale === "sw" ? "true" : undefined}
            >
              SW
            </Link>
          </div>

          <ThemeToggle
            labelLight={locale === "en" ? "Switch to light theme" : "Badilisha mandhari ya mchana"}
            labelDark={locale === "en" ? "Switch to dark theme" : "Badilisha mandhari ya usiku"}
          />

          <Link className="btn btn-primary nav-cta" id="t-join" href={`${base}/contact`}>
            {t["t-join"] ?? "Join Movement"}
          </Link>

          <button
            ref={hamburgerRef}
            className={`hamburger${drawerOpen ? " is-open" : ""}`}
            id="hamburger-btn"
            type="button"
            onClick={() => (drawerOpen ? close() : openDrawer())}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        ref={drawerRef}
        className={`drawer${drawerOpen ? " is-open" : ""}`}
        id="mobile-menu"
        inert={!drawerOpen}
      >
        {items.map((it) => (
          <Link
            key={it.id}
            href={it.path === "" ? base : `${base}/${it.path}`}
            id={`mn-${it.id}`}
            className={`drawer-link${isActive(it.path) ? " is-active" : ""}`}
            aria-current={isActive(it.path) ? "page" : undefined}
            onClick={close}
            tabIndex={drawerOpen ? 0 : -1}
          >
            {t[it.key] ?? it.fallback}
            <ArrowRight aria-hidden="true" />
          </Link>
        ))}
        <div className="drawer-foot">
          <div className="drawer-lang">
            <Link
              className={locale === "en" ? "is-active" : ""}
              href={switchHref}
              hrefLang="en"
              tabIndex={drawerOpen ? 0 : -1}
            >
              EN — English
            </Link>
            <Link
              className={locale === "sw" ? "is-active" : ""}
              href={switchHref}
              hrefLang="sw"
              tabIndex={drawerOpen ? 0 : -1}
            >
              SW — Kiswahili
            </Link>
          </div>
          <Link
            className="btn btn-primary btn-block"
            href={`${base}/contact`}
            onClick={close}
            tabIndex={drawerOpen ? 0 : -1}
          >
            {t["t-join"] ?? "Join Movement"}
          </Link>
        </div>
      </div>
    </>
  );
}
