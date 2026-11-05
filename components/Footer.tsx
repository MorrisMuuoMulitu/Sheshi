"use client";

import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import { openShareModal } from "@/lib/ui";

/**
 * Shared footer — ported from the legacy footerHTML() injector.
 * Kept in English for visual parity (the legacy site never translated it);
 * move strings into the CMS `settings` document in Phase 5.
 */
export default function Footer({ locale }: { locale: Locale }) {
  const base = `/${locale}`;
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="fg-brand">
          <img src="/logo.png" alt="Enviro-Hension" />
          <h3>ENVIRO-HENSION</h3>
          <p>
            Discover, Engage, Empower. Building environmental capacity across
            Kenya — in English and Kiswahili.
          </p>
          <div className="footer-socials">
            <a className="fsoc" href="#" title="X">𝕏</a>
            <a className="fsoc" href="#" title="LinkedIn">in</a>
            <a className="fsoc" href="#" title="Facebook">f</a>
            <a className="fsoc" href="#" title="Instagram">📸</a>
            <a className="fsoc" href="#" title="YouTube">▶</a>
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
            Enviro-Hension
            <br />
            Nairobi, Kenya
            <br />
            <br />
            info@envirohension.org
            <br />
            +254 700 000 000
          </address>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Enviro-Hension. All rights reserved.</p>
        <p>Built for Kenya&apos;s environmental leaders</p>
      </div>
    </footer>
  );
}
