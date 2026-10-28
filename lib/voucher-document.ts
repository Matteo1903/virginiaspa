import { readFile } from "node:fs/promises";
import path from "node:path";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import { PDFDocument } from "pdf-lib";
import type { Language } from "../app/i18n";
import { renderGiftCardSvg } from "./gift-card-svg";
import { purchaseCopy } from "./purchase";
import { ticketArtUrl, ticketLook, ticketSvgPaint } from "./ticket-theme";

export const voucherCopy: Record<Language, { invalid: string; missing: string; unavailable: string; digital: string; gift: string; defaultMessage: string; forLabel: string; fromLabel: string; stub: string }> = {
  it: { invalid: "Voucher non valido", missing: "Voucher non trovato", unavailable: "Voucher non disponibile", digital: "VOUCHER DIGITALE", gift: "GIFT CARD", defaultMessage: "Un tempo solo tuo.", forLabel: "Per", fromLabel: "Da", stub: "PRESENTA IN SPA" },
  en: { invalid: "Invalid voucher", missing: "Voucher not found", unavailable: "Voucher unavailable", digital: "DIGITAL VOUCHER", gift: "GIFT CARD", defaultMessage: "Time just for you.", forLabel: "For", fromLabel: "From", stub: "PRESENT AT THE SPA" },
  es: { invalid: "Bono no válido", missing: "Bono no encontrado", unavailable: "Bono no disponible", digital: "BONO DIGITAL", gift: "TARJETA REGALO", defaultMessage: "Un tiempo solo para ti.", forLabel: "Para", fromLabel: "De", stub: "PRESENTA EN EL SPA" },
  fr: { invalid: "Bon invalide", missing: "Bon introuvable", unavailable: "Bon indisponible", digital: "BON NUMÉRIQUE", gift: "CARTE CADEAU", defaultMessage: "Un moment rien que pour vous.", forLabel: "Pour", fromLabel: "De", stub: "A PRESENTER AU SPA" },
  de: { invalid: "Ungültiger Gutschein", missing: "Gutschein nicht gefunden", unavailable: "Gutschein nicht verfügbar", digital: "DIGITALER GUTSCHEIN", gift: "GESCHENKKARTE", defaultMessage: "Zeit nur für dich.", forLabel: "Für", fromLabel: "Von", stub: "IM SPA VORZEIGEN" },
};

const locales: Record<Language, string> = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE" };

export type VoucherDocumentInput = {
  code: string;
  title: string;
  message: string | null;
  recipient: string | null;
  sender: string | null;
  amount: number;
  validUntil: string;
  productId?: string | null;
  giftDelivery?: boolean | null;
};

export const voucherFileName = (code: string, format: "svg" | "pdf") => `Virginia-SPA-${code}.${format}`;

export async function voucherSvg(voucher: VoucherDocumentInput, language: Language) {
  const labels = voucherCopy[language];
  const locale = locales[language];
  const isGift = voucher.productId === "gift-card" || Boolean(voucher.giftDelivery);
  const kind = isGift ? "gift" : "voucher";
  const look = ticketLook(voucher.productId || undefined, voucher.title, language, kind);
  const art = look.art ? await readFile(path.join(process.cwd(), "public", ticketArtUrl(look.art, "jpg"))).then((file) => `data:image/jpeg;base64,${file.toString("base64")}`).catch(() => "") : "";
  return renderGiftCardSvg({
    eyebrow: isGift ? labels.gift : labels.digital,
    ...ticketSvgPaint(look, kind, language),
    art,
    title: voucher.title,
    message: voucher.message || labels.defaultMessage,
    recipient: voucher.recipient ? `${labels.forLabel} ${voucher.recipient}` : "",
    sender: voucher.sender ? `${labels.fromLabel} ${voucher.sender}` : "",
    amount: new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(voucher.amount / 100),
    code: voucher.code,
    validUntil: new Date(voucher.validUntil).toLocaleDateString(locale),
    stub: labels.stub,
    note: purchaseCopy[language].svgNote,
  });
}

const fontFiles = ["CrimsonText-Regular.ttf", "CrimsonText-Italic.ttf", "Lato-Regular.ttf", "Lato-Bold.ttf"];
let renderer: Promise<Uint8Array[]> | null = null;

const loadRenderer = () => {
  renderer ??= (async () => {
    const root = process.cwd();
    await initWasm(await readFile(path.join(root, "node_modules", "@resvg", "resvg-wasm", "index_bg.wasm")));
    return Promise.all(fontFiles.map(async (file) => new Uint8Array(await readFile(path.join(root, "assets", "fonts", file)))));
  })().catch((error) => {
    renderer = null;
    throw error;
  });
  return renderer;
};

// Page is the card at half its SVG pixel size in points (about 22.6 × 13.4 cm); the raster is 4× that for print.
export async function voucherPdf(svg: string, code: string) {
  const fontBuffers = await loadRenderer();
  const resvg = new Resvg(svg, {
    fitTo: { mode: "zoom", value: 2 },
    background: "#ffffff",
    font: { fontBuffers, defaultFontFamily: "Lato", serifFamily: "Crimson Text", sansSerifFamily: "Lato" },
  });
  const image = resvg.render();
  const png = image.asPng();
  const width = resvg.width / 2;
  const height = resvg.height / 2;
  image.free();
  resvg.free();
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Virginia SPA · ${code}`);
  pdf.setAuthor("Virginia SPA");
  pdf.setCreator("Virginia SPA");
  const embedded = await pdf.embedPng(png);
  pdf.addPage([width, height]).drawImage(embedded, { x: 0, y: 0, width, height });
  return pdf.save();
}
