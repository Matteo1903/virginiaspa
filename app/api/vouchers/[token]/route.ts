import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { orderItems, orders, vouchers } from "../../../../db/schema";
import { voucherCopy, voucherFileName, voucherPdf, voucherSvg } from "../../../../lib/voucher-document";
import type { Language } from "../../../i18n";

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
  const [item] = await db.select({ productId: orderItems.productId, giftDelivery: orderItems.giftDelivery }).from(orderItems).where(eq(orderItems.id, voucher.orderItemId)).limit(1);
  const language = (["it", "en", "es", "fr", "de"].includes(order?.language || "") ? order?.language : "it") as Language;
  if (voucher.status === "rimborsato" || voucher.status === "scaduto") return new Response(voucherCopy[language].unavailable, { status: 410 });
  const svg = await voucherSvg({ ...voucher, productId: item?.productId, giftDelivery: Boolean(item?.giftDelivery) }, language);
  if (new URL(request.url).searchParams.get("format") === "svg") {
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Content-Disposition": `attachment; filename="${voucherFileName(voucher.code, "svg")}"`, "Cache-Control": "private, no-store" } });
  }
  const pdf = await voucherPdf(svg, voucher.code);
  return new Response(Buffer.from(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${voucherFileName(voucher.code, "pdf")}"`, "Cache-Control": "private, no-store" } });
}
