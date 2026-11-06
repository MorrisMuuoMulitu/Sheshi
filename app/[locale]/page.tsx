import { type Locale } from "@/lib/i18n";
import { getSettings } from "@/lib/cms";
import HomeView from "@/components/pages/HomeView";

/** Hero video URL comes from the CMS settings singleton (Phase 5.3). */
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
