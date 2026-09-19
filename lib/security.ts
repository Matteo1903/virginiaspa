import { NextResponse } from "next/server";
import { contentSecurityPolicy, securityHeaderEntries } from "./security-headers";

const WINDOW_MS = 60_000;
const LIMITS: { prefix: string; max: number }[] = [
  { prefix: "/api/checkout", max: 12 },
  { prefix: "/api/contact", max: 8 },
  { prefix: "/api/staff", max: 40 },
  { prefix: "/api/orders/access", max: 20 },
  { prefix: "/api/orders/status", max: 30 },
  { prefix: "/api/vouchers", max: 40 },
  { prefix: "/api/cron", max: 12 },
];

const buckets = new Map<string, { count: number; resetAt: number }>();

const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  || request.headers.get("x-real-ip")
  || request.headers.get("cf-connecting-ip")
  || "local";

export function rateLimitResponse(request: Request): NextResponse | null {
  const path = new URL(request.url).pathname;
  const rule = LIMITS.find((entry) => path === entry.prefix || path.startsWith(`${entry.prefix}/`));
  if (!rule) return null;
  const now = Date.now();
  if (buckets.size > 8_000) {
    for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
  }
  const key = `${clientIp(request)}:${rule.prefix}`;
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }
  current.count += 1;
  if (current.count <= rule.max) return null;
  return NextResponse.json({ error: "Troppe richieste. Riprova tra un minuto." }, {
    status: 429,
    headers: { "Retry-After": "60" },
  });
}

export function applySecurityHeaders<T extends { headers: Headers }>(response: T, pathname: string): T {
  const headers = response.headers;
  for (const { key, value } of securityHeaderEntries) headers.set(key, value);
  headers.set("Content-Security-Policy", contentSecurityPolicy);
  if (pathname.startsWith("/staff") || pathname.startsWith("/api/staff")) {
    headers.set("Cache-Control", "no-store");
  }
  return response;
}
