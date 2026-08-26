export const checkoutCatalog: Record<string, { title: string; unitAmount: number; duration: string }> = {
  "cielo-terra": { title: "Cielo & Terra", unitAmount: 11000, duration: "75 min" },
  "radici-armonia": { title: "Radici di Armonia", unitAmount: 9000, duration: "60 min" },
  "abbandono-sensoriale": { title: "Abbandono Sensoriale", unitAmount: 13000, duration: "90 min" },
  "wine-essence": { title: "Wine Essence", unitAmount: 12500, duration: "75 min" },
  "abbraccio-vita": { title: "Abbraccio di Vita", unitAmount: 9500, duration: "60 min" },
  carezza: { title: "Carezza", unitAmount: 7500, duration: "45 min" },
  "two-souls": { title: "Two Souls Ritual", unitAmount: 24000, duration: "2 persone · 90 min" },
};

export const allowedGiftAmounts = new Set([5000, 10000, 15000, 25000]);
