import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

const BASE = process.env.PAYMENT_TEST_BASE || "http://localhost:5173";
const STAFF = "dev-staff-token-change-me";

const loadDevVars = () => {
  const text = readFileSync(new URL("../.dev.vars", import.meta.url), "utf8");
  const vars = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    vars[trimmed.slice(0, index)] = trimmed.slice(index + 1);
  }
  return vars;
};

const sign = (payload, secret) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const hmac = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  return `t=${timestamp},v1=${hmac}`;
};

const json = async (response) => {
  const text = await response.text();
  try {
    return { status: response.status, body: JSON.parse(text), text };
  } catch {
    return { status: response.status, body: null, text };
  }
};

const post = (path, body, headers = {}) => fetch(`${BASE}${path}`, {
  method: "POST",
  headers: { "Content-Type": "application/json", ...headers },
  body: JSON.stringify(body),
});

const checkoutItem = {
  name: "Andrea Test",
  email: "andrea.protani+stripe@example.com",
  phone: "3331234567",
  language: "it",
};

test("rejects incomplete checkout", async () => {
  const { status, body } = await json(await post("/api/checkout", {}));
  assert.equal(status, 400);
  assert.match(body.error, /incompleti/i);
});

test("rejects unknown treatments", async () => {
  const { status, body } = await json(await post("/api/checkout", { ...checkoutItem, items: [{ id: "non-esiste", quantity: 1 }] }));
  assert.equal(status, 500);
  assert.match(body.error, /non valido/i);
});

test("rejects invalid gift amounts and past delivery dates", async () => {
  const amount = await json(await post("/api/checkout", { ...checkoutItem, items: [{ price: 12, gift: { to: "Anna", from: "Luca", message: "ciao", delivery: "now" } }] }));
  assert.equal(amount.status, 500);
  assert.match(amount.body.error, /Gift Card/i);
  const date = await json(await post("/api/checkout", { ...checkoutItem, items: [{ price: 50, gift: { delivery: "2020-01-01" } }] }));
  assert.equal(date.status, 500);
  assert.match(date.body.error, /consegna/i);
});

test("rejects unsigned webhooks and unauthorized staff", async () => {
  const webhook = await json(await fetch(`${BASE}/api/stripe/webhook`, { method: "POST", body: "{}" }));
  assert.equal(webhook.status, 400);
  const staff = await json(await fetch(`${BASE}/api/staff/vouchers`));
  assert.equal(staff.status, 401);
  const status = await json(await fetch(`${BASE}/api/orders/status?session_id=not-a-session`));
  assert.equal(status.status, 400);
});

