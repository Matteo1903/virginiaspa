import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { vouchers } from "../../../../db/schema";

const escapeXml = (value: string | null) => (value || "").replace(/[<>&'\"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[char] || char));

export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  if (!/^[a-f0-9]{32}$/i.test(token)) return new Response("Voucher non valido", { status: 404 });
  const db = await getDb();
  const [voucher] = await db.select().from(vouchers).where(eq(vouchers.claimToken, token)).limit(1);
  if (!voucher) return new Response("Voucher non trovato", { status: 404 });
  if (voucher.status === "rimborsato" || voucher.status === "scaduto") return new Response("Voucher non disponibile", { status: 410 });
  const amount = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(voucher.amount / 100);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700"><rect width="1200" height="700" fill="#f5f0e7"/><rect x="34" y="34" width="1132" height="632" rx="36" fill="none" stroke="#b86145" stroke-width="2"/><circle cx="1020" cy="150" r="190" fill="#aab6a2" opacity=".32"/><text x="90" y="115" font-family="Georgia,serif" font-size="54" fill="#28382f">Virginia SPA</text><text x="90" y="200" font-family="Arial,sans-serif" font-size="18" letter-spacing="5" fill="#b86145">VOUCHER DIGITALE · PAGATO</text><text x="90" y="315" font-family="Georgia,serif" font-size="58" fill="#28382f">${escapeXml(voucher.title)}</text><text x="90" y="390" font-family="Georgia,serif" font-size="26" fill="#503044">${escapeXml(voucher.message || "Un tempo solo tuo.")}</text><text x="90" y="490" font-family="Arial,sans-serif" font-size="20" fill="#697169">CODICE ${escapeXml(voucher.code)}</text><text x="90" y="540" font-family="Arial,sans-serif" font-size="18" fill="#697169">VALORE ${amount} · VALIDO FINO AL ${new Date(voucher.validUntil).toLocaleDateString("it-IT")}</text><text x="90" y="610" font-family="Arial,sans-serif" font-size="15" fill="#697169">Stato: ${escapeXml(voucher.status.toUpperCase())} · Verifica presso Virginia SPA</text></svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Content-Disposition": `attachment; filename="Virginia-SPA-${voucher.code}.svg"`, "Cache-Control": "private, no-store" } });
}
