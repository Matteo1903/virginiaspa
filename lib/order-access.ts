import { safeEqual, secrets } from "./stripe";

const encoder = new TextEncoder();
const toHex = (bytes: ArrayBuffer) => [...new Uint8Array(bytes)].map((value) => value.toString(16).padStart(2, "0")).join("");

const accessSecret = async () => {
  const env = await secrets();
  return env.ORDER_ACCESS_SECRET || env.STRIPE_WEBHOOK_SECRET || "";
};

export async function signOrderAccess(sessionId: string) {
  const secret = await accessSecret();
  if (!secret) throw new Error("ORDER_ACCESS_SECRET non configurato");
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(`order-access:${sessionId}`)));
  return `${sessionId}.${signature}`;
}

export async function verifyOrderAccess(sessionId: string, token: string | null | undefined) {
  if (!token || !sessionId.startsWith("cs_")) return false;
  try {
    const expected = await signOrderAccess(sessionId);
    return safeEqual(expected, token);
  } catch {
    return false;
  }
}

export const ORDER_ACCESS_COOKIE = "vs_order_access";
