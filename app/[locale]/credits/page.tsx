import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n";
import { CREDITS } from "@/lib/credits";

/**
 * Photography credits.
 *
 * The photographs currently on the site are freely licensed placeholders from
 * Wikimedia Commons; the licences require attribution, so it lives on a real
 * page rather than in a code comment. Deleting an entry here is part of
 * swapping in Enviro-Hension's own field photography.
 */
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale !== "sw";
  return {
    title: isEn ? "Photography credits" : "Picha — wahusika",
    robots: { index: false, follow: true },
  };
}

export default async function CreditsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const isEn = l === "en";

  return (
    <div className="page">
      <section className="page-head">
        <div className="container">
          <p className="eyebrow">{isEn ? "Credits" : "Wahusika"}</p>
          <h1>{isEn ? "Photography credits" : "Picha — wahusika"}</h1>
          <p>
            {isEn
              ? "The photographs on this site are freely licensed images from Wikimedia Commons, used here with attribution. They will be replaced with Enviro-Hension's own field photography."
              : "Picha zilizo kwenye tovuti hii zinatoka Wikimedia Commons kwa leseni huru, zikitumika hapa kwa kutaja mwandishi. Zitabadilishwa na picha za Enviro-Hension zenyewe."}
          </p>
        </div>
      </section>

      <div className="container section">
        <ul className="credit-list">
          {CREDITS.map((c) => (
            <li key={c.file}>
              <Image src={`/img/${c.file}`} alt="" width={160} height={100} />
              <div>
                <h2>{c.title}</h2>
                <p>
                  {isEn ? "Photograph by " : "Picha na "}
                  <strong>{c.author}</strong>
                  {" · "}
                  <a href={c.licenceUrl} target="_blank" rel="noopener noreferrer">
                    {c.licence}
                  </a>
                  {" · "}
                  <a href={c.source} target="_blank" rel="noopener noreferrer">
                    {isEn ? "source" : "chanzo"}
                  </a>
                </p>
                <p className="credit-used">{c.usedOn}</p>
              </div>
            </li>
          ))}
        </ul>

        <p style={{ marginTop: "var(--space-10)" }}>
          <Link className="link-arrow" href={`/${l}`}>
            <ArrowLeft size={15} aria-hidden="true" />
            {isEn ? "Back to home" : "Rudi nyumbani"}
          </Link>
        </p>
      </div>
    </div>
  );
}
