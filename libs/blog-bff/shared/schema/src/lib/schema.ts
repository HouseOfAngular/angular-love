import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

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
