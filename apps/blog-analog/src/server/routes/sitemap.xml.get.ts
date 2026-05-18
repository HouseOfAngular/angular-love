import { and, eq } from 'drizzle-orm';
import { createError, defineEventHandler, setHeader } from 'h3';
import { create } from 'xmlbuilder2';

import { articles, authors } from '@angular-love/blog-bff/shared/schema';
import { ArticleStatus, DbLang } from '@angular-love/contracts/articles';

import { createDatabase } from '../utils/database';
import { getRequiredEnv } from '../utils/env';

const CACHE_KEY = 'sitemap:xml';
const CACHE_TTL = 3600;
const BASE_URL = 'https://angular.love';

const STATIC_PATHS = [
  '',
  'about-us',
  'become-author',
  'search',
  'latest',
  'news',
  'guides',
];

type SitemapEntry = {
  loc: string;
  lastmod: string;
  priority: string;
  changefreq: string;
};

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  setHeader(
    event,
    'Cache-Control',
    `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}`,
  );

  const CACHE_KV = getRequiredEnv(event, 'CACHE_KV');

  let cached: string | null = null;
  try {
    cached = await CACHE_KV.get(CACHE_KEY);
  } catch (err) {
    console.error(
      '[sitemap] KV cache read failed — continuing without cache:',
      err,
    );
  }

  if (cached) {
    return cached;
  }

  const db = createDatabase(event);

  let articleRows: { slug: string; publishDate: Date; language: DbLang }[];
  let authorRows: { slug: string }[];

  try {
    [articleRows, authorRows] = await Promise.all([
      db
        .select({
          slug: articles.slug,
          publishDate: articles.publishDate,
          language: articles.language,
        })
        .from(articles)
        .where(and(eq(articles.status, ArticleStatus.Publish))),
      db.select({ slug: authors.slug }).from(authors),
    ]);
  } catch (err) {
    console.error('[sitemap] Database query failed:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch sitemap data from database',
    });
  }

  const entries: SitemapEntry[] = [];
  const now = new Date().toISOString();

  for (const lang of ['en', 'pl'] as const) {
    for (const path of STATIC_PATHS) {
      const suffix = path ? `/${path}` : '';
      const loc =
        lang === 'en' ? `${BASE_URL}${suffix}` : `${BASE_URL}/pl${suffix}`;

      entries.push({
        loc,
        lastmod: now,
        priority: path === '' ? '1.0' : '0.9',
        changefreq: 'weekly',
      });
    }
  }

  for (const article of articleRows) {
    try {
      const prefix =
        article.language === DbLang.Polish ? `${BASE_URL}/pl/` : `${BASE_URL}/`;
      entries.push({
        loc: `${prefix}${article.slug}`,
        lastmod: article.publishDate.toISOString(),
        priority: determinePriority(article.publishDate),
        changefreq: 'monthly',
      });
    } catch (err) {
      console.error(
        `[sitemap] Skipping article — failed to build entry for slug "${article.slug}":`,
        err,
      );
    }
  }

  for (const author of authorRows) {
    try {
      entries.push(
        {
          loc: `${BASE_URL}/author/${author.slug}`,
          lastmod: now,
          priority: '0.7',
          changefreq: 'weekly',
        },
        {
          loc: `${BASE_URL}/pl/author/${author.slug}`,
          lastmod: now,
          priority: '0.7',
          changefreq: 'weekly',
        },
      );
    } catch (err) {
      console.error(
        `[sitemap] Skipping author — failed to build entry for slug "${author.slug}":`,
        err,
      );
    }
  }

  let xml: string;
  try {
    xml = buildXml(entries);
  } catch (err) {
    console.error('[sitemap] XML generation failed:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate sitemap XML',
    });
  }

  try {
    event.context.cloudflare.ctx?.waitUntil(
      CACHE_KV.put(CACHE_KEY, xml, { expirationTtl: CACHE_TTL }),
    );
  } catch (err) {
    console.error(
      '[sitemap] KV cache write failed — sitemap was served but not cached:',
      err,
    );
  }

  return xml;
});

function determinePriority(publishDate: Date): string {
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  return publishDate < twoYearsAgo ? '0.3' : '0.8';
}

function buildXml(entries: SitemapEntry[]): string {
  const root = create({ version: '1.0', encoding: 'UTF-8' }).ele('urlset', {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
  });

  for (const entry of entries) {
    root
      .ele('url')
      .ele('loc')
      .txt(entry.loc)
      .up()
      .ele('lastmod')
      .txt(entry.lastmod)
      .up()
      .ele('priority')
      .txt(entry.priority)
      .up()
      .ele('changefreq')
      .txt(entry.changefreq)
      .up();
  }

  return root.end({ prettyPrint: true });
}
