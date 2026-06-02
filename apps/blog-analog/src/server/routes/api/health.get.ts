import { timingSafeEqual } from 'node:crypto';
import { createClient, type Client } from '@libsql/client';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import {
  createError,
  defineEventHandler,
  getHeader,
  setResponseStatus,
} from 'h3';

import { getEnv, getOptionalEnv, getRequiredEnv } from '../../utils/env';
import { type Region } from '../../utils/geo';

// ---------- Types ----------

type CheckStatus = 'pass' | 'fail';

interface CheckResult {
  status: CheckStatus;
  /** Short, non-sensitive code suitable for the response body. */
  code?: string;
  /** Latency in ms — useful for monitors and trend detection. */
  latencyMs?: number;
}

interface RegionCheckResult extends CheckResult {
  region: Region;
}

const DB_REGIONS: Region[] = ['EU', 'US_EAST', 'US_WEST'];

const DB_ENV_KEYS: Record<Region, { urlKey: keyof Env; tokenKey: keyof Env }> =
  {
    EU: { urlKey: 'TURSO_EU_CONNECTION_URL', tokenKey: 'TURSO_EU_AUTH_TOKEN' },
    US_EAST: {
      urlKey: 'TURSO_US_EAST_CONNECTION_URL',
      tokenKey: 'TURSO_US_EAST_AUTH_TOKEN',
    },
    US_WEST: {
      urlKey: 'TURSO_US_WEST_CONNECTION_URL',
      tokenKey: 'TURSO_US_WEST_AUTH_TOKEN',
    },
  };

const FETCH_TIMEOUT_MS = 5_000;
const DB_TIMEOUT_MS = 5_000;

// ---------- Client reuse ----------
// Lazily build one libsql client per region and reuse across requests so the
// health check exercises the same connection path real endpoints would.
const dbClients = new Map<Region, Client>();

function getDbClient(region: Region, url: string, authToken: string): Client {
  let client = dbClients.get(region);
  if (!client) {
    client = createClient({ url, authToken });
    dbClients.set(region, client);
  }
  return client;
}

// ---------- Helpers ----------

function errCode(err: unknown, fallback: string): string {
  // Map to a coarse code; never echo the raw message to the client.
  if (err instanceof Error && err.name === 'TimeoutError') return 'TIMEOUT';
  if (err instanceof Error && err.name === 'AbortError') return 'TIMEOUT';
  return fallback;
}

function logErr(component: string, err: unknown): void {
  const msg = err instanceof Error ? (err.stack ?? err.message) : String(err);
  console.error(`[health] ${component} failed:`, msg);
}

async function withTimeout<T>(
  p: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const e = new Error(`${label} timed out after ${ms}ms`);
      e.name = 'TimeoutError';
      reject(e);
    }, ms);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// ---------- Checks ----------

async function checkDbRegion(
  event: any,
  region: Region,
): Promise<RegionCheckResult> {
  const started = Date.now();
  try {
    const { urlKey, tokenKey } = DB_ENV_KEYS[region];
    // Read env *inside* the try so missing config becomes a per-check failure,
    // not a 500 that masks every other component.
    const url = getOptionalEnv(event, urlKey);
    const authToken = getOptionalEnv(event, tokenKey);
    if (!url || !authToken) {
      return { region, status: 'fail', code: 'CONFIG_MISSING' };
    }

    const db = drizzle(getDbClient(region, url, authToken));
    await withTimeout(db.run(sql`SELECT 1`), DB_TIMEOUT_MS, `db:${region}`);
    return { region, status: 'pass', latencyMs: Date.now() - started };
  } catch (err) {
    logErr(`db:${region}`, err);
    return {
      region,
      status: 'fail',
      code: errCode(err, 'DB_UNREACHABLE'),
      latencyMs: Date.now() - started,
    };
  }
}

