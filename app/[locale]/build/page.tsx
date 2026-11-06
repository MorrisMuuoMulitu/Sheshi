import { type Locale } from "@/lib/i18n";
import { getResources } from "@/lib/cms";
import BuildView from "@/components/pages/BuildView";

/** Resource library is CMS-driven; cached per 'cms' tag + 1-minute cacheLife. */
export default async function BuildPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resources = await getResources(locale as Locale);
  return <BuildView locale={locale as Locale} resources={resources} />;
}
