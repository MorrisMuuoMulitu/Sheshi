import { type Locale } from "@/lib/i18n";
import { getSettings } from "@/lib/cms";
import ContactView from "@/components/pages/ContactView";

/** Socials + newsletter blurb come from the CMS settings singleton (Phase 5.2). */
// Static route (both locales prerendered via the layout's generateStaticParams):
// `params` is read at request/prerender time by design — declare it blocking so
// the Instant validator doesn't flag the (already static) navigation.
export const instant = false;

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const settings = await getSettings(l);
  return <ContactView locale={l} settings={settings} />;
}
