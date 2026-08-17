import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.virginiaspa.it"),
  title: {
    default: "Virginia SPA | Beauty Farm e centro benessere a Latina",
    template: "%s | Virginia SPA Latina",
  },
  description: "Rituali SPA, trattamenti viso e corpo, massaggi e percorsi benessere su misura a Latina. Scopri l’esperienza Virginia SPA.",
  keywords: ["spa Latina", "beauty farm Latina", "centro benessere Latina", "massaggi Latina", "trattamenti viso Latina", "trattamenti corpo Latina"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    alternateLocale: ["en_GB", "es_ES", "fr_FR", "de_DE"],
    siteName: "Virginia SPA",
    title: "Virginia SPA | Il tuo tempo. La tua bellezza.",
    description: "Rituali e percorsi benessere su misura nel cuore di Latina.",
    images: [{ url: "/hero-ritual.webp", width: 1200, height: 630, alt: "Rituale benessere Virginia SPA" }],
  },
  robots: { index: true, follow: true },
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": ["HealthAndBeautyBusiness", "DaySpa"],
  name: "Virginia SPA",
  url: "https://www.virginiaspa.it",
  image: "https://www.virginiaspa.it/hero-ritual.webp",
  telephone: "+39 0773 000000",
  email: "ciao@virginiaspa.it",
  address: { "@type": "PostalAddress", addressLocality: "Latina", addressRegion: "Lazio", addressCountry: "IT" },
  areaServed: "Latina",
  priceRange: "€€",
  openingHoursSpecification: [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "20:00",
  }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
