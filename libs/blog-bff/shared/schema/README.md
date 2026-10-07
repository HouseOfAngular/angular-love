# blog-bff-shared-schema

The blog database schema (`src/lib/schema.ts`) and its drizzle migrations
(`drizzle/`). The blog server (`apps/blog-analog`) reads the database through
this schema, and the WordPress sync jobs (`libs/blog-bff/jobs/api`) write to it.

## Local database

Use a local SQLite file to develop without touching Turso. The examples use
`tmp/blog-jobs/local.db` (`tmp/` is gitignored) and run from the repository
root.

> [!IMPORTANT]
> Use an **absolute** `file:` path, e.g. `file:$PWD/tmp/blog-jobs/local.db`.
> The `db-*` targets run from this lib's folder, so a relative path resolves
> from there, and `drizzle-kit migrate` fails silently with exit code 1.

### 1. Create the database

**With real content (recommended).** Fetches every author and post from
WordPress, maps them like production does, and applies the migrations:

```sh
export WP_REST_API_BASE_URL=https://wp.angular.love
export WP_REST_API_TOKEN='Basic …'   # full Authorization header value, ask a maintainer
nx run api-jobs:rebuild --local-only  # writes tmp/blog-jobs/local.db, takes about a minute
```

Every run deletes and recreates the file, so it's also how you reset the database.
Use `--out=<path>` to write somewhere else. To keep the WordPress variables
around, copy `libs/blog-bff/jobs/api/.env.example` to `.env.local` next to it
and load it with `set -a; source libs/blog-bff/jobs/api/.env.local; set +a`.

**Empty, schema only.** Applies the migrations to a new file:

```sh
mkdir -p tmp/blog-jobs
DATABASE_URL=file:$PWD/tmp/blog-jobs/local.db nx run blog-bff-shared-schema:db-migrate
```

### 2. Point the blog at it

Add `TURSO_LOCAL` to `apps/blog-analog/.dev.vars` (gitignored). This command prints
the line with your actual absolute path:

```sh
echo "TURSO_LOCAL=file:$PWD/tmp/blog-jobs/local.db"
```

Then start the blog with `nx serve blog-analog`. When `TURSO_LOCAL` is set,
every request uses it instead of the EU database (`TURSO_EU_*`, see
`apps/blog-analog/src/server/utils/database.ts`). To go back to the remote
database, remove or empty the line.

> [!NOTE]
> The dev server currently needs a Cloudflare login (`npx wrangler login`) with
> access to the angular.love account. The Workers AI binding (`AI`) only runs
> remotely, and if that remote session fails, the dev server starts with an
> empty env and reports every variable from `.dev.vars` as missing.
> wrangler caches the account in `node_modules/.cache/wrangler/wrangler-account.json`.
> If you log in as a different user, delete that file.

Restart the dev server after a `rebuild`. The rebuild replaces the file, and
a running server keeps reading the old one.

### 3. Apply migrations

```sh
DATABASE_URL=file:$PWD/tmp/blog-jobs/local.db nx run blog-bff-shared-schema:db-migrate
```

This applies the migrations in `drizzle/` that the database doesn't have yet and
does nothing when it's up to date. drizzle tracks them in the
`__drizzle_migrations` table. It's the same command the deploy runs against
Turso.

### Inspect it

```sh
DATABASE_URL=file:$PWD/tmp/blog-jobs/local.db nx run blog-bff-shared-schema:db-studio
```

This opens Drizzle Studio at https://local.drizzle.studio. `sqlite3 tmp/blog-jobs/local.db`
works too.

### Sync a single post or author

To refresh one entity after changing a mapper or editing it in WordPress, run
the webhook job against the local file:

```sh
DATABASE_URL=file:$PWD/tmp/blog-jobs/local.db \
  nx run api-jobs:sync --resource=post --id=123 --action=update
```

## Changing the schema

1. Edit `src/lib/schema.ts`.
2. Generate a migration:
   `nx run blog-bff-shared-schema:db-generate --name=<what_changed>`. Hand-written
   SQL such as triggers goes in a custom migration:
   `nx run blog-bff-shared-schema:db-generate --custom --name=<what_changed>`.
3. Review the generated SQL in `drizzle/`, then apply it locally (step 3 above).
4. If the column comes from WordPress, update the mapper in
   `libs/blog-bff/shared/api-turso/src/lib/mappers` and its spec. Then refresh
   the data with `sync` (one entity) or `rebuild --local-only` (everything).
5. Check that the migrations match the schema with
   `nx run blog-bff-shared-schema:db-check`, then commit `schema.ts` together with
   the files in `drizzle/` (`.sql` and `meta/`).

`Jenkinsfile.deploy` applies new migrations before the new worker version is
uploaded: on PR builds to the PR's preview copy of the database, and on `main` to
the main database. The previous worker version and the webhook sync keep running
against the migrated schema for a while, so migrations must be backward
compatible. Follow expand → deploy → contract: add nullable or defaulted columns
first, ship the code that uses them, and drop old columns in a later release.
Never edit a migration that is already on `main`. Add a new one instead.

## Running unit tests

Run `nx test blog-bff-shared-schema` to execute the unit tests via [Jest](https://jestjs.io).
