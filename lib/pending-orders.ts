/** Removes abandoned checkout rows older than seven days. Invoked by the Worker cron. */
export async function cleanupPendingOrders(db: D1Database) {
  await db.prepare(`
    DELETE FROM order_items
    WHERE order_id IN (
      SELECT id FROM orders
      WHERE status = 'in_attesa' AND datetime(created_at) < datetime('now', '-7 days')
    )
  `).run();
  return db.prepare(`
    DELETE FROM orders
    WHERE status = 'in_attesa' AND datetime(created_at) < datetime('now', '-7 days')
  `).run();
}
