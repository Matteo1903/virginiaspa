import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { orderItems, orders } from "../../../db/schema";
import { allowedGiftAmounts, checkoutCatalog } from "../../../lib/catalog";
import { purchaseCopy } from "../../../lib/purchase";
import { secrets, stripeRequest } from "../../../lib/stripe";

type CheckoutItem = { id?: string; quantity?: number; price?: number; gift?: { to?: string; from?: string; message?: string; delivery?: string } };
type Payload = { name?: string; email?: string; phone?: string; language?: string; items?: CheckoutItem[]; acceptedTerms?: boolean };

const CLIENT_ERROR = "Dati del checkout non validi.";
const SERVER_ERROR = "Checkout non disponibile.";
const cap = (value: string, max: number) => value.slice(0, max);

const isLocalHost = (request: Request) => {
  const host = new URL(request.url).hostname;
  return host === "localhost" || host === "127.0.0.1";
};

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Payload;
    const name = cap(payload.name?.trim() ?? "", 120);
    const email = cap(payload.email?.trim().toLowerCase() ?? "", 254);
    const phone = cap(payload.phone?.trim() ?? "", 40);
    const language = (["it", "en", "es", "fr", "de"].includes(payload.language || "") ? payload.language : "it") as "it" | "en" | "es" | "fr" | "de";
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || phone.length < 5 || !payload.items?.length) {
      return Response.json({ error: "Dati del checkout incompleti." }, { status: 400 });
    }
    if (payload.name && payload.name.trim().length > 120) return Response.json({ error: CLIENT_ERROR }, { status: 400 });
    if (payload.phone && payload.phone.trim().length > 40) return Response.json({ error: CLIENT_ERROR }, { status: 400 });
    if (!payload.acceptedTerms) {
      return Response.json({ error: "Per procedere accetta privacy e termini." }, { status: 400 });
    }

    const env = await secrets();
    if (!env.PUBLIC_SITE_URL && !isLocalHost(request)) {
      console.error("PUBLIC_SITE_URL assente: checkout bloccato");
      return Response.json({ error: SERVER_ERROR }, { status: 503 });
    }

    const normalized = payload.items.map((item) => {
      const quantity = Math.max(1, Math.min(10, Math.floor(item.quantity || 1)));
      if (item.gift) {
        const amount = Math.round(Number(item.price) * 100);
        if (!allowedGiftAmounts.has(amount)) throw new Error(CLIENT_ERROR);
        const to = cap(item.gift.to?.trim() || "", 80);
        const from = cap(item.gift.from?.trim() || "", 80);
        const message = cap(item.gift.message?.trim() || "", 400);
        return { productId: "gift-card", title: "Virginia SPA Gift Card", quantity, unitAmount: amount, duration: "12 mesi", gift: { to, from, message, delivery: "now" as const } };
      }
      const product = item.id ? checkoutCatalog[item.id] : undefined;
      if (!product) throw new Error(CLIENT_ERROR);
      return { productId: item.id!, title: product.titles?.[language] || product.title, quantity, unitAmount: product.unitAmount, duration: product.duration, gift: undefined };
    });
    const amountTotal = normalized.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);
    const orderId = crypto.randomUUID();
    const db = await getDb();
    await db.insert(orders).values({ id: orderId, customerName: name, customerEmail: email, customerPhone: phone, amountTotal, language });
    const rows = normalized.map((item) => ({
      id: crypto.randomUUID(), orderId, productId: item.productId, title: item.title, quantity: item.quantity,
      unitAmount: item.unitAmount, duration: item.duration, giftRecipient: item.gift?.to || null,
      giftSender: item.gift?.from || null, giftMessage: item.gift?.message || null,
      giftDelivery: item.gift?.delivery || null,
    }));
    await db.insert(orderItems).values(rows);

    const origin = env.PUBLIC_SITE_URL || new URL(request.url).origin;
    const copy = purchaseCopy[language];
    const form = new URLSearchParams();
    form.set("mode", "payment");
    form.set("success_url", `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
    form.set("cancel_url", `${origin}/head-spa?checkout=annullato#shop`);
    form.set("customer_email", email);
    form.set("client_reference_id", orderId);
    form.set("metadata[order_id]", orderId);
    form.set("locale", language);
    form.set("custom_text[submit][message]", copy.stripeSubmit);
    form.set("payment_intent_data[description]", copy.stripeLine);
    normalized.forEach((item, index) => {
      const lineName = item.productId === "gift-card" ? item.title : `Voucher · ${item.title}`;
      form.set(`line_items[${index}][price_data][currency]`, "eur");
      form.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmount));
      form.set(`line_items[${index}][price_data][product_data][name]`, lineName);
      form.set(`line_items[${index}][price_data][product_data][description]`, `${item.duration} · ${copy.stripeLine}`);
      form.set(`line_items[${index}][quantity]`, String(item.quantity));
    });
    let session: { id: string; url: string };
    try {
      session = await stripeRequest("checkout/sessions", form, { idempotencyKey: `checkout-${orderId}` }) as { id: string; url: string };
    } catch (error) {
      console.error("stripe checkout", error);
      await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
      await db.delete(orders).where(eq(orders.id, orderId));
      throw new Error(SERVER_ERROR);
    }
    await db.update(orders).set({ stripeCheckoutSessionId: session.id }).where(eq(orders.id, orderId));
    return Response.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : SERVER_ERROR;
    if (message === CLIENT_ERROR || message === "Dati del checkout incompleti." || message === "Per procedere accetta privacy e termini.") {
      return Response.json({ error: message }, { status: 400 });
    }
    console.error("checkout", error);
    return Response.json({ error: SERVER_ERROR }, { status: 500 });
  }
}
