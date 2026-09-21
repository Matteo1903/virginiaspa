export const mysqlMigrations = [
  {
    id: "0000_init.sql",
    sql: `CREATE TABLE IF NOT EXISTS \`orders\` (
  \`id\` varchar(36) NOT NULL,
  \`stripe_checkout_session_id\` varchar(255),
  \`stripe_payment_intent_id\` varchar(255),
  \`customer_name\` varchar(120) NOT NULL,
  \`customer_email\` varchar(254) NOT NULL,
  \`customer_phone\` varchar(40) NOT NULL DEFAULT '',
  \`currency\` varchar(8) NOT NULL DEFAULT 'eur',
  \`amount_total\` int NOT NULL,
  \`amount_refunded\` int NOT NULL DEFAULT 0,
  \`status\` enum('in_attesa','pagato','rimborsato') NOT NULL DEFAULT 'in_attesa',
  \`language\` varchar(8) NOT NULL DEFAULT 'it',
  \`created_at\` varchar(40) NOT NULL,
  \`paid_at\` varchar(40),
  \`refunded_at\` varchar(40),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`orders_checkout_session_unique\` (\`stripe_checkout_session_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`order_items\` (
  \`id\` varchar(36) NOT NULL,
  \`order_id\` varchar(36) NOT NULL,
  \`product_id\` varchar(80) NOT NULL,
  \`title\` varchar(255) NOT NULL,
  \`quantity\` int NOT NULL,
  \`unit_amount\` int NOT NULL,
  \`duration\` varchar(40) NOT NULL DEFAULT '',
  \`gift_recipient\` varchar(80),
  \`gift_sender\` varchar(80),
  \`gift_message\` text,
  \`gift_delivery\` varchar(40),
  PRIMARY KEY (\`id\`),
  KEY \`order_items_order_id\` (\`order_id\`),
  CONSTRAINT \`order_items_order_id_fk\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`vouchers\` (
  \`id\` varchar(36) NOT NULL,
  \`order_id\` varchar(36) NOT NULL,
  \`order_item_id\` varchar(36) NOT NULL,
  \`code\` varchar(32) NOT NULL,
  \`claim_token\` varchar(64) NOT NULL,
  \`title\` varchar(255) NOT NULL,
  \`recipient\` varchar(80),
  \`sender\` varchar(80),
  \`message\` text,
  \`amount\` int NOT NULL,
  \`currency\` varchar(8) NOT NULL DEFAULT 'eur',
  \`status\` enum('pagato','utilizzato','rimborsato','scaduto') NOT NULL DEFAULT 'pagato',
  \`valid_until\` varchar(40) NOT NULL,
  \`created_at\` varchar(40) NOT NULL,
  \`used_at\` varchar(40),
  \`refunded_at\` varchar(40),
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`vouchers_code_unique\` (\`code\`),
  UNIQUE KEY \`vouchers_claim_token_unique\` (\`claim_token\`),
  KEY \`vouchers_order_id\` (\`order_id\`),
  KEY \`vouchers_order_item_id\` (\`order_item_id\`),
  CONSTRAINT \`vouchers_order_id_fk\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`vouchers_order_item_id_fk\` FOREIGN KEY (\`order_item_id\`) REFERENCES \`order_items\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`stripe_events\` (
  \`id\` varchar(255) NOT NULL,
  \`type\` varchar(120) NOT NULL,
  \`processed_at\` varchar(40) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`voucher_audit\` (
  \`id\` varchar(36) NOT NULL,
  \`voucher_id\` varchar(36) NOT NULL,
  \`action\` varchar(40) NOT NULL,
  \`actor\` varchar(40) NOT NULL,
  \`created_at\` varchar(40) NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`voucher_audit_voucher_id\` (\`voucher_id\`),
  CONSTRAINT \`voucher_audit_voucher_id_fk\` FOREIGN KEY (\`voucher_id\`) REFERENCES \`vouchers\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`contact_messages\` (
  \`id\` varchar(36) NOT NULL,
  \`customer_name\` varchar(120) NOT NULL,
  \`customer_email\` varchar(254) NOT NULL,
  \`customer_phone\` varchar(40) NOT NULL,
  \`message\` text NOT NULL,
  \`language\` varchar(8) NOT NULL DEFAULT 'it',
  \`status\` enum('nuovo','letto','risposto') NOT NULL DEFAULT 'nuovo',
  \`created_at\` varchar(40) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  },
  {
    id: "0001_reviews.sql",
    sql: `CREATE TABLE IF NOT EXISTS \`reviews\` (
  \`id\` varchar(36) NOT NULL,
  \`customer_name\` varchar(120) NOT NULL,
  \`customer_email\` varchar(254) NOT NULL,
  \`rating\` int NOT NULL,
  \`ritual\` varchar(120) NOT NULL DEFAULT '',
  \`message\` text NOT NULL,
  \`language\` varchar(8) NOT NULL DEFAULT 'it',
  \`status\` enum('in_revisione','pubblicata','rifiutata') NOT NULL DEFAULT 'in_revisione',
  \`created_at\` varchar(40) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  },
];
