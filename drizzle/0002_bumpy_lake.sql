CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`customer_phone` text NOT NULL,
	`message` text NOT NULL,
	`language` text DEFAULT 'it' NOT NULL,
	`status` text DEFAULT 'nuovo' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
