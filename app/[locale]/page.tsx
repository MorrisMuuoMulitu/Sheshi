import type { Metadata } from "next";
import { type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { getSettings } from "@/lib/cms";
import HomeView from "@/components/pages/HomeView";

/** Hero video URL comes from the CMS settings singleton (Phase 5.3). */
// Static route (both locales prerendered via the layout's generateStaticParams):
// `params` is read at request/prerender time by design — declare it blocking so
// the Instant validator doesn't flag the (already static) navigation.
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta(locale as Locale, "home");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const settings = await getSettings(l);
  return <HomeView locale={l} heroVideoUrl={settings.heroVideoUrl} />;
}
