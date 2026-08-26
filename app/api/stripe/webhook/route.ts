import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { orderItems, orders, stripeEvents, voucherAudit, vouchers } from "../../../../db/schema";
import { secrets, verifyStripeSignature } from "../../../../lib/stripe";

type StripeEvent = { id: string; type: string; data: { object: Record<string, unknown> } };
const stringId = (value: unknown) => typeof value === "string" ? value : value && typeof value === "object" && "id" in value ? String((value as { id: unknown }).id) : "";

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("stripe-signature") || "";
  const secret = (await secrets()).STRIPE_WEBHOOK_SECRET;
  if (!secret || !(await verifyStripeSignature(raw, signature, secret))) return new Response("Firma webhook non valida", { status: 400 });

  const event = JSON.parse(raw) as StripeEvent;
  const db = await getDb();
  const processed = await db.select({ id: stripeEvents.id }).from(stripeEvents).where(eq(stripeEvents.id, event.id)).limit(1);
  if (processed.length) return Response.json({ received: true, duplicate: true });

  if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      const orderId = String((session.metadata as Record<string, unknown> | undefined)?.order_id || session.client_reference_id || "");
      const paymentIntentId = stringId(session.payment_intent);
      const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
      if (order) {
        await db.update(orders).set({ status: "pagato", paidAt: new Date().toISOString(), stripePaymentIntentId: paymentIntentId }).where(eq(orders.id, order.id));
        const existing = await db.select({ id: vouchers.id }).from(vouchers).where(eq(vouchers.orderId, order.id)).limit(1);
        if (!existing.length) {
          const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
          const validUntil = new Date(); validUntil.setFullYear(validUntil.getFullYear() + 1);
          for (const item of items) for (let count = 0; count < item.quantity; count += 1) {
            const voucherId = crypto.randomUUID();
            await db.insert(vouchers).values({ id: voucherId, orderId: order.id, orderItemId: item.id, code: `VS-${crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`, claimToken: crypto.randomUUID().replaceAll("-", ""), title: item.title, recipient: item.giftRecipient, sender: item.giftSender, message: item.giftMessage, amount: item.unitAmount, validUntil: validUntil.toISOString() });
            await db.insert(voucherAudit).values({ id: crypto.randomUUID(), voucherId, action: "pagato", actor: "stripe" });
          }
        }
      }
    }
  }

  if (["refund.created", "charge.refunded"].includes(event.type)) {
    const paymentIntentId = stringId(event.data.object.payment_intent);
    if (paymentIntentId) {
      const [order] = await db.select().from(orders).where(eq(orders.stripePaymentIntentId, paymentIntentId)).limit(1);
      if (order) {
        const eventAmount = Number(event.data.object.amount || 0);
        const amountRefunded = event.type === "refund.created" ? Math.min(order.amountTotal, order.amountRefunded + eventAmount) : Number(event.data.object.amount_refunded || order.amountRefunded);
        const fullyRefunded = event.data.object.refunded === true || amountRefunded >= order.amountTotal;
        await db.update(orders).set({ amountRefunded, ...(fullyRefunded ? { status: "rimborsato" as const, refundedAt: new Date().toISOString() } : {}) }).where(eq(orders.id, order.id));
        if (fullyRefunded) {
          const refundedAt = new Date().toISOString();
          const affected = await db.select().from(vouchers).where(eq(vouchers.orderId, order.id));
          for (const voucher of affected) if (voucher.status !== "rimborsato") {
            await db.update(vouchers).set({ status: "rimborsato", refundedAt }).where(eq(vouchers.id, voucher.id));
            await db.insert(voucherAudit).values({ id: crypto.randomUUID(), voucherId: voucher.id, action: "rimborsato", actor: "stripe" });
          }
        }
      }
    }
  }

  await db.insert(stripeEvents).values({ id: event.id, type: event.type });
  return Response.json({ received: true });
}
