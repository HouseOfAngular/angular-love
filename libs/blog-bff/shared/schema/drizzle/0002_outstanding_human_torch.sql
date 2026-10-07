DROP INDEX "article_counts_lang_status_is_news_is_guide_is_in_depth_is_recommended_is_hidden_unique";--> statement-breakpoint
DROP INDEX "article_slug_idx";--> statement-breakpoint
DROP INDEX "article_guide_covering_idx";--> statement-breakpoint
DROP INDEX "article_recommended_covering_idx";--> statement-breakpoint
DROP INDEX "article_news_covering_idx";--> statement-breakpoint
DROP INDEX "article_in_depth_covering_idx";--> statement-breakpoint
DROP INDEX "article_covering_idx";--> statement-breakpoint
DROP INDEX "article_author_covering_idx";--> statement-breakpoint
DROP INDEX "slug_idx";--> statement-breakpoint
DROP INDEX "author_titles_seq_idx";--> statement-breakpoint
ALTER TABLE `authors` ALTER COLUMN "name" TO "name" text DEFAULT 'Test123';--> statement-breakpoint
CREATE UNIQUE INDEX `article_counts_lang_status_is_news_is_guide_is_in_depth_is_recommended_is_hidden_unique` ON `article_counts` (`lang`,`status`,`is_news`,`is_guide`,`is_in_depth`,`is_recommended`,`is_hidden`);--> statement-breakpoint
CREATE UNIQUE INDEX `article_slug_idx` ON `articles` (`slug`);--> statement-breakpoint
CREATE INDEX `article_guide_covering_idx` ON `articles` (`status`,`is_hidden`,`language`,`is_guide`,`publish_date`);--> statement-breakpoint
CREATE INDEX `article_recommended_covering_idx` ON `articles` (`status`,`is_hidden`,`language`,`is_recommended`,`publish_date`);--> statement-breakpoint
CREATE INDEX `article_news_covering_idx` ON `articles` (`status`,`is_hidden`,`language`,`is_news`,`publish_date`);--> statement-breakpoint
CREATE INDEX `article_in_depth_covering_idx` ON `articles` (`status`,`is_hidden`,`language`,`is_in_depth`,`publish_date`);--> statement-breakpoint
CREATE INDEX `article_covering_idx` ON `articles` (`status`,`is_hidden`,`language`,`publish_date`);--> statement-breakpoint
CREATE INDEX `article_author_covering_idx` ON `articles` (`author_id`,`status`,`is_hidden`,`language`,`publish_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `slug_idx` ON `authors` (`slug`);--> statement-breakpoint
CREATE INDEX `author_titles_seq_idx` ON `authors` (`seq`);