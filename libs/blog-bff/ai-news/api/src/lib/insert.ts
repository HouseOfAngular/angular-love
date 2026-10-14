import type { LibSQLDatabase } from 'drizzle-orm/libsql';

import { aiNewsItems } from '@angular-love/blog-bff/shared/schema';
import { canonicalizeUrl } from '@angular-love/blog/contracts/ai-news';

import { AiNewsItemInput, aiNewsItemInputSchema } from './schemas';
import { slugify } from './slug';

export type AiNewsInsertResult =
  | { status: 'created'; id: number; url: string; slug: string }
  /** The URL or the slug is already taken (stored, or earlier in the batch). */
  | { status: 'duplicate'; url: string; slug: string };

/**
 * Validates, canonicalizes the URLs and inserts in one statement. An item
 * whose URL or slug already exists is skipped, so running it again is safe.
 * Returns one result per input, in order.
 */
export async function insertAiNewsItems(
  db: LibSQLDatabase,
  inputs: AiNewsItemInput[],
): Promise<AiNewsInsertResult[]> {
  const rows = inputs.map((input) => {
    const item = aiNewsItemInputSchema.parse(input);
    return {
      ...item,
      url: canonicalizeUrl(item.url),
      slug: item.slug ?? slugify(item.title),
    };
  });
  if (rows.length === 0) {
    return [];
  }

  const created = await db
    .insert(aiNewsItems)
    .values(rows)
    .onConflictDoNothing()
    .returning({ id: aiNewsItems.id, url: aiNewsItems.url });
  const createdIds = new Map(created.map(({ url, id }) => [url, id]));

  return rows.map(({ url, slug }) => {
    const id = createdIds.get(url);
    // Delete it, so a repeat of the URL later in the batch is a duplicate.
    return createdIds.delete(url) && id !== undefined
      ? { status: 'created', id, url, slug }
      : { status: 'duplicate', url, slug };
  });
}
