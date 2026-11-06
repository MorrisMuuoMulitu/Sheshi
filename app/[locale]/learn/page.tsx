import { type Locale } from "@/lib/i18n";
import { getLearnTopics } from "@/lib/cms";
import LearnView from "@/components/pages/LearnView";

/** Topic content is CMS-driven; cached per 'cms' tag + 1-minute cacheLife. */
export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const topics = await getLearnTopics(locale as Locale);
  return <LearnView locale={locale as Locale} topics={topics} />;
}
