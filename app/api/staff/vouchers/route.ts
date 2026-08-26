import { desc, eq, like, or } from "drizzle-orm";
import { getDb } from "../../../../db";
import { orders, vouchers } from "../../../../db/schema";
import { secrets } from "../../../../lib/stripe";

const authorized = async (request: Request) => {
  const expected = (await secrets()).SPA_STAFF_TOKEN;
  return Boolean(expected && request.headers.get("authorization") === `Bearer ${expected}`);
};

export async function GET(request: Request) {
  if (!(await authorized(request))) return Response.json({ error: "Non autorizzato" }, { status: 401 });
  const query = new URL(request.url).searchParams.get("q")?.trim() || "";
  const db = await getDb();
  const now = new Date().toISOString();
  const activeExpired = await db.select().from(vouchers).where(eq(vouchers.status, "pagato"));
  for (const voucher of activeExpired) if (voucher.validUntil < now) await db.update(vouchers).set({ status: "scaduto" }).where(eq(vouchers.id, voucher.id));
  const condition = query ? or(like(vouchers.code, `%${query}%`), like(vouchers.title, `%${query}%`), like(orders.customerEmail, `%${query}%`)) : undefined;
  const rows = await db.select({ id: vouchers.id, code: vouchers.code, title: vouchers.title, status: vouchers.status, validUntil: vouchers.validUntil, usedAt: vouchers.usedAt, recipient: vouchers.recipient, customerName: orders.customerName, customerEmail: orders.customerEmail }).from(vouchers).innerJoin(orders, eq(vouchers.orderId, orders.id)).where(condition).orderBy(desc(vouchers.createdAt)).limit(100);
  return Response.json({ vouchers: rows });
}
