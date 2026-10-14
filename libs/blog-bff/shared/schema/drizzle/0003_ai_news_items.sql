CREATE TABLE `ai_news_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`image_url` text,
	`source_name` text NOT NULL,
	`source_type` text DEFAULT 'other' NOT NULL,
	`author` text,
	`category` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`published_at` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	CONSTRAINT "ai_news_source_type_check" CHECK("source_type" in ('blog', 'social', 'video', 'repo', 'paper', 'podcast', 'newsletter', 'other')),
	CONSTRAINT "ai_news_category_check" CHECK("category" in ('models', 'tools', 'research', 'industry')),
	CONSTRAINT "ai_news_status_check" CHECK("status" in ('draft', 'published')),
	CONSTRAINT "ai_news_published_at_check" CHECK("published_at" between 0 and 9999999999)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_news_url_idx` ON `ai_news_items` (`url`);--> statement-breakpoint
CREATE INDEX `ai_news_feed_idx` ON `ai_news_items` (`status`,`published_at`,`id`);