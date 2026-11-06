import { type Locale } from "@/lib/i18n";
import { getCampaigns } from "@/lib/cms";
import ActView from "@/components/pages/ActView";

/** Campaign content is CMS-driven; cached per 'cms' tag + 1-minute cacheLife. */
// Static route (both locales prerendered via the layout's generateStaticParams):
// `params` is read at request/prerender time by design — declare it blocking so
// the Instant validator doesn't flag the (already static) navigation.
export const instant = false;

export default async function ActPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const campaigns = await getCampaigns(locale as Locale);
  return <ActView locale={locale as Locale} campaigns={campaigns} />;
}
