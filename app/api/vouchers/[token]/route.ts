import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { orders, vouchers } from "../../../../db/schema";
import { purchaseCopy } from "../../../../lib/purchase";
import type { Language } from "../../../i18n";

const escapeXml = (value: string | null) => (value || "").replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[char] || char));
const locales: Record<Language, string> = { it: "it-IT", en: "en-GB", es: "es-ES", fr: "fr-FR", de: "de-DE" };
const voucherCopy: Record<Language, { invalid: string; missing: string; unavailable: string; digital: string; defaultMessage: string }> = {
  it: { invalid: "Voucher non valido", missing: "Voucher non trovato", unavailable: "Voucher non disponibile", digital: "VOUCHER DIGITALE", defaultMessage: "Un tempo solo tuo." },
  en: { invalid: "Invalid voucher", missing: "Voucher not found", unavailable: "Voucher unavailable", digital: "DIGITAL VOUCHER", defaultMessage: "Time just for you." },
  es: { invalid: "Bono no válido", missing: "Bono no encontrado", unavailable: "Bono no disponible", digital: "BONO DIGITAL", defaultMessage: "Un tiempo solo para ti." },
  fr: { invalid: "Bon invalide", missing: "Bon introuvable", unavailable: "Bon indisponible", digital: "BON NUMÉRIQUE", defaultMessage: "Un moment rien que pour vous." },
  de: { invalid: "Ungültiger Gutschein", missing: "Gutschein nicht gefunden", unavailable: "Gutschein nicht verfügbar", digital: "DIGITALER GUTSCHEIN", defaultMessage: "Zeit nur für dich." },
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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700"><rect width="1200" height="700" fill="#f5f0e7"/><rect x="34" y="34" width="1132" height="632" rx="36" fill="none" stroke="#b86145" stroke-width="2"/><circle cx="1020" cy="150" r="190" fill="#aab6a2" opacity=".32"/><text x="90" y="115" font-family="Georgia,serif" font-size="54" fill="#28382f">Virginia SPA</text><text x="90" y="200" font-family="Arial,sans-serif" font-size="18" letter-spacing="5" fill="#b86145">${escapeXml(labels.digital)}</text><text x="90" y="315" font-family="Georgia,serif" font-size="58" fill="#28382f">${escapeXml(voucher.title)}</text><text x="90" y="390" font-family="Georgia,serif" font-size="26" fill="#503044">${escapeXml(voucher.message || labels.defaultMessage)}</text><text x="90" y="490" font-family="Arial,sans-serif" font-size="20" fill="#697169">${escapeXml(voucher.code)}</text><text x="90" y="540" font-family="Arial,sans-serif" font-size="18" fill="#697169">${amount} · ${escapeXml(validUntil)}</text><text x="90" y="635" font-family="Arial,sans-serif" font-size="15" fill="#b86145">${escapeXml(copy.svgNote)}</text></svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Content-Disposition": `attachment; filename="Virginia-SPA-${voucher.code}.svg"`, "Cache-Control": "private, no-store" } });
}
