import type { Metadata, Viewport } from "next";
import { Andika, Plus_Jakarta_Sans } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import ThemeScript from "@/components/ui/ThemeScript";
// Layer order matters: tokens → base → components → pages → globals.
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./globals.css";

/**
 * Type system (ui-ux-pro-max §6 `font-pairing`, §6 `text-styles-system`):
 *
 *  - Plus Jakarta Sans → display. A geometric humanist sans that pairs
 *    with the brand mark's own geometric wordmark, and reads warm and
 *    approachable rather than institutional — the register an
 *    environmental community platform needs.
 *  - Andika → body. Designed for readers with dyslexia and low literacy;
 *    wide apertures and a generous x-height keep long-form instructions
 *    legible in English and Kiswahili, on low-end Android and on paper.
 *
 * Both are self-hosted by next/font — no render-blocking Google request,
 * no layout shift, and the font files are subset to latin + latin-ext.
 */
const display = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display-face",
  fallback: ["system-ui", "sans-serif"],
});

const andika = Andika({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  // Italic is not used anywhere in the interface — dropping it removes two
  // font files from every first visit.
  style: ["normal"],
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
      className={`${display.variable} ${andika.variable}`}
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
