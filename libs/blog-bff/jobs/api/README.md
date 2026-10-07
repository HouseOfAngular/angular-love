# api-jobs

Jobs that keep the blog database in sync with WordPress, run as Nx targets of
this lib (`src/scripts/*.ts`). The scripts only parse flags and env; the logic
is in `src/lib` (exported for reuse and tests). Mapping, the WordPress client
and Turso helpers come from `libs/blog-bff/shared/api-turso`; the schema and
migrations from `libs/blog-bff/shared/schema`.

The blog uses a single database in the EU group (`TURSO_EU_*`). PR builds get
their own copy of it.

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

`--local-only`, and `sync` against a `file:` URL, never touch Turso. For
the full local setup (creating the database, pointing the blog at it, applying
migrations, changing the schema), see
[the schema lib's README](../../shared/schema/README.md).
