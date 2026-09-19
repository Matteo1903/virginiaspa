import { NextRequest, NextResponse } from "next/server";
import { env } from "../../../lib/env";
import { cleanupPendingOrders } from "../../../lib/pending-orders";
import { safeEqual } from "../../../lib/stripe";

function authorized(request: NextRequest) {
  const expected = env().CRON_SECRET || "";
  if (!expected) return false;
  const header = request.headers.get("authorization") || "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  const fromHeader = request.headers.get("x-cron-secret") || "";
  const fromQuery = request.nextUrl.searchParams.get("secret") || "";
  return [bearer, fromHeader, fromQuery].some((candidate) => candidate && safeEqual(candidate, expected));
}

async function run(request: NextRequest) {
  if (!env().CRON_SECRET) {
    return NextResponse.json({ error: "CRON_SECRET non configurato" }, { status: 503 });
  }
  if (!authorized(request)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }
  const result = await cleanupPendingOrders();
  return NextResponse.json({ ok: true, ...result });
}

export async function GET(request: NextRequest) {
  return run(request);
}

export async function POST(request: NextRequest) {
  return run(request);
}
