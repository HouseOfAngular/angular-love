/**
 * Turso Geo-Routing for Cloudflare Workers + Nitro SSR
 *
 * PROBLEM:
 * We have 3 Turso database groups (EU, US_EAST, US_WEST) and need to route
 * each request to the nearest one. In the old Hono BFF (standalone Cloudflare
 * Worker), we read `cf.latitude`/`cf.longitude` from every request directly.
 *
 * With AnalogJS SSR, the page request (e.g. `/`) triggers internal API calls
 * (e.g. `/api/articles`) during server-side rendering. Nitro short-circuits
 * these as in-process function calls — they never go through the Cloudflare
 * HTTP layer, so `event.context.cf` is undefined for internal calls.
 *
 * SOLUTION:
 * Cloudflare Workers run on specific POPs. Every request hitting
 * a worker instance is routed through the same POP by Cloudflare's
 * anycast network. The `cf.latitude`/`cf.longitude` on the request reflects
 * the POP location, not the end user's precise location.
 *
 * This means the closest database region is effectively constant per worker
 * instance. We capture the geo data from the first real HTTP request and
 * cache it in a module-level variable. This is safe because:
 *
 * 1. All requests to this worker instance come through the same POP
 * 2. The region result is identical for all requests to this instance
 * 3. Unlike per-user data, there's no race condition with globalThis/module
 *    scope — the value is the same regardless of which request sets it
 *
 * We intentionally avoid:
 * - globalThis with per-user data (race condition in V8 isolates)
 * - AsyncLocalStorage.enterWith() (not implemented in Workers)
 * - Hardcoded POP-to-region maps (don't scale as Cloudflare adds POPs)
 */

const DATABASES = [
  { id: 'US_WEST', lat: 47.6062, lon: -122.3321 },
  { id: 'EU', lat: 50.1109, lon: 8.6821 },
  { id: 'US_EAST', lat: 39.0438, lon: -77.4874 },
] as const;

export type Region = (typeof DATABASES)[number]['id'];

// Cached per worker instance — safe because all requests to this
// instance go through the same Cloudflare POP
let _workerRegion: Region | null = null;

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
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function computeClosestRegion(lat: number, lon: number): Region {
  let closest: Region = 'EU';
  let minDist = Infinity;

  for (const db of DATABASES) {
    const dist = getDistance(lat, lon, db.lat, db.lon);
    if (dist < minDist) {
      minDist = dist;
      closest = db.id;
    }
  }

  return closest;
}

/**
 * Called from middleware on the first real HTTP request.
 * Uses cf.latitude/cf.longitude (POP coordinates) to determine
 * the nearest Turso region. Subsequent calls are no-ops.
 */
export function initWorkerRegion(cf: {
  latitude?: string;
  longitude?: string;
}) {
  if (_workerRegion) return;

  if (cf.latitude && cf.longitude) {
    _workerRegion = computeClosestRegion(
      parseFloat(cf.latitude),
      parseFloat(cf.longitude),
    );
  }
}

/**
 * Returns the Turso region closest to this worker instance.
 * Safe to call from both real HTTP handlers and internal SSR calls.
 */
export function getWorkerRegion(): Region {
  return _workerRegion ?? 'EU';
}
