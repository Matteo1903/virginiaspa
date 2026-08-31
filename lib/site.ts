/**
 * Public site contacts and hours.
 * Replace placeholder values with Virginia SPA’s live details before go-live.
 */
export const siteUrl = "https://www.virginiaspa.it";
export const siteName = "Virginia SPA";

export const spaPhoneDisplay = "0773 000000";
export const spaPhoneE164 = "+390773000000";
export const spaPhoneHref = `tel:${spaPhoneE164}`;
export const spaPhoneSchema = "+39 0773 000000";

export const spaEmail = "ciao@virginiaspa.it";
export const spaInstagramUrl = "https://www.instagram.com/virginiaspa/";
export const spaInstagramHandle = "@virginiaspa";

export const spaStreetAddress = "Via da confermare";
export const spaPostalCode = "04100";
export const spaLocality = "Latina";
export const spaRegion = "Lazio";
export const spaCountry = "IT";
export const spaCityLine = "Nel cuore di Latina.";

export const spaHoursDisplay = "09:00 — 20:00";
export const spaDaysDisplay = "Lun — Sab";
export const spaOpens = "09:00";
export const spaCloses = "20:00";
export const spaOpenDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export const spaPhoneIsPlaceholder = /000000/.test(spaPhoneDisplay);
export const spaAddressIsPlaceholder = /confermare|placeholder/i.test(spaStreetAddress);
export const spaInstagramIsPlaceholder = /virginiaspa\/?$/.test(spaInstagramUrl);

export const structuredBusinessData = {
  "@context": "https://schema.org",
  "@type": ["HealthAndBeautyBusiness", "DaySpa"],
  name: siteName,
  url: siteUrl,
  image: `${siteUrl}/hero-ritual.webp`,
  ...(spaPhoneIsPlaceholder ? {} : { telephone: spaPhoneSchema }),
  email: spaEmail,
  address: {
    "@type": "PostalAddress",
    ...(spaAddressIsPlaceholder ? {} : { streetAddress: spaStreetAddress, postalCode: spaPostalCode }),
    addressLocality: spaLocality,
    addressRegion: spaRegion,
    addressCountry: spaCountry,
  },
  areaServed: spaLocality,
  priceRange: "€€",
  ...(spaInstagramIsPlaceholder ? {} : { sameAs: [spaInstagramUrl] }),
  openingHoursSpecification: [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [...spaOpenDays],
    opens: spaOpens,
    closes: spaCloses,
  }],
};

export const structuredFaqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "L’acquisto online è una prenotazione?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Online si acquista una card/voucher digitale. Dopo il pagamento si contatta Virginia SPA per scegliere data, orario e finalizzare la prenotazione.",
      },
    },
    {
      "@type": "Question",
      name: "Come si usa il voucher?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Il voucher arriva via email e si può scaricare dalla pagina di conferma. Si contatta la SPA per l’appuntamento e si presenta il codice in cabina.",
      },
    },
    {
      "@type": "Question",
      name: "Quanto dura il voucher?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Il voucher è valido 12 mesi dalla data di emissione, salvo diversa indicazione sul documento.",
      },
    },
    {
      "@type": "Question",
      name: "Posso chiedere un rimborso?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Il consumatore può recedere entro 14 giorni se il voucher non è ancora stato utilizzato in SPA. Un voucher già usato non si rimborsa in automatico.",
      },
    },
  ],
};
