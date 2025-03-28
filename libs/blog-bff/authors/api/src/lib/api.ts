import { and, desc, eq, not, sql } from 'drizzle-orm';
import { Hono } from 'hono';

import { articles, authors } from '@angular-love/blog-bff/shared/schema';
import { withPagination } from '@angular-love/blog-bff/shared/util-drizzle';
import {
  databaseMw,
  langMw,
} from '@angular-love/blog-bff/shared/util-middleware';
import { ArticleStatus, dbLangMap } from '@angular-love/contracts/articles';
import { getPagination } from '@angular-love/util-wp';

const app = new Hono().use(langMw()).use(databaseMw);

app.get('/', async (c) => {
  const queryParams = c.req.query();
  const { per_page, page } = getPagination(queryParams);
  const db = c.var.db;

  const query = db
    .select({
      slug: authors.slug,
      name: authors.name,
      description: {
        pl: authors.descriptionPl,
        en: authors.descriptionEn,
      },
      avatarUrl: authors.avatarUrl,
      position: authors.position,
      github: authors.github,
      twitter: authors.twitter,
      linkedin: authors.linkedin,
      titles: authors.titles,
    })
    .from(authors)
    .where(not(eq(authors.seq, 0)))
    .orderBy(authors.seq);
  const sub = query.as('sub');
  const countQuery = db
    .select({
      count: sql<number>`COUNT(${sub.slug})`.as('count'),
    })
    .from(sub);
  const [results, [{ count: total }]] = await Promise.all([
    withPagination(query.$dynamic(), page, +per_page),
    countQuery,
  ]);

  return c.json({
    data: results,
    total,
  });
});

app.get('/:slug', async (c) => {
  const slug = c.req.param('slug');
  const db = c.var.db;

  const [author] = await db
    .select({
      slug: authors.slug,
      name: authors.name,
      description: {
        pl: authors.descriptionPl,
        en: authors.descriptionEn,
      },
      avatarUrl: authors.avatarUrl,
      position: authors.position,
      github: authors.github,
      twitter: authors.twitter,
      linkedin: authors.linkedin,
      titles: authors.titles,
    })
    .from(authors)
    .where(eq(authors.slug, slug));

  return c.json(author);
});

app.get('/:slug/articles', async (c) => {
  const slug = c.req.param('slug');
  const queryParams = c.req.query();
  const { per_page, page } = getPagination(queryParams);

  const db = c.var.db;

  const query = db
    .select({
      slug: articles.slug,
      title: articles.title,
      excerpt: articles.excerpt,
      featuredImageUrl: articles.imageUrl,
      readingTime: articles.readingTime,
      author: {
        slug: authors.slug,
        name: authors.name,
        avatarUrl: authors.avatarUrl,
      },
    })
    .from(authors)
    .leftJoin(
      articles,
      and(
        eq(articles.status, ArticleStatus.Publish),
        eq(articles.language, dbLangMap[c.var.lang]),
        eq(articles.authorId, authors.id),
      ),
    )
    .where(eq(authors.slug, slug))
    .orderBy(desc(articles.publishDate));
  const sub = query.as('sub');

  const [authorArticles, [{ count: totalPosts }]] = await Promise.all([
    withPagination(query.$dynamic(), page, +per_page),
    db
      .select({
        count: sql<number>`COUNT(${sub.slug})`.as('count'),
      })
      .from(sub),
  ]);

  return c.json({
    data: authorArticles,
    totalPosts,
  });
});

export default app;
