import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../../../db";
import { voucherAudit, vouchers } from "../../../../../../db/schema";
import { staffAuthorized } from "../../../../../../lib/staff-auth";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await staffAuthorized(request))) return Response.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await context.params;
  if (!id || id.length > 80) return Response.json({ error: "Voucher non trovato" }, { status: 404 });
  const db = await getDb();
  const [voucher] = await db.select().from(vouchers).where(eq(vouchers.id, id)).limit(1);
  if (!voucher) return Response.json({ error: "Voucher non trovato" }, { status: 404 });
  if (voucher.validUntil < new Date().toISOString() && voucher.status === "pagato") {
    await db.update(vouchers).set({ status: "scaduto" }).where(and(eq(vouchers.id, id), eq(vouchers.status, "pagato")));
    return Response.json({ error: "Il voucher è scaduto." }, { status: 409 });
  }
  if (voucher.status !== "pagato") return Response.json({ error: `Il voucher è già ${voucher.status}.` }, { status: 409 });
  const usedAt = new Date().toISOString();
  await db.update(vouchers).set({ status: "utilizzato", usedAt }).where(and(eq(vouchers.id, id), eq(vouchers.status, "pagato")));
  const [updated] = await db.select().from(vouchers).where(eq(vouchers.id, id)).limit(1);
  if (!updated || updated.status !== "utilizzato" || updated.usedAt !== usedAt) {
    return Response.json({ error: `Il voucher è già ${updated?.status || voucher.status}.` }, { status: 409 });
  }
  await db.insert(voucherAudit).values({ id: crypto.randomUUID(), voucherId: id, action: "utilizzato", actor: "staff" });
  return Response.json({ status: "utilizzato", usedAt });
}
