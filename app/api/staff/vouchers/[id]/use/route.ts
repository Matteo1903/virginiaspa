import { eq } from "drizzle-orm";
import { getDb } from "../../../../../../db";
import { voucherAudit, vouchers } from "../../../../../../db/schema";
import { secrets } from "../../../../../../lib/stripe";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const expected = (await secrets()).SPA_STAFF_TOKEN;
  if (!expected || request.headers.get("authorization") !== `Bearer ${expected}`) return Response.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await context.params;
  const db = await getDb();
  const [voucher] = await db.select().from(vouchers).where(eq(vouchers.id, id)).limit(1);
  if (!voucher) return Response.json({ error: "Voucher non trovato" }, { status: 404 });
  if (voucher.status !== "pagato") return Response.json({ error: `Il voucher è già ${voucher.status}.` }, { status: 409 });
  if (voucher.validUntil < new Date().toISOString()) {
    await db.update(vouchers).set({ status: "scaduto" }).where(eq(vouchers.id, id));
    return Response.json({ error: "Il voucher è scaduto." }, { status: 409 });
  }
  const usedAt = new Date().toISOString();
  await db.update(vouchers).set({ status: "utilizzato", usedAt }).where(eq(vouchers.id, id));
  await db.insert(voucherAudit).values({ id: crypto.randomUUID(), voucherId: id, action: "utilizzato", actor: "staff" });
  return Response.json({ status: "utilizzato", usedAt });
}
