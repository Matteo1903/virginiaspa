import { int, mysqlEnum, mysqlTable, text, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

const isoNow = () => new Date().toISOString();

export const orders = mysqlTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey(),
  stripeCheckoutSessionId: varchar("stripe_checkout_session_id", { length: 255 }),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  customerEmail: varchar("customer_email", { length: 254 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 40 }).notNull().default(""),
  currency: varchar("currency", { length: 8 }).notNull().default("eur"),
  amountTotal: int("amount_total").notNull(),
  amountRefunded: int("amount_refunded").notNull().default(0),
  status: mysqlEnum("status", ["in_attesa", "pagato", "rimborsato"]).notNull().default("in_attesa"),
  language: varchar("language", { length: 8 }).notNull().default("it"),
  createdAt: varchar("created_at", { length: 40 }).notNull().$defaultFn(isoNow),
  paidAt: varchar("paid_at", { length: 40 }),
  refundedAt: varchar("refunded_at", { length: 40 }),
}, (table) => [
  uniqueIndex("orders_checkout_session_unique").on(table.stripeCheckoutSessionId),
]);

export const orderItems = mysqlTable("order_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  orderId: varchar("order_id", { length: 36 }).notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: varchar("product_id", { length: 80 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  unitAmount: int("unit_amount").notNull(),
  duration: varchar("duration", { length: 40 }).notNull().default(""),
  giftRecipient: varchar("gift_recipient", { length: 80 }),
  giftSender: varchar("gift_sender", { length: 80 }),
  giftMessage: text("gift_message"),
  giftDelivery: varchar("gift_delivery", { length: 40 }),
});

export const vouchers = mysqlTable("vouchers", {
  id: varchar("id", { length: 36 }).primaryKey(),
  orderId: varchar("order_id", { length: 36 }).notNull().references(() => orders.id, { onDelete: "cascade" }),
  orderItemId: varchar("order_item_id", { length: 36 }).notNull().references(() => orderItems.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 32 }).notNull().unique(),
  claimToken: varchar("claim_token", { length: 64 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  recipient: varchar("recipient", { length: 80 }),
  sender: varchar("sender", { length: 80 }),
  message: text("message"),
  amount: int("amount").notNull(),
  currency: varchar("currency", { length: 8 }).notNull().default("eur"),
  status: mysqlEnum("status", ["pagato", "utilizzato", "rimborsato", "scaduto"]).notNull().default("pagato"),
  validUntil: varchar("valid_until", { length: 40 }).notNull(),
  createdAt: varchar("created_at", { length: 40 }).notNull().$defaultFn(isoNow),
  usedAt: varchar("used_at", { length: 40 }),
  refundedAt: varchar("refunded_at", { length: 40 }),
});

export const stripeEvents = mysqlTable("stripe_events", {
  id: varchar("id", { length: 255 }).primaryKey(),
  type: varchar("type", { length: 120 }).notNull(),
  processedAt: varchar("processed_at", { length: 40 }).notNull().$defaultFn(isoNow),
});

export const voucherAudit = mysqlTable("voucher_audit", {
  id: varchar("id", { length: 36 }).primaryKey(),
  voucherId: varchar("voucher_id", { length: 36 }).notNull().references(() => vouchers.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 40 }).notNull(),
  actor: varchar("actor", { length: 40 }).notNull(),
  createdAt: varchar("created_at", { length: 40 }).notNull().$defaultFn(isoNow),
});

export const contactMessages = mysqlTable("contact_messages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  customerEmail: varchar("customer_email", { length: 254 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 40 }).notNull(),
  message: text("message").notNull(),
  language: varchar("language", { length: 8 }).notNull().default("it"),
  status: mysqlEnum("status", ["nuovo", "letto", "risposto"]).notNull().default("nuovo"),
  createdAt: varchar("created_at", { length: 40 }).notNull().$defaultFn(isoNow),
});
