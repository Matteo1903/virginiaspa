CREATE TABLE IF NOT EXISTS `reviews` (
  `id` varchar(36) NOT NULL,
  `customer_name` varchar(120) NOT NULL,
  `customer_email` varchar(254) NOT NULL,
  `rating` int NOT NULL,
  `ritual` varchar(120) NOT NULL DEFAULT '',
  `message` text NOT NULL,
  `language` varchar(8) NOT NULL DEFAULT 'it',
  `status` enum('in_revisione','pubblicata','rifiutata') NOT NULL DEFAULT 'in_revisione',
  `created_at` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
