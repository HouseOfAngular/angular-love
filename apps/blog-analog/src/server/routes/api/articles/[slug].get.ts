import { eq } from 'drizzle-orm';
import { defineEventHandler, getRouterParam } from 'h3';

import {
  articles,
  authors,
} from '@angular-love/blog-bff/shared/schema';

import { createDatabase } from '../../../utils/database';
import { getLang } from '../../../utils/lang';

export default defineEventHandler(async (event) => {
  const db = createDatabase(event);
  const lang = getLang(event);
  const slug = getRouterParam(event, 'slug');

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
      language: articles.language,
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
    .where(eq(articles.slug, slug!));

  return article;
});
