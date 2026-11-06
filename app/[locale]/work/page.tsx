import { type Locale } from "@/lib/i18n";
import { getPublishedStories, getWorkContent } from "@/lib/cms";
import WorkView from "@/components/pages/WorkView";

/** Work items are CMS-driven; cached per 'cms' tag + 1-minute cacheLife. */
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
