# api-ai-news

Server side of the AI news feed: Zod schemas for the API boundary, the keyset
paginated feed query (`getAiNewsFeed`), the opaque cursor, and
`insertAiNewsItems` (validates, canonicalizes the URL, skips duplicates).

Routes, in `apps/blog-analog/src/server/routes/api/ai-news/`:

- `GET /api/ai-news?cursor=&limit=&category=`: the public feed.
- `POST /api/ai-news`: adds items. Use it instead of writing to the database
  directly: it canonicalizes URLs so tracking variants dedupe, converts dates to
  the unix seconds the table stores, and reports duplicates. The table's CHECK
  constraints also reject unknown enum values and millisecond dates from raw
  SQL, but only with a database error.

## Adding items

```sh
curl -X POST https://angular.love/api/ai-news \
  -H "Authorization: Bearer $AI_NEWS_INGEST_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "items": [{
      "url": "https://example.com/post?utm_source=slack",
      "title": "Example Lab ships a new model",
      "summary": "Up to 280 characters.",
      "sourceName": "Example Lab",
      "sourceType": "blog",
      "category": "models",
      "publishedAt": "2026-10-13T09:00:00Z"
    }]
  }'
```

- Fields: `url`, `title`, `summary` (max 280), `sourceName` and `category`
  (`models`, `tools`, `research`, `industry`) are required. Optional:
  `sourceType` (`blog`, `social`, `video`, `repo`, `paper`, `podcast`,
  `newsletter`, `other`; default `other`), `author`, `imageUrl`, `status`
  (`published` or `draft`; default `published`) and `publishedAt`.
- `publishedAt` is an ISO 8601 string with a time zone (`Z` or `+02:00`) and
  defaults to now. Numbers are rejected, as are dates more than an hour ahead.
- Up to 50 items per request. If any item is invalid, nothing is inserted and
  the response is `400` with the errors per field.
- The response has one result per item, in order:
  `{ "results": [{ "id": 42, "url": "https://example.com/post", "status": "created" }] }`.
  `status` is `duplicate` when the canonical URL was already there. The code is
  `201` when something was created, `200` when everything was a duplicate.
- Without the right token: `401`. If `AI_NEWS_INGEST_TOKEN` isn't configured,
  or is shorter than 32 characters, every request gets `401`.

The token is a worker secret. Generate one with `openssl rand -hex 32`, then
`npx wrangler secret put AI_NEWS_INGEST_TOKEN --config apps/blog-analog/wrangler.jsonc --env <env>`.
Locally, add `AI_NEWS_INGEST_TOKEN=...` to `apps/blog-analog/.dev.vars`.

## Running unit tests

Run `nx test api-ai-news`. The feed tests run against an in-memory libSQL
database migrated from `libs/blog-bff/shared/schema/drizzle`.
