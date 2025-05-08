import { and, desc, eq, sum } from 'drizzle-orm';
import { Hono } from 'hono';

import {
  articleCounts,
  articles,
  authors,
} from '@angular-love/blog-bff/shared/schema';
import { withPagination } from '@angular-love/blog-bff/shared/util-drizzle';
import {
  databaseMw,
  langMw,
} from '@angular-love/blog-bff/shared/util-middleware';
import { ArrayResponse } from '@angular-love/blog-contracts/shared';
import {
  ArticlePreview,
  ArticleStatus,
  dbLangMap,
} from '@angular-love/contracts/articles';
import { getPagination, wpClientMw } from '@angular-love/util-wp';

import { toArticlePreviewList } from './mappers';
import { WpPosts } from './wp-posts';

const app = new Hono().use(langMw()).use(databaseMw).use(wpClientMw);

app.get('/', async (c) => {
  const db = c.var.db;
  const queryParams = c.req.query();

  const { per_page, page } = getPagination(queryParams);

  const query = db
    .select({
      slug: articles.slug,
      title: articles.title,
      excerpt: articles.excerpt,
      featuredImageUrl: articles.imageUrl,
      readingTime: articles.readingTime,
      publishDate: articles.publishDate,
      author: {
        slug: authors.slug,
        name: authors.name,
        avatarUrl: authors.avatarUrl,
      },
    })
    .from(articles)
    .innerJoin(authors, eq(articles.authorId, authors.id))
    .where(
      and(
        eq(articles.status, ArticleStatus.Publish),
        eq(articles.language, dbLangMap[c.var.lang]),
        ...withCategoryFilters(articles, queryParams.category),
      ),
    )
    .orderBy(desc(articles.publishDate));

  const countQuery = db
    .select({
      rowCountSum: sum(articleCounts.rowCount),
    })
    .from(articleCounts)
    .where(
      and(
        eq(articleCounts.lang, dbLangMap[c.var.lang]),
        eq(articleCounts.status, ArticleStatus.Publish),
        ...withCategoryFilters(articleCounts, queryParams.category),
      ),
    )
    .groupBy(articleCounts.lang);

  const [posts, [{ rowCountSum: total } = { rowCountSum: 0 }]] =
    await Promise.all([
      withPagination(query.$dynamic(), page, +per_page),
      countQuery,
    ]);

  return c.json({
    data: posts,
    total,
  });
});

app.get('/:slug', async (c) => {
  const db = c.var.db;
  const lang = c.var.lang;
  const slug = c.req.param('slug');

  const [article] = await db
    .select({
      id: articles.id,
      content: articles.content,
      slug: articles.slug,
      title: articles.title,
      readingTime: articles.readingTime,
      publishDate: articles.publishDate,
      difficulty: articles.difficulty,
      anchors: articles.anchors,
      seo: articles.seo,
      otherTranslations: articles.otherTranslations,
      author: {
        slug: authors.slug,
        name: authors.name,
        avatarUrl: authors.avatarUrl,
        titles: authors.titles,
        github: authors.github,
        twitter: authors.twitter,
        linkedin: authors.linkedin,
        position: authors.position,
        description:
          lang === 'pl' ? authors.descriptionPl : authors.descriptionEn,
      },
    })
    .from(articles)
    .innerJoin(authors, eq(articles.authorId, authors.id))
    .where(eq(articles.slug, slug));

  return c.json(article);
});

app.get('/:id/related', async (c) => {
  const id = c.req.param('id');
  const limit = c.req.query('limit');

  const query: Record<string, string | number> = {
    lang: c.var.lang,
    limit: limit || 2,
  };

  const client = new WpPosts(c.var.createWPClient({ namespace: 'yarpp/v1' }));

  const result = await client.getRelatedPosts(id, query);

  return c.json(<ArrayResponse<ArticlePreview>>{
    data: toArticlePreviewList(result.data),
    total: Number(result.headers.get('x-wp-total')),
  });
});

export default app;

function withCategoryFilters(
  table: typeof articles | typeof articleCounts,
  category?: string,
) {
  const withGuidesFilter =
    category === 'guides-en' ||
    category === 'guides-pl' ||
    category === 'guides'
      ? eq(table.isGuide, true)
      : undefined;
  const withInDepthFilter =
    category === 'angular-in-depth-en' ||
    category === 'angular-in-depth-pl' ||
    category === 'angular-in-depth'
      ? eq(table.isInDepth, true)
      : undefined;
  const withNewsFilter =
    category === 'news-en' || category === 'news-pl' || category === 'news'
      ? eq(table.isNews, true)
      : undefined;
  const witRecommendedFilter =
    category === 'recommended-en' ||
    category === 'recommended-pl' ||
    category === 'recommended'
      ? eq(table.isRecommended, true)
      : undefined;
  return [
    withGuidesFilter,
    withInDepthFilter,
    withNewsFilter,
    witRecommendedFilter,
  ];
}
