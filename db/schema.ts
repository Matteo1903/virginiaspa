import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull().default(""),
  currency: text("currency").notNull().default("eur"),
  amountTotal: integer("amount_total").notNull(),
  amountRefunded: integer("amount_refunded").notNull().default(0),
  status: text("status", { enum: ["in_attesa", "pagato", "rimborsato"] }).notNull().default("in_attesa"),
  language: text("language").notNull().default("it"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  paidAt: text("paid_at"),
  refundedAt: text("refunded_at"),
}, (table) => [
  uniqueIndex("orders_checkout_session_unique").on(table.stripeCheckoutSessionId),
]);

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  title: text("title").notNull(),
  quantity: integer("quantity").notNull(),
  unitAmount: integer("unit_amount").notNull(),
  duration: text("duration").notNull().default(""),
  giftRecipient: text("gift_recipient"),
  giftSender: text("gift_sender"),
  giftMessage: text("gift_message"),
  giftDelivery: text("gift_delivery"),
});

export const vouchers = sqliteTable("vouchers", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  orderItemId: text("order_item_id").notNull().references(() => orderItems.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),
  claimToken: text("claim_token").notNull().unique(),
  title: text("title").notNull(),
  recipient: text("recipient"),
  sender: text("sender"),
  message: text("message"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("eur"),
  status: text("status", { enum: ["pagato", "utilizzato", "rimborsato", "scaduto"] }).notNull().default("pagato"),
  validUntil: text("valid_until").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  usedAt: text("used_at"),
  refundedAt: text("refunded_at"),
});

export const stripeEvents = sqliteTable("stripe_events", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  processedAt: text("processed_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const voucherAudit = sqliteTable("voucher_audit", {
  id: text("id").primaryKey(),
  voucherId: text("voucher_id").notNull().references(() => vouchers.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  actor: text("actor").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
