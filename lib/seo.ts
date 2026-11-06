/**
 * Per-locale SEO metadata (PLAN.md Phase 6.1).
 *
 * One helper produces title/description/canonical/hreflang/OG/Twitter for
 * each page so every route ships complete, locale-correct metadata.
 */
import type { Metadata } from "next";
import type { Locale } from "./i18n";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://envirohension.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Enviro-Hension";

export type PageKey = "home" | "learn" | "build" | "act" | "work" | "contact";

/** Route path under the locale segment (home → ""). */
const PATHS: Record<PageKey, string> = {
  home: "",
  learn: "/learn",
  build: "/build",
  act: "/act",
  work: "/work",
  contact: "/contact",
};

const COPY: Record<Locale, Record<PageKey, { title: string; description: string }>> = {
  en: {
    home: {
      title: "Enviro-Hension — Discover, Engage, Empower",
      description:
        "A capacity-building platform for environmental community leaders in Kenya — learn, build and act. Bilingual in English and Kiswahili.",
    },
    learn: {
      title: "Learn",
      description:
        "Step-by-step environmental action modules: river cleanup, tree planting, zero waste, coastal monitoring, air quality and clean energy.",
    },
    build: {
      title: "Build",
      description:
        "Free bilingual resources for Kenyan environmental campaigns — templates, toolkits and zines, ready to download.",
    },
    act: {
      title: "Act",
      description:
        "Community campaign guides and event listings — organize, mobilize and lead environmental action in your county.",
    },
    work: {
      title: "Our Work",
      description:
        "Podcasts, documentaries and community stories from across Kenya's environmental movement.",
    },
    contact: {
      title: "Contact",
      description:
        "Partner, volunteer or share your community's work. We respond in both English and Kiswahili.",
    },
  },
  sw: {
    home: {
      title: "Enviro-Hension — Gundua, Shiriki, Wezesha",
      description:
        "Jukwaa la kujenga uwezo kwa viongozi wa jamii wa mazingira nchini Kenya — jifunze, jenga na tenda. Kwa Kiingereza na Kiswahili.",
    },
    learn: {
      title: "Jifunze",
      description:
        "Moduli za hatua za mazingira hatua kwa hatua: kusafisha mito, kupanda miti, taka sifuri, ufuatiliaji wa pwani, ubora wa hewa na nishati safi.",
    },
    build: {
      title: "Jenga",
      description:
        "Rasilimali za bure za lugha mbili kwa kampeni za mazingira Kenya — violezo, zana na majarida, tayari kupakuliwa.",
    },
    act: {
      title: "Tenda",
      description:
        "Miongozo ya kampeni za jamii na orodha za matukio — panga, hamasisha na ongoza hatua za mazingira katika kaunti yako.",
    },
    work: {
      title: "Kazi Yetu",
      description:
        "Podikasti, filamu na hadithi za jamii kutoka harakati za mazingira kote Kenya.",
    },
    contact: {
      title: "Wasiliana",
      description:
        "Shirikiana, jitolee au shiriki kazi ya jamii yako. Tunajibu kwa Kiingereza na Kiswahili.",
    },
  },
};

/** Metadata for one page in one locale (canonical + hreflang + OG + Twitter). */
export function pageMeta(locale: Locale, page: PageKey): Metadata {
  const copy = COPY[locale][page];
  const path = `/${locale}${PATHS[page]}`;
  const enPath = `/en${PATHS[page]}`;
  const swPath = `/sw${PATHS[page]}`;

  return {
    title: page === "home" ? { absolute: copy.title } : copy.title,
    description: copy.description,
    alternates: {
      canonical: path,
      languages: { en: enPath, sw: swPath, "x-default": enPath },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: copy.title,
      description: copy.description,
      url: path,
      locale: locale === "en" ? "en_KE" : "sw_KE",
      alternateLocale: locale === "en" ? "sw_KE" : "en_KE",
      images: [{ url: "/logo.png", width: 640, height: 640, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: ["/logo.png"],
    },
  };
}
