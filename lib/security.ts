const WINDOW_MS = 60_000;
const LIMITS: { prefix: string; max: number }[] = [
  { prefix: "/api/checkout", max: 12 },
  { prefix: "/api/contact", max: 8 },
  { prefix: "/api/staff", max: 40 },
  { prefix: "/api/orders/access", max: 20 },
  { prefix: "/api/orders/status", max: 30 },
  { prefix: "/api/vouchers", max: 40 },
];

const buckets = new Map<string, { count: number; resetAt: number }>();

const clientIp = (request: Request) =>
  request.headers.get("cf-connecting-ip")
  || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  || "local";

export function rateLimitResponse(request: Request): Response | null {
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
  return Response.json({ error: "Troppe richieste. Riprova tra un minuto." }, {
    status: 429,
    headers: { "Retry-After": "60" },
  });
}

export function withSecurityHeaders(response: Response, pathname: string) {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com",
        ].join("; "),
      );
      headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
      if (pathname.startsWith("/staff") || pathname.startsWith("/api/staff")) {
        headers.set("Cache-Control", "no-store");
      }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
