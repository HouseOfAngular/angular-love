import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core';
import {
  GetPosts,
  LanguageCodeFilterEnum,
} from '@angular-love/wp/graphql/data-access';
import { toArticlePreviewList } from './mappers';

type Bindings = {
  GRAPHQL_URI: string;
  GRAPHQL_TOKEN: string;
};

type Variables = {
  apolloClient: ApolloClient<NormalizedCacheObject>;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', cors());

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

export default app;
