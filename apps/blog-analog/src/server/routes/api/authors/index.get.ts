import { eq, not, sql } from 'drizzle-orm';
import { defineEventHandler, getQuery } from 'h3';

import { authors } from '@angular-love/blog-bff/shared/schema';
import { withPagination } from '@angular-love/blog-bff/shared/util-drizzle';
import { getPagination } from '@angular-love/util-wp';

import { createDatabase } from '../../../utils/database';

export default defineEventHandler(async (event) => {
  const db = createDatabase(event);
  const queryParams = getQuery(event) as Record<string, string>;
  const { per_page, page } = getPagination(queryParams);

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

  return { data: results, total };
});
