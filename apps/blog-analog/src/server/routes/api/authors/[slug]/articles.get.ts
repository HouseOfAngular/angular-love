import { defineEventHandler, getQuery, getRouterParam } from 'h3';
import { and, desc, eq, sql } from 'drizzle-orm';

import { articles, authors } from '@angular-love/blog-bff/shared/schema';
import { withPagination } from '@angular-love/blog-bff/shared/util-drizzle';
import { ArticleStatus, dbLangMap } from '@angular-love/contracts/articles';
import { getPagination } from '@angular-love/util-wp';

import { createDatabase } from '../../../../utils/database';
import { getLang } from '../../../../utils/lang';

export default defineEventHandler(async (event) => {
  const db = createDatabase(event);
  const lang = getLang(event);
  const slug = getRouterParam(event, 'slug')!;
  const queryParams = getQuery(event) as Record<string, string>;
  const { per_page, page } = getPagination(queryParams);

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
        eq(articles.language, dbLangMap[lang]),
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

  return { data: authorArticles, totalPosts };
});
