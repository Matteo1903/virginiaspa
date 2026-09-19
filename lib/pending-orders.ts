import { and, eq, lt } from "drizzle-orm";
import { getDb } from "../db";
import { orderItems, orders } from "../db/schema";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/** Removes abandoned checkout rows older than seven days. Invoked by /api/cron. */
export async function cleanupPendingOrders() {
  const db = await getDb();
  const cutoff = new Date(Date.now() - SEVEN_DAYS_MS).toISOString();
  const stale = await db.select({ id: orders.id }).from(orders).where(
    and(eq(orders.status, "in_attesa"), lt(orders.createdAt, cutoff)),
  );
  if (!stale.length) return { deleted: 0 };
  for (const row of stale) {
    await db.delete(orderItems).where(eq(orderItems.orderId, row.id));
    await db.delete(orders).where(eq(orders.id, row.id));
  }
  return { deleted: stale.length };
}
