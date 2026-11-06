"use client";

import Link from "next/link";
import { T, type Locale } from "@/lib/i18n";
import { openShareModal } from "@/lib/ui";

/**
 * Home page (client interactivity: hero video, scroll CTA, share card).
 * `heroVideoUrl` comes from the CMS settings singleton — when empty the
 * video player is dropped entirely (PLAN.md Phase 5.3: no stock footage).
 */
export default function HomeView({
  locale,
  heroVideoUrl,
}: {
  locale: Locale;
  heroVideoUrl: string;
}) {
  const t = T[locale];
  const base = `/${locale}`;
  const tx = (k: string, fallback: string) => t[k] ?? fallback;

  const playHeroVid = () => {
    const vid = document.getElementById("hero-vid") as HTMLVideoElement | null;
    const vo = document.getElementById("hero-vo") as HTMLElement | null;
    if (!vid || !vo) return;
    void vid.play();
    vo.style.display = "none";
  };

  return (
    <div className="page active" id="page-home">
      <div
        className="hero-bg"
        id="hero-bg-el"
        style={{ background: "#DBEBBB !important", backgroundImage: "none !important" }}
      ></div>
      <div className="hero-bg-tint"></div>
      <div className="hblob hb1"></div>
      <div className="hblob hb2"></div>
      <div className="hblob hb3"></div>
      <div className="hblob hb4"></div>
      <div className="hb-dots"></div>
      <div className="hb-plus">+</div>

      <div className="hero-inner">
        {/* HERO TWO-COLUMN LAYOUT */}
        <div
          className="hero-two-col"
          style={heroVideoUrl ? undefined : { gridTemplateColumns: "1fr" }}
        >
          {/* LEFT: Logo + brand */}
          <div className="hero-left">
            <div className="hero-logo-block">
              <img id="hero-logo-img" src="/logo.png" alt="" />
              <div>
                <div className="hero-brand-name">ENVIRO-HENSION</div>
                <div className="hero-tagline-txt" id="t-tagline">
                  {tx("t-tagline", "Discover · Engage · Empower")}
                </div>
              </div>
            </div>
            <p className="hero-intro-txt" id="t-heroIntro">
              {tx(
                "t-heroIntro",
                "A capacity-building platform for environmental community leaders — in English and Kiswahili.",
              )}
            </p>
            <button
              className="hero-scroll-cta"
              onClick={() =>
                document
                  .getElementById("hero-cards-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span id="t-explore-btn">{tx("t-explore-btn", "Explore Below")}</span> ↓
            </button>
          </div>
          {/* RIGHT: Video — only when the CMS has a real video URL */}
          {heroVideoUrl && (
            <div className="hero-right">
              <div className="hero-video-wrap" id="hero-video-wrap">
                <video id="hero-vid" preload="none" src={heroVideoUrl} />
                <div className="video-overlay" id="hero-vo" onClick={playHeroVid}>
                  <div className="play-btn">
                    <div className="play-tri"></div>
                  </div>
                  <div className="vo-label" id="t-vlabel">
                    {tx("t-vlabel", "Watch: Our Story")}
                  </div>
                  <div className="vo-sub" id="t-vsub">
                    {tx("t-vsub", "Discover what Enviro-Hension is building")}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3 ACTION CARDS */}
        <div id="hero-cards-section"></div>
        <div className="action-cards">
          <Link className="ac" href={`${base}/learn`}>
            <span className="ac-icon">📚</span>
            <span className="ac-title" id="t-ac1">
              {tx("t-ac1", "Learn")}
            </span>
            <div className="ac-desc" id="t-ac1d">
              {tx(
                "t-ac1d",
                "Master environmental action frameworks with video guides and step-by-step modules.",
              )}
            </div>
            <span className="ac-arr" id="t-ac1a">
              {tx("t-ac1a", "Explore modules →")}
            </span>
          </Link>
          <Link className="ac" href={`${base}/build`}>
            <span className="ac-icon">🛠</span>
            <span className="ac-title" id="t-ac2">
              {tx("t-ac2", "Build")}
            </span>
            <div className="ac-desc" id="t-ac2d">
              {tx(
                "t-ac2d",
                "Download blueprints, toolkits, zines and templates to run campaigns in your community.",
              )}
            </div>
            <span className="ac-arr" id="t-ac2a">
              {tx("t-ac2a", "Get resources →")}
            </span>
          </Link>
          <Link className="ac" href={`${base}/act`}>
            <span className="ac-icon">🤝</span>
            <span className="ac-title" id="t-ac3">
              {tx("t-ac3", "Act")}
            </span>
            <div className="ac-desc" id="t-ac3d">
              {tx(
                "t-ac3d",
                "Mobilize your community. Run campaigns, submit events, and lead the change.",
              )}
            </div>
            <span className="ac-arr" id="t-ac3a">
              {tx("t-ac3a", "Start mobilizing →")}
            </span>
          </Link>
        </div>

        {/* SHARE CARD */}
        <div className="share-card">
          <div className="share-card-left">
            <div className="sc-icon">🌿</div>
            <div className="sc-text">
              <h4 id="t-sch">{tx("t-sch", "Share Your Story")}</h4>
              <p id="t-scp">
                {tx(
                  "t-scp",
                  "Upload photos, templates, blueprints, or tell your community's environmental story.",
                )}
              </p>
            </div>
          </div>
          <button type="button" className="sc-btn" id="t-scb" onClick={() => openShareModal()}>
            {tx("t-scb", "Share Now →")}
          </button>
        </div>
      </div>

      <div className="scroll-cue">
        <div className="sc-line"></div>
      </div>
    </div>
  );
}
