import { LibSQLDatabase } from 'drizzle-orm/libsql';

import {
  initHighlighter,
  insertArticle,
  insertAuthor,
  removeArticle,
  removeAuthor,
  toArticle,
  toAuthor,
  WpResource,
} from '@angular-love/blog-bff/shared/api-turso';

export interface SyncRequest {
  resource: 'post' | 'author';
  action: 'create' | 'update' | 'delete';
  id: number;
}

/**
 * Applies a WordPress change to the blog database: create/update fetch the
 * entity from WordPress, map it and upsert it; delete removes it by id.
 */
export async function syncResource({
  db,
  wp,
  request: { resource, action, id },
}: {
  db: LibSQLDatabase;
  wp: WpResource;
  request: SyncRequest;
}): Promise<void> {
  if (action === 'delete') {
    await (resource === 'post' ? removeArticle(db, id) : removeAuthor(db, id));
    return;
  }

  if (resource === 'author') {
    const { data } = await wp.author(id);
    await insertAuthor(db, toAuthor(data));
    return;
  }

  await initHighlighter();
  const { data } = await wp.post(id);
  await insertArticle(db, toArticle(data));
}
