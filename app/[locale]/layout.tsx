import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Modals from "@/components/Modals";
import { isLocale, type Locale } from "@/lib/i18n";

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

  return (
    <>
      <Nav locale={l} />
      {children}
      <Footer locale={l} />
      <Modals locale={l} />
    </>
  );
}
