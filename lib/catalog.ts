type CheckoutLanguage = "it" | "en" | "es" | "fr" | "de";
type CheckoutProduct = { title: string; unitAmount: number; duration: string; confirmed?: boolean; titles?: Partial<Record<CheckoutLanguage, string>> };

/** Only HEAD SPA prices not yet supplied remain provisional; confirmed products are marked individually. */
export const pricesAreProvisional = true;

export const giftAmountEuros = [50, 100, 150, 250] as const;
export const headSpaProductIds = ["cielo-terra", "radici-armonia", "abbandono-sensoriale", "wine-essence", "abbraccio-vita", "carezza", "two-souls"] as const;

export const priceEuros = (productId: string) => {
  const product = checkoutCatalog[productId];
  if (!product) throw new Error(`Prodotto non in catalogo: ${productId}`);
  return product.unitAmount / 100;
};

export const checkoutCatalog: Record<string, CheckoutProduct> = {
  "cielo-terra": { title: "Cielo & Terra", unitAmount: 9000, duration: "75 min", confirmed: true, titles: { it: "Cielo & Terra", en: "Sky & Earth", es: "Cielo y Tierra", fr: "Ciel & Terre", de: "Himmel & Erde" } },
  "radici-armonia": { title: "Radici di Armonia", unitAmount: 9000, duration: "60 min", titles: { it: "Radici di Armonia", en: "Roots of Harmony", es: "Raíces de Armonía", fr: "Racines d’Harmonie", de: "Wurzeln der Harmonie" } },
  "abbandono-sensoriale": { title: "Abbandono Sensoriale", unitAmount: 13000, duration: "90 min", titles: { it: "Abbandono Sensoriale", en: "Sensory Surrender", es: "Abandono Sensorial", fr: "Abandon Sensoriel", de: "Sinnliche Hingabe" } },
  "wine-essence": { title: "VINUM", unitAmount: 25000, duration: "75 min", confirmed: true, titles: { it: "VINUM", en: "VINUM", es: "VINUM", fr: "VINUM", de: "VINUM" } },
  "abbraccio-vita": { title: "Abbraccio di Vita", unitAmount: 14700, duration: "60 min", confirmed: true, titles: { it: "Abbraccio di Vita", en: "Embrace of Life", es: "Abrazo de Vida", fr: "Étreinte de Vie", de: "Umarmung des Lebens" } },
  carezza: { title: "Carezza", unitAmount: 9000, duration: "45 min", confirmed: true, titles: { it: "Carezza", en: "Gentle Touch", es: "Caricia", fr: "Caresse", de: "Sanfte Berührung" } },
  "two-souls": { title: "Two Souls Ritual", unitAmount: 31000, duration: "2 persone · 90 min", confirmed: true, titles: { it: "Two Souls Ritual", en: "Two Souls Ritual", es: "Ritual Dos Almas", fr: "Rituel Deux Âmes", de: "Ritual der zwei Seelen" } },
  "rituale-terra": { title: "Rituale della Terra", unitAmount: 14700, duration: "120 min", confirmed: true, titles: { it: "Rituale della Terra", en: "Earth Ritual", es: "Ritual de la Tierra", fr: "Rituel de la Terre", de: "Ritual der Erde" } },
  "rituale-luna": { title: "Rituale della Luna", unitAmount: 13500, duration: "90 min", confirmed: true, titles: { it: "Rituale della Luna", en: "Moon Ritual", es: "Ritual de la Luna", fr: "Rituel de la Lune", de: "Mondritual" } },
  "rituale-rosa": { title: "Rituale della Rosa", unitAmount: 12500, duration: "120 min", confirmed: true, titles: { it: "Rituale della Rosa", en: "Rose Ritual", es: "Ritual de la Rosa", fr: "Rituel de la Rose", de: "Rosenritual" } },
  "rituale-surya": { title: "Rituale Surya", unitAmount: 13700, duration: "90 min", confirmed: true, titles: { it: "Rituale Surya", en: "Surya Ritual", es: "Ritual Surya", fr: "Rituel Surya", de: "Surya-Ritual" } },
  "rituale-luce-ambra": { title: "Luce d’Ambra", unitAmount: 13700, duration: "120 min", confirmed: true, titles: { it: "Luce d’Ambra", en: "Amber Light", es: "Luz de Ámbar", fr: "Lumière d’Ambre", de: "Bernsteinlicht" } },
  "percorso-ayurveda": { title: "Percorso Ayurveda", unitAmount: 25000, duration: "180 min", confirmed: true, titles: { it: "Percorso Ayurveda", en: "Ayurveda Journey", es: "Recorrido Ayurveda", fr: "Parcours Ayurveda", de: "Ayurveda-Erlebnis" } },
  "rituale-peel-longevity": { title: "Rituale Peel Longevity", unitAmount: 8000, duration: "60 min", confirmed: true, titles: { it: "Rituale Peel Longevity", en: "Peel Longevity Ritual", es: "Ritual Peel Longevity", fr: "Rituel Peel Longevity", de: "Peel-Longevity-Ritual" } },
  "rituale-longevity-muse": { title: "Rituale Longevity Muse", unitAmount: 12000, duration: "90 min", confirmed: true, titles: { it: "Rituale Longevity Muse", en: "Longevity Muse Ritual", es: "Ritual Longevity Muse", fr: "Rituel Longevity Muse", de: "Longevity-Muse-Ritual" } },
};

export const headSpaStartingPriceEuros = Math.min(...headSpaProductIds.map((id) => checkoutCatalog[id].unitAmount)) / 100;
export const headSpaStartingMinutes = 45;
export const headSpaCount = headSpaProductIds.length;

export const allowedGiftAmounts = new Set([5000, 10000, 15000, 25000]);
