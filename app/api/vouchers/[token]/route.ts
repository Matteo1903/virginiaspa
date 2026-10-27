import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { orders, vouchers } from "../../../../db/schema";
import { purchaseCopy } from "../../../../lib/purchase";
import { renderGiftCardSvg } from "../../../../lib/gift-card-svg";
import type { Language } from "../../../i18n";

const locales: Record<Language, string> = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE" };
const voucherCopy: Record<Language, { invalid: string; missing: string; unavailable: string; digital: string; defaultMessage: string; forLabel: string; fromLabel: string; stub: string }> = {
  it: { invalid: "Voucher non valido", missing: "Voucher non trovato", unavailable: "Voucher non disponibile", digital: "VOUCHER DIGITALE", defaultMessage: "Un tempo solo tuo.", forLabel: "Per", fromLabel: "Da", stub: "PRESENTA IN SPA" },
  en: { invalid: "Invalid voucher", missing: "Voucher not found", unavailable: "Voucher unavailable", digital: "DIGITAL VOUCHER", defaultMessage: "Time just for you.", forLabel: "For", fromLabel: "From", stub: "PRESENT AT THE SPA" },
  es: { invalid: "Bono no válido", missing: "Bono no encontrado", unavailable: "Bono no disponible", digital: "BONO DIGITAL", defaultMessage: "Un tiempo solo para ti.", forLabel: "Para", fromLabel: "De", stub: "PRESENTA EN EL SPA" },
  fr: { invalid: "Bon invalide", missing: "Bon introuvable", unavailable: "Bon indisponible", digital: "BON NUMÉRIQUE", defaultMessage: "Un moment rien que pour vous.", forLabel: "Pour", fromLabel: "De", stub: "A PRESENTER AU SPA" },
  de: { invalid: "Ungültiger Gutschein", missing: "Gutschein nicht gefunden", unavailable: "Gutschein nicht verfügbar", digital: "DIGITALER GUTSCHEIN", defaultMessage: "Zeit nur für dich.", forLabel: "Für", fromLabel: "Von", stub: "IM SPA VORZEIGEN" },
};
const requestLanguage = (request: Request): Language => {
  const preferred = request.headers.get("accept-language")?.toLowerCase() || "";
  return (["en", "es", "fr", "de"].find((code) => preferred.includes(code)) || "it") as Language;
};

export async function GET(request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const fallbackLanguage = requestLanguage(request);
  if (!/^[a-f0-9]{32}$/i.test(token)) return new Response(voucherCopy[fallbackLanguage].invalid, { status: 404 });
  const db = await getDb();
  const [voucher] = await db.select().from(vouchers).where(eq(vouchers.claimToken, token)).limit(1);
  if (!voucher) return new Response(voucherCopy[fallbackLanguage].missing, { status: 404 });
  const [order] = await db.select({ language: orders.language }).from(orders).where(eq(orders.id, voucher.orderId)).limit(1);
  const language = (["it", "en", "es", "fr", "de"].includes(order?.language || "") ? order?.language : "it") as Language;
  const labels = voucherCopy[language];
  if (voucher.status === "rimborsato" || voucher.status === "scaduto") return new Response(labels.unavailable, { status: 410 });
  const copy = purchaseCopy[language];
  const locale = locales[language];
  const amount = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(voucher.amount / 100);
  const validUntil = new Date(voucher.validUntil).toLocaleDateString(locale);
  const svg = renderGiftCardSvg({
    eyebrow: labels.digital,
    title: voucher.title,
    message: voucher.message || labels.defaultMessage,
    recipient: voucher.recipient ? `${labels.forLabel} ${voucher.recipient}` : "",
    sender: voucher.sender ? `${labels.fromLabel} ${voucher.sender}` : "",
    amount,
    code: voucher.code,
    validUntil,
    stub: labels.stub,
    note: copy.svgNote,
  });
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Content-Disposition": `attachment; filename="Virginia-SPA-${voucher.code}.svg"`, "Cache-Control": "private, no-store" } });
}
