import type { Metadata, Viewport } from "next";
import { Andika, Fraunces } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import ThemeScript from "@/components/ui/ThemeScript";
import "./globals.css";

/**
 * Type system (ui-ux-pro-max §6 `font-pairing`, §6 `text-styles-system`):
 *
 *  - Fraunces → display. A warm editorial serif with real optical sizing;
 *    it carries the "field journal / civic publication" voice of the brand
 *    and gives headings a distinct identity from body copy.
 *  - Andika → body. Designed for readers with dyslexia and low literacy;
 *    wide apertures and generous x-height keep long-form instructions
 *    legible in English and Kiswahili, on low-end Android and on paper.
 *
 * Both are self-hosted by next/font — no render-blocking Google request,
 * no layout shift, and the font files are subset to latin + latin-ext.
 */
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  fallback: ["Georgia", "serif"],
});

const andika = Andika({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-andika",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Enviro-Hension | Discover, Engage, Empower",
    template: "%s | Enviro-Hension",
  },
  description:
    "A capacity-building platform for environmental community leaders — in English and Kiswahili.",
  applicationName: "Enviro-Hension",
  icons: { icon: "/favicon.ico", apple: "/logo.png" },
  openGraph: { siteName: "Enviro-Hension", type: "website" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#dbeebb" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1109" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${andika.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      {/* Browser extensions (e.g. Grammarly) inject data-* attributes into
          <body> before hydration — suppress only this element's attribute
          check; children are still validated. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
