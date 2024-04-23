import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { cache } from 'hono/cache';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core';
import {
  GetPostBySlug,
  GetPosts,
  LanguageCodeFilterEnum,
} from '@angular-love/wp/graphql/data-access';
import { toArticle, toArticlePreviewList } from './mappers';

type Bindings = {
  GRAPHQL_URI: string;
  GRAPHQL_TOKEN: string;
};

type Variables = {
  apolloClient: ApolloClient<NormalizedCacheObject>;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', cors());

app.use(
  '*',
  cache({
    wait: false,
    cacheName: 'al-bff',
    cacheControl: 'max-age=3600',
  })
);

app.use('*', async (c, next) => {
  const client = new ApolloClient({
    uri: c.env.GRAPHQL_URI,
    cache: new InMemoryCache({
      addTypename: false,
    }),
    headers: {
      authorization: c.env.GRAPHQL_TOKEN,
    },
    ssrMode: true,
  });

  c.set('apolloClient', client);

  await next();
});

app.get('/articles', async (c) => {
  const result = await c.var.apolloClient.query({
    query: GetPosts,
    variables: {
      languages: LanguageCodeFilterEnum.En,
      first: 10,
    },
  });

  return c.json(toArticlePreviewList(result));
});

app.get('/articles/:slug', async (c) => {
  const slug = c.req.param('slug');

  const result = await c.var.apolloClient.query({
    query: GetPostBySlug,
    variables: {
      slug,
    },
  });

  return c.json(toArticle(result));
});

export default app;
