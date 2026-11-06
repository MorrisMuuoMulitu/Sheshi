import type { Metadata } from "next";
import { type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { getLearnTopics, getSettings } from "@/lib/cms";
import LearnView from "@/components/pages/LearnView";

/** Topic content is CMS-driven; cached per 'cms' tag + 1-minute cacheLife. */
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
  return pageMeta(locale as Locale, "learn");
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const [topics, settings] = await Promise.all([getLearnTopics(l), getSettings(l)]);
  return <LearnView locale={l} topics={topics} introVideoUrl={settings.learnIntroVideoUrl} />;
}
