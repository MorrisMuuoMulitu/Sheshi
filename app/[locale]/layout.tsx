import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Modals from "@/components/Modals";
import VisualEditing from "@/components/ui/VisualEditing";
import MediaViewer from "@/components/ui/MediaViewer";
import { isLocale, type Locale } from "@/lib/i18n";
import { getSettings } from "@/lib/cms";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "sw" }];
}

/**
 * This layout reads `params` (locale) for the chrome + notFound() guard.
 * Both locales are prerendered via generateStaticParams, so params never
 * blocks at runtime — opt the segment out of instant-navigation validation
 * (Next 16 cacheComponents) instead of wrapping the shell in Suspense.
 */
export const instant = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const isEn = l === "en";

  // Draft mode is set by /api/draft-mode/enable when the Studio's preview
  // pane opens the site. It makes the CMS getters re-execute with the
  // `drafts` perspective, and switches on the click-to-edit overlay.
  const { isEnabled: preview } = await draftMode();

  // Settings singleton drives the footer (Phase 5.2).
  const settings = await getSettings(l);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {isEn ? "Skip to main content" : "Rukia yaliyomo makuu"}
      </a>
      <Nav locale={l} />
      <main id="main-content">{children}</main>
      <Footer locale={l} settings={settings} />
      <Modals locale={l} />
      <MediaViewer locale={l} />
      {preview && <VisualEditing />}
    </>
  );
}
