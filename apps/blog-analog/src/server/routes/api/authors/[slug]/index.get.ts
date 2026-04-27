import { eq } from 'drizzle-orm';
import { defineEventHandler, getRouterParam } from 'h3';

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
    .where(eq(authors.slug, slug!));

  return author;
});
