import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { orderItems, orders, stripeEvents, voucherAudit, vouchers } from "../../../../db/schema";
import { sendVoucherEmail } from "../../../../lib/email";
import { secrets, verifyStripeSignature } from "../../../../lib/stripe";

type StripeEvent = { id: string; type: string; data: { object: Record<string, unknown> } };
type Db = Awaited<ReturnType<typeof getDb>>;

const stringId = (value: unknown) => typeof value === "string" ? value : value && typeof value === "object" && "id" in value ? String((value as { id: unknown }).id) : "";

const issueVouchers = async (db: Db, orderId: string) => {
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  const existing = await db.select({ orderItemId: vouchers.orderItemId }).from(vouchers).where(eq(vouchers.orderId, orderId));
  const issuedByItem = new Map<string, number>();
  for (const row of existing) {
    issuedByItem.set(row.orderItemId, (issuedByItem.get(row.orderItemId) || 0) + 1);
  }
  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);
  const created: { title: string; code: string; claimToken: string }[] = [];
  for (const item of items) {
    const already = issuedByItem.get(item.id) || 0;
    for (let count = already; count < item.quantity; count += 1) {
      const voucherId = crypto.randomUUID();
      const code = `VS-${crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`;
      const claimToken = crypto.randomUUID().replaceAll("-", "");
      await db.insert(vouchers).values({
        id: voucherId,
        orderId,
        orderItemId: item.id,
        code,
        claimToken,
        title: item.title,
        recipient: item.giftRecipient,
        sender: item.giftSender,
        message: item.giftMessage,
        amount: item.unitAmount,
        validUntil: validUntil.toISOString(),
      });
      await db.insert(voucherAudit).values({ id: crypto.randomUUID(), voucherId, action: "pagato", actor: "stripe" });
      created.push({ title: item.title, code, claimToken });
    }
  }
  return created;
};

const handlePaidSession = async (db: Db, session: Record<string, unknown>) => {
  if (session.payment_status !== "paid") return;
  const orderId = String((session.metadata as Record<string, unknown> | undefined)?.order_id || session.client_reference_id || "");
  const [order] = orderId ? await db.select().from(orders).where(eq(orders.id, orderId)).limit(1) : [];
  if (!order) throw new Error("Ordine non trovato per sessione pagata");
  await db.update(orders).set({
    status: "pagato",
    paidAt: order.paidAt || new Date().toISOString(),
    stripePaymentIntentId: stringId(session.payment_intent) || order.stripePaymentIntentId,
  }).where(eq(orders.id, order.id));
  await issueVouchers(db, order.id);
  const allVouchers = await db.select({
    title: vouchers.title,
    code: vouchers.code,
    claimToken: vouchers.claimToken,
  }).from(vouchers).where(eq(vouchers.orderId, order.id));
  const origin = (await secrets()).PUBLIC_SITE_URL || "";
  const language = (["it", "en", "es", "fr", "de"].includes(order.language) ? order.language : "it") as "it" | "en" | "es" | "fr" | "de";
  try {
    const result = await sendVoucherEmail({
      to: order.customerEmail,
      customerName: order.customerName,
      language,
      vouchers: allVouchers,
      siteUrl: origin,
    });
    if (result.skipped && origin) {
      console.warn("email voucher saltata: configurazione Resend assente o URL mancante");
    }
  } catch (error) {
    console.error("email voucher", error);
    throw error;
  }
};

const handleChargeRefunded = async (db: Db, charge: Record<string, unknown>) => {
  const paymentIntentId = stringId(charge.payment_intent);
  if (!paymentIntentId) return;
  const [order] = await db.select().from(orders).where(eq(orders.stripePaymentIntentId, paymentIntentId)).limit(1);
  if (!order) return;
  const amountRefunded = Math.min(order.amountTotal, Number(charge.amount_refunded || 0));
  const fullyRefunded = charge.refunded === true || amountRefunded >= order.amountTotal;
  await db.update(orders).set({
    amountRefunded,
    ...(fullyRefunded ? { status: "rimborsato" as const, refundedAt: new Date().toISOString() } : {}),
  }).where(eq(orders.id, order.id));
  if (!fullyRefunded) return;
  const refundedAt = new Date().toISOString();
  const affected = await db.select().from(vouchers).where(eq(vouchers.orderId, order.id));
  for (const voucher of affected) {
    if (voucher.status === "rimborsato" || voucher.status === "utilizzato") continue;
    await db.update(vouchers).set({ status: "rimborsato", refundedAt }).where(and(eq(vouchers.id, voucher.id), eq(vouchers.status, "pagato")));
    const [updated] = await db.select().from(vouchers).where(eq(vouchers.id, voucher.id)).limit(1);
    if (updated?.status === "rimborsato") {
      await db.insert(voucherAudit).values({ id: crypto.randomUUID(), voucherId: voucher.id, action: "rimborsato", actor: "stripe" });
    }
  }
};

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("stripe-signature") || "";
  const secret = (await secrets()).STRIPE_WEBHOOK_SECRET;
  if (!secret || !(await verifyStripeSignature(raw, signature, secret))) return new Response("Firma webhook non valida", { status: 400 });

  const event = JSON.parse(raw) as StripeEvent;
  const db = await getDb();
  try {
    await db.insert(stripeEvents).values({ id: event.id, type: event.type });
  } catch (error) {
    const message = [error, error instanceof Error ? error.cause : undefined]
      .map((value) => value instanceof Error ? value.message : "")
      .join(" ");
    if (/unique|constraint/i.test(message)) return Response.json({ received: true, duplicate: true });
    throw error;
  }

  try {
    if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
      await handlePaidSession(db, event.data.object);
    }
    if (event.type === "charge.refunded") {
      await handleChargeRefunded(db, event.data.object);
    }
  } catch (error) {
    await db.delete(stripeEvents).where(eq(stripeEvents.id, event.id));
    return Response.json({ error: error instanceof Error ? error.message : "Webhook non elaborato" }, { status: 500 });
  }

  return Response.json({ received: true });
}
