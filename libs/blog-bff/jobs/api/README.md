# api-jobs

Jobs that keep the blog database in sync with WordPress, run as Nx targets of
this lib (`src/scripts/*.ts`). The scripts only parse flags and env; the logic
is in `src/lib` (exported for reuse and tests). Mapping, the WordPress client
and Turso helpers come from `libs/blog-bff/shared/api-turso`; the schema and
migrations from `libs/blog-bff/shared/schema`.

Only the EU database is kept in sync. The US databases are deprecated and will
be removed: the jobs no longer update or migrate them, and `Jenkinsfile.deploy`
points every region of the worker (`TURSO_US_*`) at the EU database. PR builds
branch only the EU database.

## Jobs

| Target             | What it does                                                                   | Jenkinsfile                                                            |
| ------------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `api-jobs:sync`    | Upserts/deletes one post or author in `DATABASE_URL` (WordPress webhook)       | `Jenkinsfile.sync`                                                     |
| `api-jobs:rebuild` | Builds a fresh SQLite file from WordPress and replaces `TURSO_DB_NAME` with it | `Jenkinsfile.rebuild`                                                  |
| `api-jobs:cleanup` | Deletes PR preview databases                                                   | `Jenkinsfile.cleanup_db`, `cleanup_db_webhook`, `delete_all_but_mains` |

Each script documents its flags and env at the top of `src/scripts/<job>.ts`. Flags are
passed straight through Nx, e.g.:

```sh
nx run api-jobs:sync --resource=post --id=123 --action=update
nx run api-jobs:rebuild --local-only
nx run api-jobs:cleanup --all-but-mains --dry-run
```

## Local usage

Copy `.env.example` to `.env.local`, fill it in, and load it for the shell:

```sh
set -a; source libs/blog-bff/jobs/api/.env.local; set +a
nx run api-jobs:rebuild --local-only   # writes tmp/blog-jobs/local.db
```

To serve the blog from that file, set `TURSO_LOCAL=file:<absolute path>` in
`apps/blog-analog/.dev.vars`.

`--local-only`, and `sync` against a `file:` URL, never touch Turso.

## Schema changes

1. Edit `libs/blog-bff/shared/schema/src/lib/schema.ts`.
2. `nx run blog-bff-shared-schema:db-generate` (or `drizzle-kit generate --custom` for hand-written SQL such as triggers).
3. Commit the generated files in `drizzle/`. `nx run blog-bff-shared-schema:db-check` validates them.

Migrations are applied with drizzle-kit:
`DATABASE_URL=... DATABASE_AUTH_TOKEN=... nx run blog-bff-shared-schema:db-migrate`.
The target runs from the schema folder, because drizzle-kit resolves the config's paths relative to the
current directory. `Jenkinsfile.deploy` runs it against the EU preview database on PR
builds and the EU main database on `main`, **before** the new worker version is uploaded. The previous
worker version and the webhook sync keep running against the migrated schema
for a while, so migrations must be backward compatible (expand → deploy →
contract): add nullable/defaulted columns first, ship code that uses them, and
drop old columns in a later release.

Write the mapping for a new column in the same PR. Rows synced before the change are
filled in by the next rebuild, or by a data migration.

## Cutover from angular-love-scripts (one-off)

The existing main databases were created by the old scripts repo, with a
different migration history. To switch:

1. In Jenkins, create the secret-text credentials `blog-jobs-sync-webhook-token`
   and `blog-jobs-cleanup-webhook-token`. Point the existing jobs (webhook sync,
   recreate main, cleanup, delete all but mains) at this repo
   and the matching Jenkinsfile. Update webhookrelay or the GitHub webhook if
   the trigger token changes.
2. Run `Jenkinsfile.rebuild` once. The EU main database is recreated from this
   repo's migrations.
3. Set `RUN_DB_MIGRATIONS='true'` in `Jenkinsfile.deploy`. Before the rebuild,
   preview databases are branched from the old mains and would fail on the
   first migration with "table already exists".
4. Archive the Turso and banner scripts in `angular-love-scripts`, and delete the
   move-banners Jenkins job. The worker fills the banner cache itself.
