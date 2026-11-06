import { type Locale } from "@/lib/i18n";
import { getWorkContent } from "@/lib/cms";
import WorkView from "@/components/pages/WorkView";

/** Work items are CMS-driven; cached per 'cms' tag + 1-minute cacheLife. */
export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { episodes, works } = await getWorkContent(locale as Locale);
  return <WorkView locale={locale as Locale} episodes={episodes} works={works} />;
}
