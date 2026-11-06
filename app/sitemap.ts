import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** All six pages × both locales, with hreflang alternates (Phase 6.1). */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/learn", "/build", "/act", "/work", "/contact"];
  const lastModified = new Date();

  return pages.flatMap((p) =>
    (["en", "sw"] as const).map((locale) => ({
      url: `${SITE_URL}/${locale}${p}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.8,
      alternates: {
        languages: {
          en: `${SITE_URL}/en${p}`,
          sw: `${SITE_URL}/sw${p}`,
        },
      },
    })),
  );
}
