import { and, eq } from 'drizzle-orm';
import { defineEventHandler, setHeader } from 'h3';
import { create } from 'xmlbuilder2';

import { articles, authors } from '@angular-love/blog-bff/shared/schema';
import { ArticleStatus, DbLang } from '@angular-love/contracts/articles';

import { createDatabase } from '../../utils/database';
import { getRequiredEnv } from '../../utils/env';

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
  const cached = await CACHE_KV.get(CACHE_KEY);

  if (cached) {
    return cached;
  }

  const db = createDatabase(event);

  const [articleRows, authorRows] = await Promise.all([
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

  const entries: SitemapEntry[] = [];
  const now = new Date().toISOString();

  for (const lang of ['en', 'pl'] as const) {
    for (const path of STATIC_PATHS) {
      const loc =
        lang === 'en' ? `${BASE_URL}/${path}` : `${BASE_URL}/pl/${path}`;

      entries.push({
        loc,
        lastmod: now,
        priority: path === '' ? '1.0' : '0.9',
        changefreq: 'weekly',
      });
    }
  }

  for (const article of articleRows) {
    const prefix =
      article.language === DbLang.Polish ? `${BASE_URL}/pl/` : `${BASE_URL}/`;
    entries.push({
      loc: `${prefix}${article.slug}`,
      lastmod: article.publishDate.toISOString(),
      priority: determinePriority(article.publishDate),
      changefreq: 'monthly',
    });
  }

  for (const author of authorRows) {
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
  }

  const xml = buildXml(entries);

  event.waitUntil(CACHE_KV.put(CACHE_KEY, xml, { expirationTtl: CACHE_TTL }));

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
