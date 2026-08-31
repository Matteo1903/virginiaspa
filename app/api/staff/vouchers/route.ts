import { desc, eq, like, or } from "drizzle-orm";
import { getDb } from "../../../../db";
import { orders, vouchers } from "../../../../db/schema";
import { staffAuthorized, staffSessionCookie } from "../../../../lib/staff-auth";

export async function GET(request: Request) {
  if (!(await staffAuthorized(request))) return Response.json({ error: "Non autorizzato" }, { status: 401 });
  const query = new URL(request.url).searchParams.get("q")?.trim().slice(0, 80).replace(/[%_]/g, "") || "";
  const db = await getDb();
  const now = new Date().toISOString();
  const activeExpired = await db.select().from(vouchers).where(eq(vouchers.status, "pagato"));
  for (const voucher of activeExpired) if (voucher.validUntil < now) await db.update(vouchers).set({ status: "scaduto" }).where(eq(vouchers.id, voucher.id));
  const condition = query ? or(like(vouchers.code, `%${query}%`), like(vouchers.title, `%${query}%`), like(orders.customerEmail, `%${query}%`)) : undefined;
  const rows = await db.select({ id: vouchers.id, code: vouchers.code, title: vouchers.title, status: vouchers.status, validUntil: vouchers.validUntil, usedAt: vouchers.usedAt, recipient: vouchers.recipient, customerName: orders.customerName, customerEmail: orders.customerEmail }).from(vouchers).innerJoin(orders, eq(vouchers.orderId, orders.id)).where(condition).orderBy(desc(vouchers.createdAt)).limit(100);
  const token = (request.headers.get("authorization") || "").replace(/^bearer /i, "").trim();
  const headers = new Headers({ "Content-Type": "application/json" });
  if (token) headers.append("Set-Cookie", staffSessionCookie(request, token));
  return new Response(JSON.stringify({ vouchers: rows }), { status: 200, headers });
}