async function checkWordPress(event: any): Promise<CheckResult> {
  const started = Date.now();
  try {
    const baseUrl = getOptionalEnv(event, 'WP_REST_API_BASE_URL');
    const token = getOptionalEnv(event, 'WP_REST_API_TOKEN');
    if (!baseUrl || !token) {
      return { status: 'fail', code: 'CONFIG_MISSING' };
    }

    const url = new URL('/wp-json/wp/v2/posts?per_page=1', baseUrl);
    const res = await fetch(url, {
      method: 'GET',
      // If your token is a JWT/bearer this prefix is required. Adjust to
      // `Basic ${btoa(...)}` if you're using application passwords instead.
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      // Don't read the body into a user-facing message — log it, return a code.
      logErr(
        'wordpress',
        new Error(
          `HTTP ${res.status}: ${(await res.text().catch(() => '')).slice(0, 500)}`,
        ),
      );
      return {
        status: 'fail',
        code:
          res.status === 401 || res.status === 403
            ? 'AUTH_FAILED'
            : 'UPSTREAM_ERROR',
        latencyMs: Date.now() - started,
      };
    }
    return { status: 'pass', latencyMs: Date.now() - started };
  } catch (err) {
    logErr('wordpress', err);
    return {
      status: 'fail',
      code: errCode(err, 'UNREACHABLE'),
      latencyMs: Date.now() - started,
    };
  }
}

async function checkKv(event: any): Promise<CheckResult> {
  const started = Date.now();
  try {
    const env = getEnv(event);
    if (!env?.CACHE_KV) {
      return { status: 'fail', code: 'BINDING_MISSING' };
    }
    await env.CACHE_KV.get('__health__');
    return { status: 'pass', latencyMs: Date.now() - started };
  } catch (err) {
    logErr('kv', err);
    return {
      status: 'fail',
      code: 'KV_ERROR',
      latencyMs: Date.now() - started,
    };
  }
}

async function checkBrevo(event: any): Promise<CheckResult> {
  const started = Date.now();
  try {
    const apiUrl = getOptionalEnv(event, 'BREVO_API_URL');
    const apiKey = getOptionalEnv(event, 'BREVO_API_KEY');
    if (!apiUrl || !apiKey) {
      return { status: 'fail', code: 'CONFIG_MISSING' };
    }

    // new URL handles trailing-slash drift in BREVO_API_URL.
    const url = new URL(
      'account',
      apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`,
    );
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json', 'api-key': apiKey },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      logErr('brevo', new Error(`HTTP ${res.status}`));
      return {
        status: 'fail',
        code:
          res.status === 401 || res.status === 403
            ? 'AUTH_FAILED'
            : 'UPSTREAM_ERROR',
        latencyMs: Date.now() - started,
      };
    }
    return { status: 'pass', latencyMs: Date.now() - started };
  } catch (err) {
    logErr('brevo', err);
    return {
      status: 'fail',
      code: errCode(err, 'UNREACHABLE'),
      latencyMs: Date.now() - started,
    };
  }
}

// ---------- Auth ----------

function isAuthorized(event: any): boolean {
  const expected = getOptionalEnv(event, 'HEALTH_CHECK_TOKEN');
  // If no token is configured, require one rather than failing open.
  if (!expected) return false;

  const provided = getHeader(event, 'x-health-token') ?? '';
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on length mismatch — pad to avoid leaking length.
  if (a.length !== b.length) {
    // Still do a constant-time compare against itself to keep timing flat.
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

// ---------- Handler ----------

export default defineEventHandler(async (event) => {
  if (!isAuthorized(event)) {
    // 404 (not 401) so we don't advertise the endpoint to unauthenticated probes.
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }

  // allSettled so an unexpected throw in one checker can't take down the report.
  // Each checker is already designed to return CheckResult rather than throw,
  // but this is defense-in-depth — health endpoints should never 500.
  const settled = await Promise.allSettled([
    Promise.all(DB_REGIONS.map((region) => checkDbRegion(event, region))),
    checkWordPress(event),
    checkKv(event),
    checkBrevo(event),
  ]);

  const failed = (code: string): CheckResult => ({ status: 'fail', code });

  const dbResults: RegionCheckResult[] =
    settled[0].status === 'fulfilled'
      ? settled[0].value
      : DB_REGIONS.map((region) => ({ region, ...failed('CHECK_CRASHED') }));
  const wordpress =
    settled[1].status === 'fulfilled'
      ? settled[1].value
      : failed('CHECK_CRASHED');
  const kv =
    settled[2].status === 'fulfilled'
      ? settled[2].value
      : failed('CHECK_CRASHED');
  const brevo =
    settled[3].status === 'fulfilled'
      ? settled[3].value
      : failed('CHECK_CRASHED');

  const allOk =
    dbResults.every((r) => r.status === 'pass') &&
    wordpress.status === 'pass' &&
    kv.status === 'pass' &&
    brevo.status === 'pass';

  // 200 / 503 so HTTP-level monitors (k8s probes, BetterStack, etc.) work
  // without parsing the body.
  setResponseStatus(event, allOk ? 200 : 503);

  return {
    status: allOk ? 'pass' : 'fail',
    checks: {
      db: dbResults,
      wordpress,
      kv,
      brevo,
    },
  };
});
