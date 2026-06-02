/*
  Applies one WordPress change (webhook) to the blog database.

  Usage: nx run api-jobs:sync --resource=post|author --id=<n> --action=create|update|delete
  Env: DATABASE_URL, DATABASE_AUTH_TOKEN (not needed for file: URLs), WP_REST_API_BASE_URL, WP_REST_API_TOKEN
*/
import { parseArgs } from 'node:util';
import { drizzle } from 'drizzle-orm/libsql';
import * as v from 'valibot';

import { getWpResource } from '@angular-love/blog-bff/shared/api-turso';

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

  const [url, wpBaseUrl, wpApiToken] = requireEnv(
    'DATABASE_URL',
    'WP_REST_API_BASE_URL',
    'WP_REST_API_TOKEN',
  );
  // Not needed for file: URLs
  const authToken = process.env['DATABASE_AUTH_TOKEN'] || undefined;

  console.log(`Sync ${request.action} ${request.resource} ${request.id}`);
  await syncResource({
    db: drizzle({ connection: { url, authToken } }),
    wp: getWpResource({ baseUrl: wpBaseUrl, apiToken: wpApiToken }),
    request,
  });
});
