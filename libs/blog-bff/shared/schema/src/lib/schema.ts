import { SQL, sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  SQLiteColumn,
  sqliteTable,
  text,
  unique,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

import {
  AI_NEWS_CATEGORIES,
  AI_NEWS_SOURCE_TYPES,
  AI_NEWS_STATUSES,
} from '@angular-love/blog/contracts/ai-news';
import { AuthorTitle } from '@angular-love/blog/contracts/authors';
import {
  Anchor,
  ArticleTranslation,
  DbLang,
  SeoData,
} from '@angular-love/contracts/articles';

export const authors = sqliteTable(
  'authors',
  {
    id: integer('id').primaryKey(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    avatarUrl: text('avatar_url'),
    position: text('position'),
    github: text('github'),
    twitter: text('twitter'),
    linkedin: text('linkedin'),
    titles: text('titles', { mode: 'json' }).$type<AuthorTitle[]>().notNull(),
    descriptionEn: text('description_en'),
    descriptionPl: text('description_pl'),
    seq: integer('seq').generatedAlwaysAs(
      () => sql`
CASE
WHEN instr(titles, '"key_contributor"') > 1 THEN 1
     WHEN instr(titles, '"contributor"') > 1 THEN 2
     WHEN instr(titles, '"gde"') > 1 THEN 3
     WHEN instr(titles, '"hoa"') > 1 THEN 4
     WHEN instr(titles, '"blogger"') > 1 THEN 5
     ELSE 0 END
`,
      { mode: 'stored' },
    ),
  },
  (table) => [
    uniqueIndex('slug_idx').on(table.slug),
    index('author_titles_seq_idx').on(table.seq),
  ],
);

export const articles = sqliteTable(
  'articles',
  {
    id: integer('id').primaryKey(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    publishDate: integer('publish_date', { mode: 'timestamp' }).notNull(),
    modifyDate: integer('modify_date', { mode: 'timestamp' }).notNull(),
    readingTime: integer('reading_time').notNull(),
    imageUrl: text('image_url'),
    difficulty: text('difficulty', {
      enum: ['beginner', 'intermediate', 'advanced'],
    }).notNull(),
    status: integer('status').notNull(),
    excerpt: text('excerpt').notNull(),
    language: integer('language').notNull().$type<DbLang>(),
    authorId: integer('author_id')
      .references(() => authors.id)
      .notNull(),
    anchors: text('anchors', { mode: 'json' }).$type<Anchor[]>().notNull(),
    otherTranslations: text('other_translations', { mode: 'json' })
      .$type<ArticleTranslation[]>()
      .notNull(),
    seo: text('seo', { mode: 'json' }).$type<SeoData>(),
    faq: text('faq', { mode: 'json' }).$type<
      { question: string; answer: string }[]
    >(),
    isHidden: integer('is_hidden', { mode: 'boolean' }).notNull(),
    categories: text('categories', { mode: 'json' })
      .notNull()
      .$type<string[]>(),
    isNews: integer('is_news', { mode: 'boolean' }).generatedAlwaysAs(
      sql`(instr(categories, '"news-en"') > 0) OR (instr(categories, '"news-pl"') > 0)`,
      { mode: 'stored' },
    ),
    isGuide: integer('is_guide', { mode: 'boolean' }).generatedAlwaysAs(
      sql`(instr(categories, '"guides-en"') > 0) OR (instr(categories, '"guides-pl"') > 0)`,
      { mode: 'stored' },
    ),
    isInDepth: integer('is_in_depth', { mode: 'boolean' }).generatedAlwaysAs(
      sql`(instr(categories, '"angular-in-depth-en"') > 0) OR (instr(categories, '"angular-in-depth-pl"') > 0)`,
      { mode: 'stored' },
    ),
    isRecommended: integer('is_recommended', {
      mode: 'boolean',
    }).generatedAlwaysAs(
      sql`(instr(categories, '"recommended-en"') > 0) OR (instr(categories, '"recommended-pl"') > 0)`,
      { mode: 'stored' },
    ),
  },
  (table) => [
    uniqueIndex('article_slug_idx').on(table.slug),
    index('article_guide_covering_idx').on(
      table.status,
      table.isHidden,
      table.language,
      table.isGuide,
      table.publishDate,
    ),
    index('article_recommended_covering_idx').on(
      table.status,
      table.isHidden,
      table.language,
      table.isRecommended,
      table.publishDate,
    ),
    index('article_news_covering_idx').on(
      table.status,
      table.isHidden,
      table.language,
      table.isNews,
      table.publishDate,
    ),
    index('article_in_depth_covering_idx').on(
      table.status,
      table.isHidden,
      table.language,
      table.isInDepth,
      table.publishDate,
    ),
    index('article_covering_idx').on(
      table.status,
      table.isHidden,
      table.language,
      table.publishDate,
    ),
    index('article_author_covering_idx').on(
      table.authorId,
      table.status,
      table.isHidden,
      table.language,
      table.publishDate,
    ),
  ],
);

export const articleCounts = sqliteTable(
  'article_counts',
  {
    lang: integer('lang').notNull(),
    status: integer('status').notNull(),
    isNews: integer('is_news', { mode: 'boolean' }).notNull(),
    isGuide: integer('is_guide', { mode: 'boolean' }).notNull(),
    isInDepth: integer('is_in_depth', { mode: 'boolean' }).notNull(),
    isRecommended: integer('is_recommended', { mode: 'boolean' }).notNull(),
    isHidden: integer('is_hidden', { mode: 'boolean' }).notNull(),
    rowCount: integer('row_count').notNull(),
  },
  (table) => [
    unique().on(
      table.lang,
      table.status,
      table.isNews,
      table.isGuide,
      table.isInDepth,
      table.isRecommended,
      table.isHidden,
    ),
  ],
);

export const aiNewsItems = sqliteTable(
  'ai_news_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    // Canonicalized with canonicalizeUrl before every insert.
    url: text('url').notNull(),
    title: text('title').notNull(),
    // Length is validated at the Zod boundary only.
    summary: text('summary').notNull(),
    imageUrl: text('image_url'),
    sourceName: text('source_name').notNull(),
    sourceType: text('source_type', { enum: AI_NEWS_SOURCE_TYPES })
      .notNull()
      .default('other'),
    author: text('author'),
    category: text('category', { enum: AI_NEWS_CATEGORIES }).notNull(),
    status: text('status', { enum: AI_NEWS_STATUSES })
      .notNull()
      .default('published'),
    // The source's publish date, not ours.
    publishedAt: integer('published_at', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  // The CHECKs guard writes that skip the API's validation (raw SQL): a bad
  // enum value or a date in milliseconds would otherwise break the whole feed.
  // Adding an enum value needs a migration, which drizzle-kit generates as a
  // table rebuild.
  (table) => [
    uniqueIndex('ai_news_url_idx').on(table.url),
    index('ai_news_feed_idx').on(table.status, table.publishedAt, table.id),
    check(
      'ai_news_source_type_check',
      inList(table.sourceType, AI_NEWS_SOURCE_TYPES),
    ),
    check('ai_news_category_check', inList(table.category, AI_NEWS_CATEGORIES)),
    check('ai_news_status_check', inList(table.status, AI_NEWS_STATUSES)),
    // Unix seconds: anything from 2001 on in milliseconds is above this (year 2286).
    check(
      'ai_news_published_at_check',
      sql`${sql.identifier(table.publishedAt.name)} between 0 and 9999999999`,
    ),
  ],
);

/**
 * `column IN ('a', 'b')` with inlined literals (CHECK can't take parameters)
 * and an unqualified column, so drizzle-kit's table rebuilds keep working.
 */
function inList(column: SQLiteColumn, values: readonly string[]): SQL {
  const literals = values.map((value) => `'${value.replace(/'/g, "''")}'`);
  return sql`${sql.identifier(column.name)} in (${sql.raw(literals.join(', '))})`;
}
