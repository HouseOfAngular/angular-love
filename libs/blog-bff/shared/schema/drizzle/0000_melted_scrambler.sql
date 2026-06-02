CREATE TABLE `article_counts` (
	`lang` integer NOT NULL,
	`status` integer NOT NULL,
	`is_news` integer NOT NULL,
	`is_guide` integer NOT NULL,
	`is_in_depth` integer NOT NULL,
	`is_recommended` integer NOT NULL,
	`is_hidden` integer NOT NULL,
	`row_count` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `article_counts_lang_status_is_news_is_guide_is_in_depth_is_recommended_is_hidden_unique` ON `article_counts` (`lang`,`status`,`is_news`,`is_guide`,`is_in_depth`,`is_recommended`,`is_hidden`);--> statement-breakpoint
CREATE TABLE `articles` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`publish_date` integer NOT NULL,
	`modify_date` integer NOT NULL,
	`reading_time` integer NOT NULL,
	`image_url` text,
	`difficulty` text NOT NULL,
	`status` integer NOT NULL,
	`excerpt` text NOT NULL,
	`language` integer NOT NULL,
	`author_id` integer NOT NULL,
	`anchors` text NOT NULL,
	`other_translations` text NOT NULL,
	`seo` text,
	`is_hidden` integer NOT NULL,
	`categories` text NOT NULL,
	`is_news` integer GENERATED ALWAYS AS ((instr(categories, '"news-en"') > 0) OR (instr(categories, '"news-pl"') > 0)) STORED,
	`is_guide` integer GENERATED ALWAYS AS ((instr(categories, '"guides-en"') > 0) OR (instr(categories, '"guides-pl"') > 0)) STORED,
	`is_in_depth` integer GENERATED ALWAYS AS ((instr(categories, '"angular-in-depth-en"') > 0) OR (instr(categories, '"angular-in-depth-pl"') > 0)) STORED,
	`is_recommended` integer GENERATED ALWAYS AS ((instr(categories, '"recommended-en"') > 0) OR (instr(categories, '"recommended-pl"') > 0)) STORED,
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `article_slug_idx` ON `articles` (`slug`);--> statement-breakpoint
CREATE INDEX `article_guide_covering_idx` ON `articles` (`status`,`is_hidden`,`language`,`is_guide`,`publish_date`);--> statement-breakpoint
CREATE INDEX `article_recommended_covering_idx` ON `articles` (`status`,`is_hidden`,`language`,`is_recommended`,`publish_date`);--> statement-breakpoint
CREATE INDEX `article_news_covering_idx` ON `articles` (`status`,`is_hidden`,`language`,`is_news`,`publish_date`);--> statement-breakpoint
CREATE INDEX `article_in_depth_covering_idx` ON `articles` (`status`,`is_hidden`,`language`,`is_in_depth`,`publish_date`);--> statement-breakpoint
CREATE INDEX `article_covering_idx` ON `articles` (`status`,`is_hidden`,`language`,`publish_date`);--> statement-breakpoint
CREATE INDEX `article_author_covering_idx` ON `articles` (`author_id`,`status`,`is_hidden`,`language`,`publish_date`);--> statement-breakpoint
CREATE TABLE `authors` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`avatar_url` text,
	`position` text,
	`github` text,
	`twitter` text,
	`linkedin` text,
	`titles` text NOT NULL,
	`description_en` text,
	`description_pl` text,
	`seq` integer GENERATED ALWAYS AS (
CASE
WHEN instr(titles, '"key_contributor"') > 1 THEN 1
     WHEN instr(titles, '"contributor"') > 1 THEN 2
     WHEN instr(titles, '"gde"') > 1 THEN 3
     WHEN instr(titles, '"hoa"') > 1 THEN 4
     WHEN instr(titles, '"blogger"') > 1 THEN 5
     ELSE 0 END
) STORED
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slug_idx` ON `authors` (`slug`);--> statement-breakpoint
CREATE INDEX `author_titles_seq_idx` ON `authors` (`seq`);