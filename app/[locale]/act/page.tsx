import { type Locale } from "@/lib/i18n";
import { getCampaigns } from "@/lib/cms";
import ActView from "@/components/pages/ActView";

/** Campaign content is CMS-driven; cached per 'cms' tag + 1-minute cacheLife. */
export default async function ActPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const campaigns = await getCampaigns(locale as Locale);
  return <ActView locale={locale as Locale} campaigns={campaigns} />;
}
