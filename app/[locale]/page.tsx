import type { Metadata } from "next";
import { type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { getSettings, getLearnTopics, getResources } from "@/lib/cms";
import HomeView from "@/components/pages/HomeView";

/**
 * The home page shows real content, not just a pitch: the featured modules and
 * the newest resources come straight from the CMS, so publishing in the Studio
 * changes the home page too.
 */
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

  const [settings, topics, resources] = await Promise.all([
    getSettings(l),
    getLearnTopics(l),
    getResources(l),
  ]);

  return (
    <HomeView
      locale={l}
      heroVideoUrl={settings.heroVideoUrl}
      heroImageUrl={settings.heroImageUrl}
      topics={topics}
      resources={resources}
    />
  );
}
