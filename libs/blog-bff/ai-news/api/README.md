# api-ai-news

Server side of the AI news feed: Zod schemas for the API boundary, the keyset
paginated feed query (`getAiNewsFeed`), the opaque cursor, the item lookup
(`getAiNewsItem`) and `insertAiNewsItems` (validates, canonicalizes the URL,
skips duplicates).

Routes, in `apps/blog-analog/src/server/routes/api/ai-news/`:

- `GET /api/ai-news?cursor=&limit=&category=`: the public feed. Items carry
  the `excerpt` (the card text), not the summary.
- `GET /api/ai-news/:slug`: one published item with its full `summary`, for
  the item panel (`/ai-news/<slug>`). `404` for drafts and unknown slugs.
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
      "slug": "example-lab-ships-a-new-model",
      "excerpt": "One or two sentences for the card, up to 280 characters.",
      "summary": "The full summary, up to 4000 characters.\n\n- Key point one\n- Key point two",
      "sourceName": "Example Lab",
      "sourceType": "blog",
      "category": "models",
      "publishedAt": "2026-10-13T09:00:00Z"
    }]
  }'
```

- Fields: `url`, `title`, `summary` (max 4000), `sourceName` and `category`
  (`models`, `tools`, `research`, `industry`) are required. Optional:
  `slug`, `excerpt` (max 280), `sourceType` (`blog`, `social`, `video`, `repo`,
  `paper`, `podcast`, `newsletter`, `other`; default `other`), `author`,
  `imageUrl`, `status` (`published` or `draft`; default `published`) and
  `publishedAt`.
- `summary` is plain text: blank lines separate paragraphs, lines starting with
  `- ` form a list, and nothing else is markup (HTML shows as text). A good
  summary is a short overview, 3–5 key points and why it matters to Angular
  developers.
- `slug` is the item's address, `/ai-news/<slug>`: lowercase letters, digits
  and single dashes, up to 100 characters. Without it, it's made from the
  title.
- Send an `excerpt`: without one, the card shows the start of the summary, cut
  at 280 characters.
- `publishedAt` is an ISO 8601 string with a time zone (`Z` or `+02:00`) and
  defaults to now. Numbers are rejected, as are dates more than an hour ahead.
- Up to 50 items per request. If any item is invalid, nothing is inserted and
  the response is `400` with the errors per field.
- The response has one result per item, in order:
  `{ "results": [{ "status": "created", "id": 42, "url": "https://example.com/post", "slug": "example-lab-ships-a-new-model" }] }`.
  An item whose canonical URL or slug is already taken (stored, or earlier in
  the same request) isn't inserted and comes back as
  `{ "status": "duplicate", "url": …, "slug": … }`. The code is `201` when
  something was created, `200` when everything was a duplicate.
- Without the right token: `401`. If `AI_NEWS_INGEST_TOKEN` isn't configured,
  or is shorter than 32 characters, every request gets `401`.

The token is a worker secret. `Jenkinsfile.deploy` uploads it on every deploy
(dev, PR previews and prod) from the Jenkins credential `al_ai_news_ingest_token`;
generate a new value with `openssl rand -hex 32`.

The worker's regular database token is read-only, so this route writes with
`TURSO_EU_WRITE_AUTH_TOKEN` (Jenkins credential `turso-eu-write-token`, a
full-access token for the `blog-eu` group, so it also works on PR preview
databases). No other route uses it. Locally, both routes use `TURSO_LOCAL`. Locally, add `AI_NEWS_INGEST_TOKEN=...` to `apps/blog-analog/.dev.vars`.

## Running unit tests

Run `nx test api-ai-news`. The feed tests run against an in-memory libSQL
database migrated from `libs/blog-bff/shared/schema/drizzle`.
