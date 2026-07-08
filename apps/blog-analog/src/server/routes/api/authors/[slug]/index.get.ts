import { and, eq, not } from 'drizzle-orm';
import { createError, defineEventHandler, getRouterParam } from 'h3';

import { authors } from '@angular-love/blog-bff/shared/schema';

import { createDatabase } from '../../../../utils/database';

export default defineEventHandler(async (event) => {
  const db = createDatabase(event);
  const slug = getRouterParam(event, 'slug');

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
    .where(and(eq(authors.slug, slug!), not(eq(authors.seq, 0))));

  if (!author) {
    throw createError({ statusCode: 404, statusMessage: 'Author not found' });
  }

  return author;
});
