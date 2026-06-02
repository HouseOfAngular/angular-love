import { and, desc, eq } from 'drizzle-orm';
import { createError, defineEventHandler, setHeader } from 'h3';

import { articles, authors } from '@angular-love/blog-bff/shared/schema';
import { ArticleStatus, DbLang } from '@angular-love/contracts/articles';

import { CACHE_KEYS } from '../utils/cache-keys';
import { createDatabase } from '../utils/database';
import { getRequiredEnv } from '../utils/env';
import { buildRssFeed, type FeedArticle } from '../utils/rss';

const CACHE_TTL = 3600;
const BASE_URL = 'https://angular.love';

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8');
  setHeader(
    event,
    'Cache-Control',
    `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}`,
  );

  const CACHE_KV = getRequiredEnv(event, 'CACHE_KV');

  let cached: string | null = null;
  try {
    cached = await CACHE_KV.get(CACHE_KEYS.feedEn);
  } catch (err) {
    console.error(
      '[feed.xml] KV cache read failed — continuing without cache:',
      err,
    );
  }

  if (cached) {
    return cached;
  }

  const db = createDatabase(event);
  let articleRows: FeedArticle[];

  try {
    articleRows = await db
      .select({
        slug: articles.slug,
        title: articles.title,
        excerpt: articles.excerpt,
        publishDate: articles.publishDate,
        imageUrl: articles.imageUrl,
        authorName: authors.name,
      })
      .from(articles)
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .where(
        and(
          eq(articles.status, ArticleStatus.Publish),
          eq(articles.language, DbLang.English),
          eq(articles.isHidden, false),
        ),
      )
      .orderBy(desc(articles.publishDate))
      .limit(20);
  } catch (err) {
    console.error('[feed.xml] Database query failed:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch feed data from database',
    });
  }

  let xml: string;
  try {
    xml = buildRssFeed(articleRows, {
      channelLink: BASE_URL,
      feedUrl: `${BASE_URL}/feed.xml`,
      alternateFeedUrl: `${BASE_URL}/feed-pl.xml`,
      alternateFeedLang: 'pl',
      description: 'Angular community blog — tutorials, articles, and guides',
      language: 'en',
      articleUrlPrefix: BASE_URL,
    });
  } catch (err) {
    console.error('[feed.xml] XML generation failed:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate RSS feed XML',
    });
  }

  try {
    event.waitUntil(
      CACHE_KV.put(CACHE_KEYS.feedEn, xml, { expirationTtl: CACHE_TTL }),
    );
  } catch (err) {
    console.error(
      '[feed.xml] KV cache write failed — feed was served but not cached:',
      err,
    );
  }

  return xml;
});
