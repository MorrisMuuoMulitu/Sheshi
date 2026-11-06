import type { Metadata } from "next";
import { Andika } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const andika = Andika({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={andika.className}>
      {/* Browser extensions (e.g. Grammarly) inject data-* attributes into
          <body> before hydration — suppress only this element's attribute
          check; children are still validated. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
