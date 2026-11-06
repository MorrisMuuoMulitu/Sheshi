import type { Metadata } from "next";
import { type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { getPublishedStories, getWorkContent } from "@/lib/cms";
import WorkView from "@/components/pages/WorkView";

/** Work items are CMS-driven; cached per 'cms' tag + 1-minute cacheLife. */
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
  return pageMeta(locale as Locale, "work");
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const [{ episodes, works }, stories] = await Promise.all([
    getWorkContent(l),
    getPublishedStories(l),
  ]);
  return <WorkView locale={l} episodes={episodes} works={works} stories={stories} />;
}
