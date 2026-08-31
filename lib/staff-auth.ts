import { safeEqual, secrets } from "./stripe";

export const STAFF_COOKIE = "vs_staff";

const readCookie = (request: Request, name: string) => {
  const raw = request.headers.get("cookie") || "";
  const match = raw.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
};

export async function staffAuthorized(request: Request) {
  const expected = (await secrets()).SPA_STAFF_TOKEN || "";
  const header = request.headers.get("authorization") || "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  const token = bearer || readCookie(request, STAFF_COOKIE);
  if (!expected || !token) return false;
  return safeEqual(token, expected);
}

export function staffSessionCookie(request: Request, token: string) {
  const secure = new URL(request.url).protocol === "https:";
  return `${STAFF_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=43200${secure ? "; Secure" : ""}`;
}