test("creates a Stripe Checkout session as a voucher, then issues and redeems it", async (t) => {
  const vars = loadDevVars();
  const { status, body } = await json(await post("/api/checkout", {
    ...checkoutItem,
    items: [{ id: "cielo-terra", quantity: 1, price: 1 }],
  }));
  assert.equal(status, 200, body.error || JSON.stringify(body));
  assert.match(body.url, /^https:\/\/checkout\.stripe\.com\//);
  const sessionId = new URL(body.url).pathname.split("/").find((part) => part.startsWith("cs_test_") || part.startsWith("cs_"));
  assert.ok(sessionId, "Stripe session id missing from checkout URL");

  const stripe = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${vars.STRIPE_SECRET_KEY}:`).toString("base64")}` },
  });
  const session = await stripe.json();
  assert.equal(stripe.ok, true, session.error?.message);
  assert.equal(session.metadata.order_id, session.client_reference_id);
  assert.equal(session.amount_total, 11000);
  assert.match(session.custom_text?.submit?.message || "", /voucher/i);

  const line = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}/line_items`, {
    headers: { Authorization: `Basic ${Buffer.from(`${vars.STRIPE_SECRET_KEY}:`).toString("base64")}` },
  }).then((response) => response.json());
  assert.match(line.data[0].description, /Voucher · Cielo/);

  const paidSession = {
    id: session.id,
    payment_status: "paid",
    payment_intent: session.payment_intent || `pi_test_${sessionId.slice(-12)}`,
    metadata: session.metadata,
    client_reference_id: session.client_reference_id,
  };
  const paidEvent = {
    id: `evt_test_${crypto.randomUUID().replaceAll("-", "")}`,
    type: "checkout.session.completed",
    data: { object: paidSession },
  };
  const payload = JSON.stringify(paidEvent);
  const paid = await json(await fetch(`${BASE}/api/stripe/webhook`, {
    method: "POST",
    headers: { "stripe-signature": sign(payload, vars.STRIPE_WEBHOOK_SECRET) },
    body: payload,
  }));
  assert.equal(paid.status, 200, paid.text);
  assert.equal(paid.body.received, true);

  const duplicate = await json(await fetch(`${BASE}/api/stripe/webhook`, {
    method: "POST",
    headers: { "stripe-signature": sign(payload, vars.STRIPE_WEBHOOK_SECRET) },
    body: payload,
  }));
  assert.equal(duplicate.status, 200, duplicate.text);
  assert.equal(duplicate.body.duplicate, true);

  const order = await json(await fetch(`${BASE}/api/orders/status?session_id=${sessionId}`));
  assert.equal(order.status, 200, order.text);
  assert.equal(order.body.status, "pagato");
  assert.equal(order.body.vouchers.length, 1);
  const voucher = order.body.vouchers[0];
  assert.equal(voucher.status, "pagato");
  assert.match(voucher.code, /^VS-/);

  const svg = await fetch(`${BASE}/api/vouchers/${voucher.claimToken}`);
  const image = await svg.text();
  assert.equal(svg.status, 200);
  assert.match(svg.headers.get("content-type") || "", /svg/);
  assert.match(image, /VOUCHER DIGITALE/);
  assert.match(image, /Non è una prenotazione/);

  const staffList = await json(await fetch(`${BASE}/api/staff/vouchers?q=${voucher.code}`, {
    headers: { Authorization: `Bearer ${STAFF}` },
  }));
  assert.equal(staffList.status, 200, staffList.text);
  const staffVoucher = staffList.body.vouchers.find((row) => row.code === voucher.code);
  assert.ok(staffVoucher);

  const used = await json(await post(`/api/staff/vouchers/${staffVoucher.id}/use`, {}, { Authorization: `Bearer ${STAFF}` }));
  assert.equal(used.status, 200, used.text);
  assert.equal(used.body.status, "utilizzato");

  const reused = await json(await post(`/api/staff/vouchers/${staffVoucher.id}/use`, {}, { Authorization: `Bearer ${STAFF}` }));
  assert.equal(reused.status, 409);

  t.diagnostic(`session ${sessionId} voucher ${voucher.code}`);
});

test("issues a Gift Card voucher and refunds it", async () => {
  const vars = loadDevVars();
  const { status, body } = await json(await post("/api/checkout", {
    ...checkoutItem,
    items: [{ price: 50, quantity: 1, gift: { to: "Anna", from: "Luca", message: "Per te", delivery: "now" } }],
  }));
  assert.equal(status, 200, body.error || JSON.stringify(body));
  const sessionId = new URL(body.url).pathname.split("/").find((part) => part.startsWith("cs_test_") || part.startsWith("cs_"));
  const stripe = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${vars.STRIPE_SECRET_KEY}:`).toString("base64")}` },
  });
  const session = await stripe.json();
  assert.equal(session.amount_total, 5000);
  const paymentIntent = session.payment_intent || `pi_test_${sessionId.slice(-12)}`;
  const paidEvent = {
    id: `evt_test_${crypto.randomUUID().replaceAll("-", "")}`,
    type: "checkout.session.completed",
    data: {
      object: {
        id: session.id,
        payment_status: "paid",
        payment_intent: paymentIntent,
        metadata: session.metadata,
        client_reference_id: session.client_reference_id,
      },
    },
  };
  const paidPayload = JSON.stringify(paidEvent);
  const paid = await json(await fetch(`${BASE}/api/stripe/webhook`, {
    method: "POST",
    headers: { "stripe-signature": sign(paidPayload, vars.STRIPE_WEBHOOK_SECRET) },
    body: paidPayload,
  }));
  assert.equal(paid.status, 200, paid.text);

  const order = await json(await fetch(`${BASE}/api/orders/status?session_id=${sessionId}`));
  assert.equal(order.body.status, "pagato");
  assert.equal(order.body.vouchers[0].status, "pagato");

  const refundEvent = {
    id: `evt_test_${crypto.randomUUID().replaceAll("-", "")}`,
    type: "charge.refunded",
    data: { object: { payment_intent: paymentIntent, amount_refunded: 5000, refunded: true } },
  };
  const refundPayload = JSON.stringify(refundEvent);
  const refunded = await json(await fetch(`${BASE}/api/stripe/webhook`, {
    method: "POST",
    headers: { "stripe-signature": sign(refundPayload, vars.STRIPE_WEBHOOK_SECRET) },
    body: refundPayload,
  }));
  assert.equal(refunded.status, 200, refunded.text);

  const after = await json(await fetch(`${BASE}/api/orders/status?session_id=${sessionId}`));
  assert.equal(after.body.status, "rimborsato");
  assert.equal(after.body.vouchers[0].status, "rimborsato");
});

test("reports Stripe test mode", async () => {
  const { status, body } = await json(await fetch(`${BASE}/api/payments/mode`));
  assert.equal(status, 200);
  assert.equal(body.mode, "test");
});
