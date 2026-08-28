type CheckoutLanguage = "it" | "en" | "es" | "fr" | "de";
type CheckoutProduct = { title: string; unitAmount: number; duration: string; titles?: Partial<Record<CheckoutLanguage, string>> };

export const checkoutCatalog: Record<string, CheckoutProduct> = {
  "cielo-terra": { title: "Cielo & Terra", unitAmount: 11000, duration: "75 min" },
  "radici-armonia": { title: "Radici di Armonia", unitAmount: 9000, duration: "60 min" },
  "abbandono-sensoriale": { title: "Abbandono Sensoriale", unitAmount: 13000, duration: "90 min" },
  "wine-essence": { title: "Wine Essence", unitAmount: 12500, duration: "75 min" },
  "abbraccio-vita": { title: "Abbraccio di Vita", unitAmount: 9500, duration: "60 min" },
  carezza: { title: "Carezza", unitAmount: 7500, duration: "45 min" },
  "two-souls": { title: "Two Souls Ritual", unitAmount: 24000, duration: "2 persone · 90 min" },
  "rituale-terra": { title: "Rituale della Terra", unitAmount: 15000, duration: "120 min", titles: { it: "Rituale della Terra", en: "Earth Ritual", es: "Ritual de la Tierra", fr: "Rituel de la Terre", de: "Ritual der Erde" } },
  "rituale-luna": { title: "Rituale della Luna", unitAmount: 13500, duration: "105 min", titles: { it: "Rituale della Luna", en: "Moon Ritual", es: "Ritual de la Luna", fr: "Rituel de la Lune", de: "Mondritual" } },
  "rituale-rosa": { title: "Rituale della Rosa", unitAmount: 11000, duration: "90 min", titles: { it: "Rituale della Rosa", en: "Rose Ritual", es: "Ritual de la Rosa", fr: "Rituel de la Rose", de: "Rosenritual" } },
  "rituale-surya": { title: "Rituale Surya", unitAmount: 14000, duration: "110 min", titles: { it: "Rituale Surya", en: "Surya Ritual", es: "Ritual Surya", fr: "Rituel Surya", de: "Surya-Ritual" } },
  "rituale-luce-ambra": { title: "Rituale Luce d’Ambra", unitAmount: 13000, duration: "100 min", titles: { it: "Rituale Luce d’Ambra", en: "Amber Light Ritual", es: "Ritual Luz de Ámbar", fr: "Rituel Lumière d’Ambre", de: "Bernsteinlicht-Ritual" } },
};

export const allowedGiftAmounts = new Set([5000, 10000, 15000, 25000]);
