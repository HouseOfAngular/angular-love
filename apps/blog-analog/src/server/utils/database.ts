import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { H3Event } from 'h3';

/**
 * Creates a Drizzle database connection using Nitro runtime config.
 * Adapted from the Hono `databaseMw` in `libs/blog-bff/shared/util-middleware/turso.ts`.
 * Cloudflare-specific geo-routing has been simplified to EU default.
 */
export function createDatabase(event: H3Event): LibSQLDatabase {
  if (import.meta.env['TURSO_LOCAL']) {
    return drizzle({ connection: { url: import.meta.env['TURSO_LOCAL'] as string } });
  }

  return drizzle({
    connection: {
      url: import.meta.env['TURSO_EU_CONNECTION_URL'] as string,
      authToken: import.meta.env['TURSO_EU_AUTH_TOKEN'] as string,
    },
  });
}
