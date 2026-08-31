import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { orders } from "../../../../db/schema";
import { ORDER_ACCESS_COOKIE, signOrderAccess } from "../../../../lib/order-access";

export async function POST(request: Request) {
  try {
    const payload = await request.json() as { session_id?: string };
    const sessionId = payload.session_id?.trim() || "";
    if (!sessionId.startsWith("cs_")) return Response.json({ error: "Sessione non valida." }, { status: 400 });
    const db = await getDb();
    const [order] = await db.select().from(orders).where(eq(orders.stripeCheckoutSessionId, sessionId)).limit(1);
    if (!order) return Response.json({ status: "in_attesa" }, { status: 202 });
    if (order.status !== "pagato") return Response.json({ status: order.status }, { status: 202 });
    const token = await signOrderAccess(sessionId);
    const headers = new Headers({ "Content-Type": "application/json" });
    const secure = new URL(request.url).protocol === "https:";
    headers.append(
      "Set-Cookie",
      `${ORDER_ACCESS_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${secure ? "; Secure" : ""}`,
    );
    return new Response(JSON.stringify({ status: "pagato" }), { status: 200, headers });
  } catch {
    return Response.json({ error: "Accesso ordine non disponibile." }, { status: 500 });
  }
}
