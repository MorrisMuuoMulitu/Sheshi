"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { T, type Locale } from "@/lib/i18n";
import { openShareModal } from "@/lib/ui";
import { Icon } from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";

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
  const isEn = locale === "en";

  const playHeroVid = () => {
    const vid = document.getElementById("hero-vid") as HTMLVideoElement | null;
    const vo = document.getElementById("hero-vo") as HTMLElement | null;
    if (!vid || !vo) return;
    void vid.play();
    vo.style.display = "none";
  };

  const pillars = [
    {
      accent: "learn",
      icon: "book",
      title: tx("t-ac1", "Learn"),
      desc: tx(
        "t-ac1d",
        "Master environmental action frameworks with video guides and step-by-step modules.",
      ),
      cta: tx("t-ac1a", "Explore modules"),
      href: `${base}/learn`,
    },
    {
      accent: "build",
      icon: "tools",
      title: tx("t-ac2", "Build"),
      desc: tx(
        "t-ac2d",
        "Download blueprints, toolkits, zines and templates to run campaigns in your community.",
      ),
      cta: tx("t-ac2a", "Get resources"),
      href: `${base}/build`,
    },
    {
      accent: "act",
      icon: "hands",
      title: tx("t-ac3", "Act"),
      desc: tx(
        "t-ac3d",
        "Mobilize your community. Run campaigns, submit events, and lead the change.",
      ),
      cta: tx("t-ac3a", "Start mobilizing"),
      href: `${base}/act`,
    },
  ];

  const steps = isEn
    ? [
        {
          title: "Choose a topic",
          desc: "Pick a module — river cleanup, tree planting, waste management, coastal protection, air quality or clean energy.",
        },
        {
          title: "Download the tools",
          desc: "Every module ships with a field kit: checklists, safety protocols, budgets and printable templates.",
        },
        {
          title: "Run it locally",
          desc: "Organise the event, submit it to the platform, and let volunteers across Kenya find it.",
        },
      ]
    : [
        {
          title: "Chagua mada",
          desc: "Chagua moduli — kusafisha mto, kupandaji miti, usimamizi wa taka, ulinzi wa pwani, ubora wa hewa au nishati mbadala.",
        },
        {
          title: "Pakua zana",
          desc: "Kila moduli ina kifurushi cha uwandishi: majedwali, usalama, bajeti na vielezo vya kuprintiwa.",
        },
        {
          title: "Endesha locally",
          desc: "Panga tukio, wasilisha kwenye tovuti, na wa volunteers wa Kenya wanaipate.",
        },
      ];

  const stats = isEn
    ? [
        { n: "6", l: "Modules" },
        { n: "EN/SW", l: "Bilingual" },
        { n: "100%", l: "Free resources" },
      ]
    : [
        { n: "6", l: "Moduli" },
        { n: "EN/SW", l: "Lugha mbili" },
        { n: "100%", l: "Rasilimali bure" },
      ];

  const heroTitle = isEn
    ? "Capacity for the people who protect Kenya's environment."
    : "Uwezo kwa watu unaolinda mazingira ya Kenya.";

  return (
    <div className="page page-home" id="page-home">
      <div className="hero-bg" id="hero-bg-el" aria-hidden="true"></div>

      <div className="hero-inner">
        <div className="hero-two-col">
          {/* LEFT: brand + value proposition */}
          <div className="hero-left">
            <Reveal as="div" className="hero-logo-block">
              <Image id="hero-logo-img" src="/mark-tile.png" alt="" width={120} height={107} priority />
              <div>
                <div className="hero-brand-name">ENVIRO-HENSION</div>
                <div className="hero-tagline-txt" id="t-tagline">
                  {tx("t-tagline", "Discover · Engage · Empower")}
                </div>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h1 className="display-2">{heroTitle}</h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="hero-intro-txt" id="t-heroIntro">
                {tx(
                  "t-heroIntro",
                  "A capacity-building platform for environmental community leaders — in English and Kiswahili.",
                )}
              </p>
            </Reveal>

            <Reveal delay={3} className="hero-actions">
              <Link className="btn btn-primary btn-lg" href={`${base}/learn`}>
                {tx("t-explore-btn", "Explore Below")}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() =>
                  document
                    .getElementById("hero-cards-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {isEn ? "How it works" : "Jinsi inavyofanya kazi"}
              </button>
            </Reveal>

            <Reveal delay={4} className="hero-stats">
              {stats.map((s) => (
                <div className="hero-stat" key={s.l}>
                  <b>{s.n}</b>
                  <span>{s.l}</span>
                </div>
              ))}
            </Reveal>
          </div>

          {/* RIGHT: the brand mark (community + landscape) or the CMS video */}
          {heroVideoUrl ? (
            <Reveal delay={2} className="hero-right">
              <div className="video-frame" id="hero-video-wrap">
                <video id="hero-vid" preload="none" src={heroVideoUrl} />
                <div className="video-overlay" id="hero-vo" onClick={playHeroVid}>
                  <div className="play-btn">
                    <Play size={26} aria-hidden="true" style={{ marginLeft: 3 }} />
                  </div>
                  <div className="vo-label" id="t-vlabel">
                    {tx("t-vlabel", "Watch: Our Story")}
                  </div>
                  <div className="vo-sub" id="t-vsub">
                    {tx("t-vsub", "Discover what Enviro-Hension is building")}
                  </div>
                </div>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={2} className="hero-right">
              <div className="hero-mark">
                <span className="hero-mark-ring" aria-hidden="true" />
                <Image
                  src="/mark-tile.png"
                  alt=""
                  width={520}
                  height={464}
                  priority
                  sizes="(max-width: 900px) 70vw, 26rem"
                />
                <span className="hero-mark-chip is-top">
                  <Icon name="users" size={15} />
                  {isEn ? "Community" : "Jamii"}
                </span>
                <span className="hero-mark-chip is-bottom">
                  <Icon name="leaf" size={15} />
                  {isEn ? "Environment" : "Mazingira"}
                </span>
              </div>
            </Reveal>
          )}
        </div>

        {/* 3 ACTION CARDS */}
        <div id="hero-cards-section"></div>
        <div className="action-cards">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i + 1}>
              <Link className="action-card" href={p.href} data-accent={p.accent}>
                <span className="icon-tile">
                  <Icon name={p.icon} size={24} />
                </span>
                <h3 id={`t-ac${i + 1}`}>{p.title}</h3>
                <p id={`t-ac${i + 1}d`}>{p.desc}</p>
                <span className="link-arrow" id={`t-ac${i + 1}a`}>
                  {p.cta}
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      {/* CONTENT BELOW THE HERO — on the standard page surface */}
      <div className="home-body">
        <div className="container">
          {/* HOW IT WORKS */}
          <section className="section-tight" aria-labelledby="how-title">
            <Reveal>
              <p className="eyebrow">{isEn ? "How it works" : "Jinsi inavyofanya kazi"}</p>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="display-3" id="how-title" style={{ marginBottom: "var(--space-8)" }}>
                {isEn ? "Three steps from knowledge to action." : "Hatua tatu kutoka maarifa hadi hatua."}
              </h2>
            </Reveal>
            <div className="process-grid">
              {steps.map((s, i) => (
                <Reveal key={s.title} delay={i + 1} className="process-step">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </section>

        {/* SHARE CARD */}
        <Reveal>
          <div className="share-card">
            <div className="share-card-left">
              <span className="icon-tile">
                <Icon name="leaf" size={24} />
              </span>
              <div>
                <h3 id="t-sch">{tx("t-sch", "Share Your Story")}</h3>
                <p id="t-scp">
                  {tx(
                    "t-scp",
                    "Upload photos, templates, blueprints, or tell your community's environmental story.",
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-brand btn-lg"
              id="t-scb"
              onClick={() => openShareModal()}
            >
              <Sparkles size={16} aria-hidden="true" />
              {tx("t-scb", "Share Now")}
            </button>
          </div>
        </Reveal>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true"></div>
    </div>
  );
}
