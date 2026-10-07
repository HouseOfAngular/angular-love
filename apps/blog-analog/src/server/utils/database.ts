import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { H3Event } from 'h3';

import { getOptionalEnv, getRequiredEnv } from './env';

/** Connects to `TURSO_LOCAL` when set (local development), otherwise to the EU database. */
export function createDatabase(event: H3Event): LibSQLDatabase {
  const tursoLocalUrl = getOptionalEnv(event, 'TURSO_LOCAL');

  if (tursoLocalUrl) {
    return drizzle({ connection: { url: tursoLocalUrl } });
  }

  return drizzle({
    connection: {
      url: getRequiredEnv(event, 'TURSO_EU_CONNECTION_URL'),
      authToken: getRequiredEnv(event, 'TURSO_EU_AUTH_TOKEN'),
    },
  });
}
