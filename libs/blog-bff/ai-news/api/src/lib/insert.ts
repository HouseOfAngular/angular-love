import { inArray } from 'drizzle-orm';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';

import {
  aiNewsItems,
  NewAiNewsItem,
} from '@angular-love/blog-bff/shared/schema';
import { canonicalizeUrl } from '@angular-love/blog/contracts/ai-news';

import { AiNewsItemInput, aiNewsItemInputSchema } from './schemas';

export interface AiNewsInsertResult {
  id: number;
  /** The canonical URL. */
  url: string;
  /** `duplicate`: the URL was already stored, or appears earlier in the batch. */
  status: 'created' | 'duplicate';
}

/**
 * Validates, canonicalizes the URLs and inserts in one statement. An item
 * whose canonical URL already exists is skipped, so running it again is safe.
 * Returns one result per input, in order.
 */
export async function insertAiNewsItems(
  db: LibSQLDatabase,
  inputs: AiNewsItemInput[],
): Promise<AiNewsInsertResult[]> {
  const rows: NewAiNewsItem[] = inputs.map((input) => {
    const item = aiNewsItemInputSchema.parse(input);
    return { ...item, url: canonicalizeUrl(item.url) };
  });
  if (rows.length === 0) {
    return [];
  }

  const created = await db
    .insert(aiNewsItems)
    .values(rows)
    .onConflictDoNothing({ target: aiNewsItems.url })
    .returning({ id: aiNewsItems.id, url: aiNewsItems.url });
  const createdIds = new Map(created.map((row) => [row.url, row.id]));

  const skippedUrls = [
    ...new Set(
      rows.map((row) => row.url).filter((url) => !createdIds.has(url)),
    ),
  ];
  const existing = skippedUrls.length
    ? await db
        .select({ id: aiNewsItems.id, url: aiNewsItems.url })
        .from(aiNewsItems)
        .where(inArray(aiNewsItems.url, skippedUrls))
    : [];
  const existingIds = new Map(existing.map((row) => [row.url, row.id]));

  const reported = new Set<string>();
  return rows.map(({ url }) => {
    const createdId = createdIds.get(url);
    if (createdId !== undefined && !reported.has(url)) {
      reported.add(url);
      return { id: createdId, url, status: 'created' };
    }
    const id = createdId ?? existingIds.get(url);
    if (id === undefined) {
      throw new Error(`AI news item ${url} was neither inserted nor found`);
    }
    return { id, url, status: 'duplicate' };
  });
}
