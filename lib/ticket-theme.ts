import type { Language } from "../app/i18n";
import { checkoutCatalog, headSpaProductIds } from "./catalog";
import { giftRitualDetail } from "./gift";

export type TicketFamily = "gift" | "voucher" | "head-spa" | "terra" | "luna" | "rosa" | "surya" | "ambra" | "ayurveda" | "longevity";

const byProduct: Record<string, TicketFamily> = {
  "gift-card": "gift",
  "rituale-terra": "terra",
  "rituale-luna": "luna",
  "rituale-rosa": "rosa",
  "rituale-surya": "surya",
  "rituale-luce-ambra": "ambra",
  "percorso-ayurveda": "ayurveda",
  "rituale-peel-longevity": "longevity",
  "rituale-longevity-muse": "longevity",
};
for (const id of headSpaProductIds) byProduct[id] = "head-spa";

const labels: Record<Exclude<TicketFamily, "gift" | "voucher">, Record<Language, string>> = {
  "head-spa": { it: "HEAD SPA", en: "HEAD SPA", es: "HEAD SPA", fr: "HEAD SPA", de: "HEAD SPA" },
  terra: { it: "Terra", en: "Earth", es: "Tierra", fr: "Terre", de: "Erde" },
  luna: { it: "Luna", en: "Moon", es: "Luna", fr: "Lune", de: "Mond" },
  rosa: { it: "Rosa", en: "Rose", es: "Rosa", fr: "Rose", de: "Rose" },
  surya: { it: "Surya", en: "Surya", es: "Surya", fr: "Surya", de: "Surya" },
  ambra: { it: "Ambra", en: "Amber", es: "Ámbar", fr: "Ambre", de: "Bernstein" },
  ayurveda: { it: "Ayurveda", en: "Ayurveda", es: "Ayurveda", fr: "Ayurveda", de: "Ayurveda" },
  longevity: { it: "Longevity", en: "Longevity", es: "Longevity", fr: "Longevity", de: "Longevity" },
};

const palette: Record<TicketFamily, { accent: string; wash: string; paper: string; deep: string }> = {
  gift: { accent: "#b86145", wash: "#f3e6d2", paper: "#fbf6ec", deep: "#22312a" },
  voucher: { accent: "#3d5c4a", wash: "#e7efe8", paper: "#f7f4ee", deep: "#28382f" },
  "head-spa": { accent: "#3d5c4a", wash: "#e4efe6", paper: "#f4f7f3", deep: "#24362c" },
  terra: { accent: "#8c5a3c", wash: "#f0e2d2", paper: "#fbf6ee", deep: "#4a3024" },
  luna: { accent: "#5c3d52", wash: "#efe6ee", paper: "#f8f4f6", deep: "#3a2434" },
  rosa: { accent: "#a15a62", wash: "#f6e8e6", paper: "#fbf6f4", deep: "#5c3036" },
  surya: { accent: "#b1842e", wash: "#f7efd8", paper: "#fbf8ef", deep: "#5c4318" },
  ambra: { accent: "#c47a32", wash: "#f6ead4", paper: "#fbf6ec", deep: "#5a3814" },
  ayurveda: { accent: "#5d6b3e", wash: "#eef0e4", paper: "#f7f6ef", deep: "#2e3820" },
  longevity: { accent: "#5e727c", wash: "#e7eef1", paper: "#f5f7f6", deep: "#2c3840" },
};

const titleIndex = new Map<string, string>();
for (const [id, product] of Object.entries(checkoutCatalog)) {
  if (!byProduct[id] || byProduct[id] === "gift") continue;
  for (const name of [product.title, ...Object.values(product.titles || {})]) {
    titleIndex.set(name.trim().toLowerCase(), id);
  }
}

export type TicketLook = { id: TicketFamily; accent: string; wash: string; paper: string; deep: string; family: string; art: string; duration: string };

export const ticketLook = (productId: string | undefined, title: string | undefined, language: Language, kind: "gift" | "voucher"): TicketLook => {
  const product = productId && byProduct[productId] && byProduct[productId] !== "gift" ? productId : titleIndex.get((title || "").trim().toLowerCase());
  const named = product ? byProduct[product] : undefined;
  const id: TicketFamily = named ?? (kind === "voucher" ? "voucher" : "gift");
  return { id, ...palette[id], family: named ? labels[named as keyof typeof labels][language] : "", art: id === "voucher" ? "" : id, duration: product ? giftRitualDetail(checkoutCatalog[product].duration, "", language) : "" };
};

export const ticketArtUrl = (art: string, format: "webp" | "jpg" = "webp") => art ? `/tickets/${art}.${format}` : "";

const passWord: Record<Language, string> = { it: "Voucher", en: "Voucher", es: "Bono", fr: "Bon", de: "Gutschein" };

export const ticketSvgPaint = (look: TicketLook, kind: "gift" | "voucher", language: Language) => ({
  accent: look.accent,
  wash: look.wash,
  paper: look.paper,
  deep: look.deep,
  family: look.family,
  kind,
  mark: kind === "voucher" ? passWord[language] : "",
});
