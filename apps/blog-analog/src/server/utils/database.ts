import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { H3Event } from 'h3';

import { getOptionalEnv, getRequiredEnv } from './env';

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

function createDrizzleConnection(dbId: string, event: H3Event): LibSQLDatabase {
  const connections: Record<string, { url: string; authToken?: string }> = {
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

  const cf = event.context.cloudflare.request.cf;
  if (
    cf &&
    typeof cf.longitude === 'string' &&
    typeof cf.latitude === 'string'
  ) {
    const lat = parseFloat(cf.latitude);
    const lon = parseFloat(cf.longitude);
    const closestDb = getClosestDatabase(lat, lon);
    return createDrizzleConnection(closestDb, event);
  }

  return createDrizzleConnection('EU', event);
}
