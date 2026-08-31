import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { orders, vouchers } from "../../../../db/schema";
import { ORDER_ACCESS_COOKIE, verifyOrderAccess } from "../../../../lib/order-access";

const readCookie = (request: Request, name: string) => {
  const raw = request.headers.get("cookie") || "";
  const match = raw.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id") || "";
  if (!sessionId.startsWith("cs_")) return Response.json({ error: "Sessione non valida." }, { status: 400 });

  const db = await getDb();
  const [order] = await db.select().from(orders).where(eq(orders.stripeCheckoutSessionId, sessionId)).limit(1);
  if (!order) return Response.json({ status: "in_attesa", vouchers: [] });

  const access = readCookie(request, ORDER_ACCESS_COOKIE);
  const authorized = await verifyOrderAccess(sessionId, access);
  if (!authorized) {
    return Response.json({
      status: order.status,
      vouchers: [],
      locked: order.status === "pagato" || order.status === "rimborsato",
    });
  }

  const now = new Date().toISOString();
  const rows = await db.select().from(vouchers).where(eq(vouchers.orderId, order.id));
  for (const voucher of rows) {
    if (voucher.status === "pagato" && voucher.validUntil < now) {
      await db.update(vouchers).set({ status: "scaduto" }).where(eq(vouchers.id, voucher.id));
    }
  }
  const current = await db.select({
    title: vouchers.title,
    code: vouchers.code,
    claimToken: vouchers.claimToken,
    status: vouchers.status,
    validUntil: vouchers.validUntil,
  }).from(vouchers).where(eq(vouchers.orderId, order.id));

  return Response.json({ status: order.status, orderId: order.id, vouchers: current });
}
