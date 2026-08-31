import type { Metadata } from "next";
import "./globals.css";
import { CookieNotice } from "./cookie-notice";
import { siteName, siteUrl, structuredBusinessData } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Beauty Farm e centro benessere a Latina`,
    template: `%s | ${siteName} Latina`,
  },
  description: "Rituali SPA, trattamenti viso e corpo, massaggi e percorsi benessere su misura a Latina. Scopri l’esperienza Virginia SPA.",
  keywords: ["spa Latina", "beauty farm Latina", "centro benessere Latina", "massaggi Latina", "trattamenti viso Latina", "trattamenti corpo Latina"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    alternateLocale: ["en_GB", "es_ES", "fr_FR", "de_DE"],
    siteName,
    title: `${siteName} | Il tuo tempo. La tua bellezza.`,
    description: "Rituali e percorsi benessere su misura nel cuore di Latina.",
    images: [{ url: "/hero-ritual.webp", width: 1200, height: 630, alt: "Rituale benessere Virginia SPA" }],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        {children}
        <CookieNotice />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredBusinessData) }} />
      </body>
    </html>
  );
}
