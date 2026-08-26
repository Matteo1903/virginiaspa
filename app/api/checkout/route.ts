import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { orderItems, orders } from "../../../db/schema";
import { allowedGiftAmounts, checkoutCatalog } from "../../../lib/catalog";
import { secrets, stripeRequest } from "../../../lib/stripe";

type CheckoutItem = { id?: string; quantity?: number; price?: number; gift?: { to?: string; from?: string; message?: string; delivery?: string } };
type Payload = { name?: string; email?: string; phone?: string; language?: string; items?: CheckoutItem[] };

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Payload;
    const name = payload.name?.trim() ?? "";
    const email = payload.email?.trim().toLowerCase() ?? "";
    const phone = payload.phone?.trim() ?? "";
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !payload.items?.length) {
      return Response.json({ error: "Dati del checkout incompleti." }, { status: 400 });
    }

    const normalized = payload.items.map((item) => {
      const quantity = Math.max(1, Math.min(10, Math.floor(item.quantity || 1)));
      if (item.gift) {
        const amount = Math.round(Number(item.price) * 100);
        if (!allowedGiftAmounts.has(amount)) throw new Error("Valore Gift Card non valido.");
        return { productId: "gift-card", title: "Virginia SPA Gift Card", quantity, unitAmount: amount, duration: "12 mesi", gift: item.gift };
      }
      const product = item.id ? checkoutCatalog[item.id] : undefined;
      if (!product) throw new Error("Trattamento non valido.");
      return { productId: item.id!, title: product.title, quantity, unitAmount: product.unitAmount, duration: product.duration, gift: undefined };
    });
    const amountTotal = normalized.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);
    const orderId = crypto.randomUUID();
    const db = await getDb();
    await db.insert(orders).values({ id: orderId, customerName: name, customerEmail: email, customerPhone: phone, amountTotal, language: payload.language || "it" });
    const rows = normalized.map((item) => ({
      id: crypto.randomUUID(), orderId, productId: item.productId, title: item.title, quantity: item.quantity,
      unitAmount: item.unitAmount, duration: item.duration, giftRecipient: item.gift?.to?.trim() || null,
      giftSender: item.gift?.from?.trim() || null, giftMessage: item.gift?.message?.trim() || null,
      giftDelivery: item.gift?.delivery || null,
    }));
    await db.insert(orderItems).values(rows);

    const origin = (await secrets()).PUBLIC_SITE_URL || new URL(request.url).origin;
    const form = new URLSearchParams();
    form.set("mode", "payment");
    form.set("success_url", `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
    form.set("cancel_url", `${origin}/head-spa?checkout=annullato#shop`);
    form.set("customer_email", email);
    form.set("client_reference_id", orderId);
    form.set("metadata[order_id]", orderId);
    form.set("locale", ["it", "en", "es", "fr", "de"].includes(payload.language || "") ? payload.language! : "auto");
    normalized.forEach((item, index) => {
      form.set(`line_items[${index}][price_data][currency]`, "eur");
      form.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmount));
      form.set(`line_items[${index}][price_data][product_data][name]`, item.title);
      form.set(`line_items[${index}][price_data][product_data][description]`, item.duration);
      form.set(`line_items[${index}][quantity]`, String(item.quantity));
    });
    const session = await stripeRequest("checkout/sessions", form) as { id: string; url: string };
    await db.update(orders).set({ stripeCheckoutSessionId: session.id }).where(eq(orders.id, orderId));
    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Checkout non disponibile." }, { status: 500 });
  }
}
