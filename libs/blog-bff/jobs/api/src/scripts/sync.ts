/*
  Applies one WordPress change (webhook) to the blog database.

  Usage: nx run api-jobs:sync --resource=post|author --id=<n> --action=create|update|delete
  Env: WP_REST_API_BASE_URL, WP_REST_API_TOKEN, and the database, either:
    - TURSO_ORG, TURSO_API_TOKEN, TURSO_DB_NAME: mints a short-lived write token (Jenkins), or
    - DATABASE_URL (+ DATABASE_AUTH_TOKEN, not needed for file: URLs): e.g. a local file
*/
import { parseArgs } from 'node:util';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import * as v from 'valibot';

import {
  connectDatabase,
  createTursoApi,
  getWpResource,
} from '@angular-love/blog-bff/shared/api-turso';

import { syncResource } from '../lib/sync';

import { requireEnv, run } from './cli';

const ArgsSchema = v.object({
  resource: v.picklist(['post', 'author']),
  action: v.picklist(['create', 'update', 'delete']),
  id: v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1)),
});

run(async () => {
  const { values } = parseArgs({
    options: {
      resource: { type: 'string' },
      action: { type: 'string' },
      id: { type: 'string' },
    },
    strict: true,
  });
  const request = v.parse(ArgsSchema, values);

  const [wpBaseUrl, wpApiToken] = requireEnv(
    'WP_REST_API_BASE_URL',
    'WP_REST_API_TOKEN',
  );
  const db = await connect();

  console.log(`Sync ${request.action} ${request.resource} ${request.id}`);
  await syncResource({
    db,
    wp: getWpResource({ baseUrl: wpBaseUrl, apiToken: wpApiToken }),
    request,
  });
});

function connect(): Promise<LibSQLDatabase> {
  if (process.env['TURSO_DB_NAME']) {
    const [org, token, dbName] = requireEnv(
      'TURSO_ORG',
      'TURSO_API_TOKEN',
      'TURSO_DB_NAME',
    );
    return connectDatabase(createTursoApi({ org, token }), dbName);
  }
  const [url] = requireEnv('DATABASE_URL');
  // Not needed for file: URLs
  const authToken = process.env['DATABASE_AUTH_TOKEN'] || undefined;
  return Promise.resolve(drizzle({ connection: { url, authToken } }));
}
