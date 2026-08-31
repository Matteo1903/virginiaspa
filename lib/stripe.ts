type Secrets = {
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  SPA_STAFF_TOKEN?: string;
  PUBLIC_SITE_URL?: string;
  ORDER_ACCESS_SECRET?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
};

export const secrets = async () => {
  const { env } = await import("cloudflare:workers");
  return env as unknown as Secrets;
};

export type StripeMode = "test" | "live" | "unset";
export function stripeModeFromKey(key?: string): StripeMode {
  if (!key) return "unset";
  if (key.startsWith("sk_test_") || key.startsWith("rk_test_") || key.startsWith("rkcs_test_")) return "test";
  if (key.startsWith("sk_live_") || key.startsWith("rk_live_") || key.startsWith("rkcs_live_")) return "live";
  return "unset";
}
export async function stripeMode() {
  return stripeModeFromKey((await secrets()).STRIPE_SECRET_KEY);
}

export async function stripeRequest(path: string, body: URLSearchParams, options?: { idempotencyKey?: string }) {
  const key = (await secrets()).STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY non configurata");
  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${key}:`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(options?.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : {}),
    },
    body,
  });
  const data = await response.json() as { error?: { message?: string }; [key: string]: unknown };
  if (!response.ok) throw new Error(data.error?.message || "Errore Stripe");
  return data;
}

const toHex = (bytes: ArrayBuffer) => [...new Uint8Array(bytes)].map((value) => value.toString(16).padStart(2, "0")).join("");

export const safeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
};

export async function verifyStripeSignature(payload: string, signature: string, secret: string) {
  const parts = signature.split(",").map((part) => part.split("="));
  const timestamp = parts.find(([key]) => key === "t")?.[1];
  const signatures = parts.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const expected = toHex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`)));
  return signatures.some((candidate) => safeEqual(candidate, expected));
}
