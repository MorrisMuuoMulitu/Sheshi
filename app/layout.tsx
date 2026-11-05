import type { Metadata } from "next";
import { Andika } from "next/font/google";
import "./globals.css";

const andika = Andika({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Enviro-Hension | Discover, Engage, Empower",
  description:
    "A capacity-building platform for environmental community leaders — in English and Kiswahili.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={andika.className}>
      <body>{children}</body>
    </html>
  );
}
