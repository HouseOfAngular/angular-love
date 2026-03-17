import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { H3Event } from 'h3';

import { getOptionalEnv, getRequiredEnv } from './env';
import { getWorkerRegion, Region } from './geo';

function createDrizzleConnection(dbId: Region, event: H3Event): LibSQLDatabase {
  const connections: Record<Region, { url: string; authToken?: string }> = {
    US_EAST: {
      url: getRequiredEnv(event, 'TURSO_US_EAST_CONNECTION_URL'),
      authToken: getRequiredEnv(event, 'TURSO_US_EAST_AUTH_TOKEN'),
    },
    US_WEST: {
      url: getRequiredEnv(event, 'TURSO_US_WEST_CONNECTION_URL'),
      authToken: getRequiredEnv(event, 'TURSO_US_WEST_AUTH_TOKEN'),
    },
    EU: {
      url: getRequiredEnv(event, 'TURSO_EU_CONNECTION_URL'),
      authToken: getRequiredEnv(event, 'TURSO_EU_AUTH_TOKEN'),
    },
  };

  return drizzle({ connection: connections[dbId] });
}

export function createDatabase(event: H3Event): LibSQLDatabase {
  const tursoLocalUrl = getOptionalEnv(event, 'TURSO_LOCAL');

  if (tursoLocalUrl) {
    return drizzle({
      connection: { url: tursoLocalUrl },
    });
  }
  const region = getWorkerRegion();

  return createDrizzleConnection(region, event);
}
