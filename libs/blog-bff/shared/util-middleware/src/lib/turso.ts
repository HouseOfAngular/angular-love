import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { createMiddleware } from 'hono/factory';

/** Connects to `TURSO_LOCAL` when set (local development), otherwise to the EU database. */
export const databaseMw = createMiddleware<{
  Bindings: {
    TURSO_LOCAL: string;
    TURSO_EU_CONNECTION_URL: string;
    TURSO_EU_AUTH_TOKEN: string;
  };
  Variables: { db: LibSQLDatabase };
}>(async (c, next) => {
  c.set(
    'db',
    drizzle({
      connection: c.env.TURSO_LOCAL
        ? { url: c.env.TURSO_LOCAL }
        : {
            url: c.env.TURSO_EU_CONNECTION_URL,
            authToken: c.env.TURSO_EU_AUTH_TOKEN,
          },
    }),
  );
  await next();
});
