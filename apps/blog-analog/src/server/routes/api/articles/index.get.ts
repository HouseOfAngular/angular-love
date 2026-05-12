import { and, desc, eq, sum } from 'drizzle-orm';
import { defineEventHandler, getQuery } from 'h3';

import {
  articleCounts,
  articles,
  authors,
} from '@angular-love/blog-bff/shared/schema';
import { withPagination } from '@angular-love/blog-bff/shared/util-drizzle';
import { ArticleStatus, dbLangMap } from '@angular-love/contracts/articles';
import { getPagination } from '@angular-love/util-wp';

import { createDatabase } from '../../../utils/database';
import { getLang } from '../../../utils/lang';

export default defineEventHandler(async (event) => {
  const db = createDatabase(event);
  const lang = getLang(event);
  const queryParams = getQuery(event) as Record<string, string>;

  const { per_page, page } = getPagination(queryParams);

  const query = db
    .select({
      slug: articles.slug,
      title: articles.title,
      excerpt: articles.excerpt,
      featuredImageUrl: articles.imageUrl,
      readingTime: articles.readingTime,
      publishDate: articles.publishDate,
      hidden: articles.publishDate,
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
        eq(articles.language, dbLangMap[lang]),
        ...showHiddenFilter(articles, queryParams['showHidden']),
        ...withCategoryFilters(articles, queryParams['category']),
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
        eq(articleCounts.lang, dbLangMap[lang]),
        eq(articleCounts.status, ArticleStatus.Publish),
        ...showHiddenFilter(articleCounts, queryParams['showHidden']),
        ...withCategoryFilters(articleCounts, queryParams['category']),
      ),
    )
    .groupBy(articleCounts.lang);

  const [posts, [{ rowCountSum: total } = { rowCountSum: 0 }]] =
    await Promise.all([
      withPagination(query.$dynamic(), page, +per_page),
      countQuery,
    ]);

  return { data: posts, total };
});

function showHiddenFilter(
  table: typeof articles | typeof articleCounts,
  showHidden?: string,
) {
  return showHidden !== undefined ? [] : [eq(table.isHidden, false)];
}

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
