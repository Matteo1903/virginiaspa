CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`rating` integer NOT NULL,
	`ritual` text DEFAULT '' NOT NULL,
	`message` text NOT NULL,
	`language` text DEFAULT 'it' NOT NULL,
	`status` text DEFAULT 'in_revisione' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
