-- Custom SQL migration file, put your code below! --
DROP TRIGGER IF EXISTS insert_article_count;--> statement-breakpoint
CREATE TRIGGER insert_article_count
AFTER INSERT ON articles
FOR EACH ROW
BEGIN
    INSERT INTO article_counts (lang, status, is_hidden, is_news, is_guide, is_in_depth, is_recommended, row_count)
    VALUES (NEW.language, NEW.status, NEW.is_hidden, NEW.is_news, NEW.is_guide, NEW.is_in_depth, NEW.is_recommended, 1)
    ON CONFLICT(lang, status, is_hidden, is_news, is_guide, is_in_depth, is_recommended)
    DO UPDATE SET row_count = row_count + 1;
END;--> statement-breakpoint

DROP TRIGGER IF EXISTS update_article_count;--> statement-breakpoint
CREATE TRIGGER update_article_count
AFTER UPDATE ON articles
FOR EACH ROW
WHEN NEW.language != OLD.language
   OR NEW.status != OLD.status
   OR NEW.is_hidden != OLD.is_hidden
   OR NEW.is_news != OLD.is_news
   OR NEW.is_guide != OLD.is_guide
   OR NEW.is_in_depth != OLD.is_in_depth
   OR NEW.is_recommended != OLD.is_recommended
BEGIN
    -- Decrement the count for the old grouping
    UPDATE article_counts
    SET row_count = row_count - 1
    WHERE lang = OLD.language
      AND status = OLD.status
      AND is_hidden = OLD.is_hidden
      AND is_news = OLD.is_news
      AND is_guide = OLD.is_guide
      AND is_in_depth = OLD.is_in_depth
      AND is_recommended = OLD.is_recommended;

    -- Remove the group if its count reaches zero
    DELETE FROM article_counts
    WHERE lang = OLD.language
      AND status = OLD.status
      AND is_hidden = OLD.is_hidden
      AND is_news = OLD.is_news
      AND is_guide = OLD.is_guide
      AND is_in_depth = OLD.is_in_depth
      AND is_recommended = OLD.is_recommended
      AND row_count = 0;

    -- Increment the count for the new grouping (or create it)
    INSERT INTO article_counts (lang, status, is_hidden, is_news, is_guide, is_in_depth, is_recommended, row_count)
    VALUES (NEW.language, NEW.status, NEW.is_hidden, NEW.is_news, NEW.is_guide, NEW.is_in_depth, NEW.is_recommended, 1)
    ON CONFLICT(lang, status, is_hidden, is_news, is_guide, is_in_depth, is_recommended)
    DO UPDATE SET row_count = row_count + 1;
END;--> statement-breakpoint
DROP TRIGGER IF EXISTS delete_article_count;--> statement-breakpoint
CREATE TRIGGER delete_article_count
AFTER DELETE ON articles
FOR EACH ROW
BEGIN
    UPDATE article_counts
    SET row_count = row_count - 1
    WHERE lang = OLD.language
      AND status = OLD.status
      AND is_hidden = OLD.is_hidden
      AND is_news = OLD.is_news
      AND is_guide = OLD.is_guide
      AND is_in_depth = OLD.is_in_depth
      AND is_recommended = OLD.is_recommended;

    DELETE FROM article_counts
    WHERE lang = OLD.language
      AND status = OLD.status
      AND is_hidden = OLD.is_hidden
      AND is_news = OLD.is_news
      AND is_guide = OLD.is_guide
      AND is_in_depth = OLD.is_in_depth
      AND is_recommended = OLD.is_recommended
      AND row_count = 0;
END;
