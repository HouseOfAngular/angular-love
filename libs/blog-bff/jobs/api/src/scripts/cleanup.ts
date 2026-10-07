/*
  Deletes PR preview databases (never <group>-main).

  Usage:
    nx run api-jobs:cleanup --env=<env> --branch=<branch> --build=<n> --hash=<hash> [--dry-run]
    nx run api-jobs:cleanup --all-but-mains [--dry-run]
  Env: TURSO_ORG, TURSO_API_TOKEN
*/
import { parseArgs } from 'node:util';
import * as v from 'valibot';

import { createTursoApi } from '@angular-love/blog-bff/shared/api-turso';

import { cleanupPreviewDatabases, CleanupTarget } from '../lib/cleanup';

import { requireEnv, run } from './cli';

const BranchArgsSchema = v.object({
  env: v.pipe(v.string(), v.minLength(1)),
  branch: v.pipe(v.string(), v.minLength(1)),
  build: v.pipe(v.string(), v.transform(Number), v.integer()),
  hash: v.pipe(v.string(), v.minLength(1)),
});

run(async () => {
  const { values } = parseArgs({
    options: {
      env: { type: 'string' },
      branch: { type: 'string' },
      build: { type: 'string' },
      hash: { type: 'string' },
      'all-but-mains': { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
    },
    strict: true,
  });
  const target: CleanupTarget = values['all-but-mains']
    ? { kind: 'all-but-mains' }
    : { kind: 'branch', ...v.parse(BranchArgsSchema, values) };

  const [org, token] = requireEnv('TURSO_ORG', 'TURSO_API_TOKEN');
  await cleanupPreviewDatabases({
    turso: createTursoApi({ org, token }),
    target,
    dryRun: values['dry-run'],
  });
});
