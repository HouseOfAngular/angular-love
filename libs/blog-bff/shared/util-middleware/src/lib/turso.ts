import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { createMiddleware } from 'hono/factory';

const DATABASES = [
  {
    id: 'US_WEST',
    lat: 47.6062,
    lon: -122.3321,
  },
  { id: 'EU', lat: 50.1109, lon: 8.6821 },
  {
    id: 'US_EAST',
    lat: 39.0438,
    lon: -77.4874,
  },
] as const;

function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getClosestDatabase(lat: number, lon: number) {
  let closestDb: (typeof DATABASES)[number]['id'] = DATABASES[0].id;
  let minDistance = getDistance(lat, lon, DATABASES[0].lat, DATABASES[0].lon);

  for (let i = 1; i < DATABASES.length; i++) {
    const distance = getDistance(lat, lon, DATABASES[i].lat, DATABASES[i].lon);
    if (distance < minDistance) {
      minDistance = distance;
      closestDb = DATABASES[i].id;
    }
  }

  return closestDb;
}

function createDrizzleConnection(dbId: string, env: any): LibSQLDatabase {
  const connections: Record<string, { url: string; authToken?: string }> = {
    US_EAST: {
      url: env.TURSO_US_EAST_CONNECTION_URL,
      authToken: env.TURSO_US_EAST_AUTH_TOKEN,
    },
    US_WEST: {
      url: env.TURSO_US_WEST_CONNECTION_URL,
      authToken: env.TURSO_US_WEST_AUTH_TOKEN,
    },
    EU: {
      url: env.TURSO_EU_CONNECTION_URL,
      authToken: env.TURSO_EU_AUTH_TOKEN,
    },
  };

  return drizzle({ connection: connections[dbId] });
}

export const databaseMw = createMiddleware<{
  Bindings: {
    TURSO_LOCAL: string;
    TURSO_EU_CONNECTION_URL: string;
    TURSO_EU_AUTH_TOKEN: string;
    TURSO_US_EAST_CONNECTION_URL: string;
    TURSO_US_EAST_AUTH_TOKEN: string;
    TURSO_US_WEST_CONNECTION_URL: string;
    TURSO_US_WEST_AUTH_TOKEN: string;
  };
  Variables: { db: LibSQLDatabase };
}>(async (c, next) => {
  if (c.env.TURSO_LOCAL) {
    c.set('db', drizzle({ connection: { url: c.env.TURSO_LOCAL } }));
  } else {
    const cf = c.req.raw.cf;
    if (
      cf &&
      typeof cf.longitude === 'string' &&
      typeof cf.latitude === 'string'
    ) {
      const lat = parseFloat(cf.latitude);
      const lon = parseFloat(cf.longitude);
      const closestDb = getClosestDatabase(lat, lon);
      c.set('db', createDrizzleConnection(closestDb, c.env));
    } else {
      c.set('db', createDrizzleConnection('EU', c.env));
    }
  }
  await next();
});
