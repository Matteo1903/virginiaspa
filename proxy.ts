import { NextRequest, NextResponse } from "next/server";
import { applySecurityHeaders, rateLimitResponse } from "./lib/security";

export function proxy(request: NextRequest) {
  const limited = rateLimitResponse(request);
  if (limited) return applySecurityHeaders(limited, request.nextUrl.pathname);
  return applySecurityHeaders(NextResponse.next(), request.nextUrl.pathname);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|webp|png|jpg|jpeg|gif|ico)$).*)"],
};
