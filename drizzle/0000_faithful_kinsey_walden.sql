CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`title` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_amount` integer NOT NULL,
	`duration` text DEFAULT '' NOT NULL,
	`gift_recipient` text,
	`gift_sender` text,
	`gift_message` text,
	`gift_delivery` text,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`stripe_checkout_session_id` text,
	`stripe_payment_intent_id` text,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`customer_phone` text DEFAULT '' NOT NULL,
	`currency` text DEFAULT 'eur' NOT NULL,
	`amount_total` integer NOT NULL,
	`status` text DEFAULT 'in_attesa' NOT NULL,
	`language` text DEFAULT 'it' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`paid_at` text,
	`refunded_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_checkout_session_unique` ON `orders` (`stripe_checkout_session_id`);--> statement-breakpoint
CREATE TABLE `stripe_events` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`processed_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `voucher_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`voucher_id` text NOT NULL,
	`action` text NOT NULL,
	`actor` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`voucher_id`) REFERENCES `vouchers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `vouchers` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`order_item_id` text NOT NULL,
	`code` text NOT NULL,
	`claim_token` text NOT NULL,
	`title` text NOT NULL,
	`recipient` text,
	`sender` text,
	`message` text,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'eur' NOT NULL,
	`status` text DEFAULT 'pagato' NOT NULL,
	`valid_until` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`used_at` text,
	`refunded_at` text,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`order_item_id`) REFERENCES `order_items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vouchers_code_unique` ON `vouchers` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `vouchers_claim_token_unique` ON `vouchers` (`claim_token`);