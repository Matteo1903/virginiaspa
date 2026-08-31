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
  acceptedTerms: true,
};

const grantAccess = async (sessionId) => {
  const response = await fetch(`${BASE}/api/orders/access`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  const parsed = await json(response);
  const setCookie = response.headers.getSetCookie?.() || [];
  const cookie = setCookie[0] || response.headers.get("set-cookie") || "";
  return { ...parsed, cookie };
};

const orderStatus = async (sessionId, cookie) => {
  const headers = {};
  if (cookie) headers.cookie = cookie.split(";")[0];
  return json(await fetch(`${BASE}/api/orders/status?session_id=${sessionId}`, { headers }));
};

const postWebhook = async (secret, event) => {
  const payload = JSON.stringify(event);
  return {
    payload,
    result: await json(await fetch(`${BASE}/api/stripe/webhook`, {
      method: "POST",
      headers: { "stripe-signature": sign(payload, secret) },
      body: payload,
    })),
  };
};

const paidObject = (session) => ({
  id: session.id,
  payment_status: "paid",
  payment_intent: session.payment_intent || `pi_test_${session.id.slice(-12)}`,
  metadata: session.metadata,
  client_reference_id: session.client_reference_id,
});

test("rejects incomplete checkout", async () => {
  const { status, body } = await json(await post("/api/checkout", {}));
  assert.equal(status, 400);
  assert.match(body.error, /incompleti/i);
});

test("rejects checkout without privacy acceptance", async () => {
  const { status, body } = await json(await post("/api/checkout", {
    ...checkoutItem,
    acceptedTerms: false,
    items: [{ id: "cielo-terra", quantity: 1 }],
  }));
  assert.equal(status, 400);
  assert.match(body.error, /privacy|termini/i);
});

test("rejects unknown treatments", async () => {
  const { status, body } = await json(await post("/api/checkout", { ...checkoutItem, items: [{ id: "non-esiste", quantity: 1 }] }));
  assert.equal(status, 400);
  assert.match(body.error, /non validi/i);
});

test("rejects invalid gift amounts", async () => {
  const amount = await json(await post("/api/checkout", { ...checkoutItem, items: [{ price: 12, gift: { to: "Anna", from: "Luca", message: "ciao", delivery: "now" } }] }));
  assert.equal(amount.status, 400);
  assert.match(amount.body.error, /non validi/i);
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

  const paidEvent = {
    id: `evt_test_${crypto.randomUUID().replaceAll("-", "")}`,
    type: "checkout.session.completed",
    data: { object: paidObject(session) },
  };
  const paid = await postWebhook(vars.STRIPE_WEBHOOK_SECRET, paidEvent);
  assert.equal(paid.result.status, 200, paid.result.text);
  assert.equal(paid.result.body.received, true);

  const duplicate = await postWebhook(vars.STRIPE_WEBHOOK_SECRET, paidEvent);
  assert.equal(duplicate.result.status, 200, duplicate.result.text);
  assert.equal(duplicate.result.body.duplicate, true);

  const locked = await orderStatus(sessionId);
  assert.equal(locked.status, 200, locked.text);
  assert.equal(locked.body.status, "pagato");
  assert.equal(locked.body.locked, true);
  assert.equal(locked.body.vouchers.length, 0);

  const access = await grantAccess(sessionId);
  assert.equal(access.status, 200, access.text);
  const order = await orderStatus(sessionId, access.cookie);
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

  const refunded = await postWebhook(vars.STRIPE_WEBHOOK_SECRET, {
    id: `evt_test_${crypto.randomUUID().replaceAll("-", "")}`,
    type: "charge.refunded",
    data: { object: { payment_intent: paidObject(session).payment_intent, amount_refunded: 11000, refunded: true } },
  });
  assert.equal(refunded.result.status, 200, refunded.result.text);
  const afterRefund = await orderStatus(sessionId, access.cookie);
  assert.equal(afterRefund.body.status, "rimborsato");
  assert.equal(afterRefund.body.vouchers[0].status, "utilizzato");

  t.diagnostic(`session ${sessionId} voucher ${voucher.code}`);
});

test("issues a Gift Card voucher and refunds unused ones", async () => {
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
  const paid = await postWebhook(vars.STRIPE_WEBHOOK_SECRET, {
    id: `evt_test_${crypto.randomUUID().replaceAll("-", "")}`,
    type: "checkout.session.completed",
    data: { object: paidObject(session) },
  });
  assert.equal(paid.result.status, 200, paid.result.text);

  const access = await grantAccess(sessionId);
  const order = await orderStatus(sessionId, access.cookie);
  assert.equal(order.body.status, "pagato");
  assert.equal(order.body.vouchers[0].status, "pagato");

  const refunded = await postWebhook(vars.STRIPE_WEBHOOK_SECRET, {
    id: `evt_test_${crypto.randomUUID().replaceAll("-", "")}`,
    type: "charge.refunded",
    data: { object: { payment_intent: paidObject(session).payment_intent, amount_refunded: 5000, refunded: true } },
  });
  assert.equal(refunded.result.status, 200, refunded.result.text);

  const after = await orderStatus(sessionId, access.cookie);
  assert.equal(after.body.status, "rimborsato");
  assert.equal(after.body.vouchers[0].status, "rimborsato");
});

test("issues the missing vouchers only when quantity is greater than one", async () => {
  const vars = loadDevVars();
  const { status, body } = await json(await post("/api/checkout", {
    ...checkoutItem,
    items: [{ id: "cielo-terra", quantity: 2 }],
  }));
  assert.equal(status, 200, body.error || JSON.stringify(body));
  const sessionId = new URL(body.url).pathname.split("/").find((part) => part.startsWith("cs_test_") || part.startsWith("cs_"));
  const stripe = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${vars.STRIPE_SECRET_KEY}:`).toString("base64")}` },
  });
  const session = await stripe.json();
  assert.equal(session.amount_total, 22000);

  const first = await postWebhook(vars.STRIPE_WEBHOOK_SECRET, {
    id: `evt_test_${crypto.randomUUID().replaceAll("-", "")}`,
    type: "checkout.session.completed",
    data: { object: paidObject(session) },
  });
  assert.equal(first.result.status, 200, first.result.text);
  const access = await grantAccess(sessionId);
  const afterFirst = await orderStatus(sessionId, access.cookie);
  assert.equal(afterFirst.body.vouchers.length, 2);

  const second = await postWebhook(vars.STRIPE_WEBHOOK_SECRET, {
    id: `evt_test_${crypto.randomUUID().replaceAll("-", "")}`,
    type: "checkout.session.completed",
    data: { object: paidObject(session) },
  });
  assert.equal(second.result.status, 200, second.result.text);
  const afterSecond = await orderStatus(sessionId, access.cookie);
  assert.equal(afterSecond.body.vouchers.length, 2);
  assert.equal(new Set(afterSecond.body.vouchers.map((row) => row.code)).size, 2);
});

test("reports Stripe test mode", async () => {
  const { status, body } = await json(await fetch(`${BASE}/api/payments/mode`));
  assert.equal(status, 200);
  assert.equal(body.mode, "test");
});
