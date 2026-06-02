import { eq } from 'drizzle-orm';
import { LibSQLDatabase } from 'drizzle-orm/libsql';

import {
  articles,
  authors,
  NewArticle,
  NewAuthor,
} from '@angular-love/blog-bff/shared/schema';

export async function insertAuthor(
  client: LibSQLDatabase,
  newAuthor: NewAuthor,
): Promise<void> {
  await client
    .insert(authors)
    .values(newAuthor)
    .onConflictDoUpdate({
      target: authors.id,
      set: {
        slug: newAuthor.slug,
        name: newAuthor.name,
        avatarUrl: newAuthor.avatarUrl,
        descriptionEn: newAuthor.descriptionEn,
        descriptionPl: newAuthor.descriptionPl,
        position: newAuthor.position,
        github: newAuthor.github,
        twitter: newAuthor.twitter,
        linkedin: newAuthor.linkedin,
        titles: newAuthor.titles,
      },
    })
    .execute();
}

export async function removeAuthor(
  client: LibSQLDatabase,
  id: number,
): Promise<void> {
  await client.delete(authors).where(eq(authors.id, id)).execute();
}

export async function insertArticle(
  client: LibSQLDatabase,
  wpArticle: NewArticle,
): Promise<void> {
  await client
    .insert(articles)
    .values(wpArticle)
    .onConflictDoUpdate({
      target: articles.id,
      set: {
        excerpt: wpArticle.excerpt,
        content: wpArticle.content,
        title: wpArticle.title,
        slug: wpArticle.slug,
        status: wpArticle.status,
        publishDate: wpArticle.publishDate,
        readingTime: wpArticle.readingTime,
        otherTranslations: wpArticle.otherTranslations,
        imageUrl: wpArticle.imageUrl,
        anchors: wpArticle.anchors,
        modifyDate: wpArticle.modifyDate,
        difficulty: wpArticle.difficulty,
        authorId: wpArticle.authorId,
        language: wpArticle.language,
        seo: wpArticle.seo,
        categories: wpArticle.categories,
        isHidden: wpArticle.isHidden,
      },
    })
    .execute();
}

export async function removeArticle(
  client: LibSQLDatabase,
  id: number,
): Promise<void> {
  await client.delete(articles).where(eq(articles.id, id)).execute();
}
