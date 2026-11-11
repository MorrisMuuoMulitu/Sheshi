"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Download, Eye, Play, Sparkles } from "lucide-react";
import { T, type Locale } from "@/lib/i18n";
import { openMedia, openShareModal } from "@/lib/ui";
import { downloadHref, type LearnTopic, type LibraryResource } from "@/lib/views";
import { Icon, terrainFor } from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";

/**
 * Home page.
 *
 * Photography-led: the hero is a real Kenyan landscape (freely licensed, see
 * docs/CREDITS.md), and the three pillars are backed by field photographs. The
 * featured modules and newest resources come from the CMS, so publishing in the
 * Studio changes the home page too.
 */
export default function HomeView({
  locale,
  heroVideoUrl,
  heroImageUrl,
  topics,
  resources,
}: {
  locale: Locale;
  heroVideoUrl: string;
  heroImageUrl?: string;
  topics: LearnTopic[];
  resources: LibraryResource[];
}) {
  const t = T[locale];
  const base = `/${locale}`;

  // "Discover · Engage · Empower" must never wrap so that a line begins with
  // the separator: bind each dot to the word before it (NBSP), leave a normal
  // space after it where a break is allowed.
  const tagline = (t["t-tagline"] ?? "Discover · Engage · Empower").replace(
    /\s*·\s*/g,
    "\u00A0· ",
  );

  // Subtle parallax on the hero photograph, and a mobile action bar that
  // appears once the hero has scrolled away. Both are skipped entirely when
  // the reader prefers reduced motion.
  const photoRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setShowBar(y > window.innerHeight * 0.75);
        if (!reduced && photoRef.current && y < window.innerHeight * 1.2) {
          photoRef.current.style.transform =
            `translate3d(0, ${(y * 0.16).toFixed(1)}px, 0) scale(1.04)`;
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
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
      photo: "/img/field-learning.jpg",
      photoAlt: isEn
        ? "Community members gathered for an environmental education session in Kenya"
        : "Wanajamii wamekusanyika kwa kikao cha elimu ya mazingira nchini Kenya",
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
      photo: "/img/field-working.jpg",
      photoAlt: isEn
        ? "Tea pickers working a hillside near Kericho, Kenya"
        : "Wachunaji chai wakifanya kazi kwenye kilima karibu na Kericho, Kenya",
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
      photo: "/img/field-planting.jpg",
      photoAlt: isEn
        ? "A community group preparing to plant tree seedlings in Kenya"
        : "Kikundi cha jamii kikijiandaa kupanda miche ya miti nchini Kenya",
      title: tx("t-ac3", "Act"),
      desc: tx(
        "t-ac3d",
        "Mobilize your community. Run campaigns, submit events, and lead the change.",
      ),
      cta: tx("t-ac3a", "Start mobilizing"),
      href: `${base}/act`,
    },
  ];

  const featured = topics.slice(0, 3);
  // "Latest" means most recently edited in the Studio, not the seed order.
  const latest = [...resources]
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
    .slice(0, 4);

  const stats = isEn
    ? [
        { n: String(topics.length), l: "Modules" },
        { n: String(resources.length), l: "Resources" },
        { n: "EN/SW", l: "Bilingual" },
      ]
    : [
        { n: String(topics.length), l: "Moduli" },
        { n: String(resources.length), l: "Rasilimali" },
        { n: "EN/SW", l: "Lugha mbili" },
      ];

  return (
    <div className="page page-home" id="page-home">
      {/* ═══ HERO — a real landscape carries the page ═══════════ */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-photo-wrap" ref={photoRef}>
          <Image
            src={heroImageUrl || "/img/hero-field.jpg"}
            alt={
              isEn
                ? "Open grassland and woodland on the Lolldaiga conservancy in Laikipia, Kenya"
                : "Nyasi na misitu ya wazi katika hifadhi ya Lolldaiga, Laikipia, Kenya"
            }
            fill
            priority
            sizes="100vw"
            className="hero-photo"
          />
        </div>
        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-content">
          <div className="hero-copy">
            {/* The landing page headline is the brand tagline, exactly as it
                was before the UI rewrite. No invented copy. */}
            <Reveal as="div">
              <h1 className="hero-title is-tagline" id="hero-title">
                {tagline}
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="hero-lede" id="t-heroIntro">
                {tx(
                  "t-heroIntro",
                  "A capacity-building platform for environmental community leaders — in English and Kiswahili.",
                )}
              </p>
            </Reveal>

            <Reveal delay={3} className="hero-actions">
              <Link className="btn btn-brand btn-lg" href={`${base}/learn`}>
                {isEn ? "Start learning" : "Anza kujifunza"}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link className="btn btn-ghost-light btn-lg" href={`${base}/build`}>
                {isEn ? "Get the tools" : "Pata zana"}
              </Link>
            </Reveal>
          </div>

          {/* Optional CMS video, bottom-right of the hero. */}
          {heroVideoUrl && (
            <Reveal delay={2} className="hero-video-slot">
              <div className="video-frame" id="hero-video-wrap">
                <video id="hero-vid" preload="none" src={heroVideoUrl} />
                <div className="video-overlay" id="hero-vo" onClick={playHeroVid}>
                  <div className="play-btn">
                    <Play size={26} aria-hidden="true" style={{ marginLeft: 3 }} />
                  </div>
                  <div className="vo-label" id="t-vlabel">
                    {tx("t-vlabel", "Watch: Our Story")}
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>

        <div className="hero-stats-bar">
          <div className="hero-stats">
            {stats.map((s) => (
              <div className="hero-stat" key={s.l}>
                <b>{s.n}</b>
                <span>{s.l}</span>
              </div>
            ))}
            <div className="hero-stat hero-stat-mark">
              <Image src="/mark-light.png" alt="" width={84} height={75} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PILLARS — each backed by a field photograph ════════ */}
      <section className="pillars" id="hero-cards-section" aria-label={isEn ? "What you can do" : "Unachoweza kufanya"}>
        <div className="container">
          <div className="action-cards">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i + 1}>
                <Link className="action-card" href={p.href} data-accent={p.accent}>
                  <div className="action-card-photo">
                    <Image
                      src={p.photo}
                      alt={p.photoAlt}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                    />
                    <span className="icon-tile">
                      <Icon name={p.icon} size={22} />
                    </span>
                  </div>
                  <div className="action-card-body">
                    <h2 id={`t-ac${i + 1}`}>{p.title}</h2>
                    <p id={`t-ac${i + 1}d`}>{p.desc}</p>
                    <span className="link-arrow" id={`t-ac${i + 1}a`}>
                      {p.cta}
                      <ArrowRight size={15} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="home-body">
        {/* ═══ FEATURED MODULES ═══════════════════════════════════ */}
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
                      {c.imageUrl ? (
                        <Image
                          src={c.imageUrl}
                          alt=""
                          fill
                          sizes="(max-width: 700px) 100vw, 33vw"
                          className="tc-photo"
                        />
                      ) : (
                        <Icon name={c.icon} size={44} strokeWidth={1.5} />
                      )}
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

        {/* ═══ IMPACT — real numbers, photographic band ═══════════ */}
        <section className="impact-band" aria-labelledby="impact-title">
          <Image
            src="/img/band-tea.jpg"
            alt=""
            fill
            sizes="100vw"
            className="impact-band-photo"
          />
          <div className="impact-band-scrim" aria-hidden="true" />
          <div className="container impact-inner">
            <Reveal>
              <p className="eyebrow" style={{ color: "var(--sage-300)" }}>
                {isEn ? "In the library today" : "Kwenye maktaba leo"}
              </p>
            </Reveal>
            <Reveal delay={1}>
              <h2 className="display-3" id="impact-title">
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
                      ? ["Step-by-step guides", "Free downloads", "Every page, both ways"][i]
                      : ["Miongozo ya hatua", "Vipakuliwa bure", "Kila ukurasa, lugha mbili"][i]}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ LATEST RESOURCES ═══════════════════════════════════ */}
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
                    {r.previewUrl ? (
                      <span className="res-row-thumb">
                        <Image src={r.previewUrl} alt="" fill sizes="96px" />
                      </span>
                    ) : (
                      <span className="res-row-icon">
                        <Icon name={r.cat === "kt" ? "package" : r.cat === "zn" ? "newspaper" : "file"} size={20} />
                      </span>
                    )}
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
                        <>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => openMedia({ url: r.fileUrl!, title: r.title })}
                          >
                            <Eye size={14} aria-hidden="true" />
                            {isEn ? "View" : "Tazama"}
                          </button>
                          <a
                            className="dl-btn"
                            href={downloadHref(r.fileUrl, r.title)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download size={14} aria-hidden="true" />
                            {isEn ? "Download" : "Pakua"}
                          </a>
                        </>
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

        {/* ═══ SHARE ══════════════════════════════════════════════ */}
        <div className="container" style={{ paddingBottom: "var(--section-y)" }}>
          <Reveal>
            <div className="share-card">
              <Image
                src="/img/hills.jpg"
                alt=""
                fill
                sizes="100vw"
                className="share-card-photo"
              />
              <div className="share-card-scrim" aria-hidden="true" />
              <div className="share-card-left">
                <span className="icon-tile">
                  <Icon name="leaf" size={24} />
                </span>
                <div>
                  <h2 id="t-sch">{tx("t-sch", "Share Your Story")}</h2>
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

      {/* Mobile: one primary action always within thumb reach. */}
      <div className={`mobile-bar${showBar ? " is-shown" : ""}`}>
        <Link className="btn btn-primary" href={`${base}/learn`}>
          {isEn ? "Start learning" : "Anza kujifunza"}
        </Link>
        <Link className="btn btn-secondary" href={`${base}/build`}>
          {isEn ? "Get tools" : "Pata zana"}
        </Link>
      </div>
    </div>
  );
}
