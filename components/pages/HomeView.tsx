"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Play, Sparkles } from "lucide-react";
import { T, type Locale } from "@/lib/i18n";
import { openShareModal } from "@/lib/ui";
import { downloadHref, type LearnTopic, type LibraryResource } from "@/lib/views";
import { Icon, terrainFor } from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";

/**
 * Home page.
 *
 * It carries the value proposition *and* real content: the featured modules and
 * the newest resources come from the CMS, so what an editor publishes in the
 * Studio changes the home page too.
 */
export default function HomeView({
  locale,
  heroVideoUrl,
  topics,
  resources,
}: {
  locale: Locale;
  heroVideoUrl: string;
  topics: LearnTopic[];
  resources: LibraryResource[];
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

  // Real content from the CMS.
  const featured = topics.slice(0, 3);
  // "Latest" means most recently edited in the Studio, not the seed order.
  const latest = [...resources]
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
    .slice(0, 4);
  const videoCount = topics.filter((x) => x.videoUrl).length;

  const stats = isEn
    ? [
        { n: String(topics.length), l: "Modules" },
        { n: String(resources.length), l: "Resources" },
        { n: String(videoCount), l: "Videos" },
        { n: "EN/SW", l: "Languages" },
      ]
    : [
        { n: String(topics.length), l: "Moduli" },
        { n: String(resources.length), l: "Rasilimali" },
        { n: String(videoCount), l: "Video" },
        { n: "EN/SW", l: "Lugha" },
      ];

  return (
    <div className="page page-home" id="page-home">
      <div className="hero-bg" id="hero-bg-el" aria-hidden="true"></div>

      <div className="hero-inner">
        <div className="hero-two-col">
          {/* LEFT: the pitch */}
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
              <h1 className="display-2">
                {isEn
                  ? "Capacity for the people who protect Kenya's environment."
                  : "Uwezo kwa watu wanaolinda mazingira ya Kenya."}
              </h1>
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
                {isEn ? "Start learning" : "Anza kujifunza"}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link className="btn btn-secondary btn-lg" href={`${base}/build`}>
                {isEn ? "Get the tools" : "Pata zana"}
              </Link>
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

          {/* RIGHT: the CMS video, or the brand mark */}
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

        {/* 3 PILLARS */}
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

      {/* ── CONTENT BELOW THE HERO ─────────────────────────────────── */}
      <div className="home-body">
        {/* FEATURED MODULES — real CMS content */}
        {featured.length > 0 && (
          <section className="container section-tight" aria-labelledby="h-mod-title">
            <div className="section-head">
              <div>
                <Reveal>
                  <p className="eyebrow">{isEn ? "Learn" : "Jifunze"}</p>
                </Reveal>
                <Reveal delay={1}>
                  <h2 className="display-3" id="h-mod-title">
                    {tx("h-mod", "Featured modules")}
                  </h2>
                </Reveal>
                <Reveal delay={2}>
                  <p className="section-lede">
                    {tx(
                      "h-mod-p",
                      "Start with a module. Each one has a video and a step-by-step guide you can run in your community.",
                    )}
                  </p>
                </Reveal>
              </div>
              <Reveal delay={2}>
                <Link className="link-arrow" href={`${base}/learn`}>
                  {tx("h-mod-cta", "See all modules")}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </Reveal>
            </div>

            <div className="topic-grid">
              {featured.map((c, idx) => (
                <Reveal key={c.docId} delay={idx + 1}>
                  <Link className="topic-card" href={`${base}/learn?topic=${encodeURIComponent(c.key)}`}>
                    <div className={`tc-thumb ${terrainFor(c.icon)}`}>
                      <Icon name={c.icon} size={44} strokeWidth={1.5} />
                      {c.videoUrl && (
                        <span className="tc-video-flag">
                          <Play size={11} aria-hidden="true" />
                          {isEn ? "Video" : "Video"}
                        </span>
                      )}
                    </div>
                    <div className="tc-body">
                      <span className="tc-title">{c.title}</span>
                      <span className="tc-desc">{c.desc}</span>
                      <span className="tc-foot">
                        <span className="badge badge-brand">{c.pill}</span>
                        <span className="tc-arr">
                          <ArrowRight size={15} aria-hidden="true" />
                        </span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* IMPACT — real numbers from the dataset */}
        <section className="impact-band" aria-labelledby="impact-title">
          <div className="container">
            <Reveal>
              <p className="eyebrow" style={{ color: "var(--sage-300)" }}>
                {isEn ? "In the library today" : "Kwenye maktaba leo"}
              </p>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="display-3" id="impact-title" style={{ marginBottom: "var(--space-10)" }}>
                {isEn
                  ? "Everything you need to run a campaign."
                  : "Kila kitu unachohitaji kuendesha kampeni."}
              </h2>
            </Reveal>
            <div className="impact-grid">
              {stats.map((s, i) => (
                <Reveal key={s.l} delay={i + 1} className="impact-item">
                  <b>{s.n}</b>
                  <h3>{s.l}</h3>
                  <p>
                    {isEn
                      ? ["Step-by-step guides", "Free downloads", "In Kiswahili and English", "Every page, both ways"][i]
                      : ["Miongozo ya hatua", "Vipakuliwa bure", "Kwa Kiswahili na Kiingereza", "Kila ukurasa, lugha mbili"][i]}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* LATEST RESOURCES — real CMS content */}
        {latest.length > 0 && (
          <section className="container section-tight" aria-labelledby="h-res-title">
            <div className="section-head">
              <div>
                <Reveal>
                  <p className="eyebrow">{isEn ? "Build" : "Jenga"}</p>
                </Reveal>
                <Reveal delay={1}>
                  <h2 className="display-3" id="h-res-title">
                    {tx("h-res", "Latest resources")}
                  </h2>
                </Reveal>
                <Reveal delay={2}>
                  <p className="section-lede">
                    {tx(
                      "h-res-p",
                      "Free, downloadable, bilingual — take one to your next community meeting.",
                    )}
                  </p>
                </Reveal>
              </div>
              <Reveal delay={2}>
                <Link className="link-arrow" href={`${base}/build`}>
                  {tx("h-res-cta", "Browse the library")}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </Reveal>
            </div>

            <ul className="res-list">
              {latest.map((r, idx) => (
                <Reveal as="li" key={r.docId} delay={idx + 1}>
                  <div className="res-row">
                    <span className="res-row-icon">
                      <Icon name={r.cat === "kt" ? "package" : r.cat === "zn" ? "newspaper" : "file"} size={20} />
                    </span>
                    <div className="res-row-main">
                      <h3>{r.title}</h3>
                      <p>{r.desc}</p>
                    </div>
                    <div className="res-row-actions">
                      <span className="res-langs">
                        {r.langs.map((l) => (
                          <span className={`lang-dot${l === "en" ? " is-primary" : ""}`} key={l} lang={l}>
                            {l.toUpperCase()}
                          </span>
                        ))}
                      </span>
                      {r.fileUrl ? (
                        <a
                          className="dl-btn"
                          href={downloadHref(r.fileUrl, r.title)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download size={14} aria-hidden="true" />
                          {isEn ? "Download" : "Pakua"}
                        </a>
                      ) : (
                        <button type="button" className="dl-btn" disabled>
                          <Download size={14} aria-hidden="true" />
                          {isEn ? "Download" : "Pakua"}
                        </button>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </section>
        )}

        {/* SHARE */}
        <div className="container" style={{ paddingBottom: "var(--section-y)" }}>
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
    </div>
  );
}
