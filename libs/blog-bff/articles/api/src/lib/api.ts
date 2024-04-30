import { Hono } from 'hono';
import { wpClientMw } from '@angular-love/util-wp';
import { toArticle, toArticlePreviewList } from './mappers';
import { WPPostDetailsDto, WPPostDto } from './dtos';
import {
  ArrayResponse,
  ArticlePreview,
} from '@angular-love/contracts/articles';

const app = new Hono();

const defaultQuery = {
  skip: '0',
  take: '10',
  lang: 'en',
};

app.get('/', wpClientMw, async (c) => {
  const queryParams = c.req.query();

  const take = queryParams.take || defaultQuery.take;
  const skip = queryParams.skip || defaultQuery.skip;
  const page = Math.floor(Number(skip) / Number(take)) + 1;

  const query: Record<string, string | number> = {
    lang: queryParams.lang || defaultQuery.lang,
    per_page: take,
    page: page,
  };

  if (queryParams.authorSlug) {
    const authorResult = await c.var.wpClient.get<{ id }[]>('users', {
      slug: queryParams.authorSlug,
      _fields: 'id,type',
    });
    const id = authorResult.data[0]?.id;
    if (id) {
      query.author = id;
    }
  }

  const result = await c.var.wpClient.get<WPPostDto[]>('posts', {
    ...query,
    _fields:
      'id,type,slug,title.rendered,author,excerpt.rendered,date,featured_image_url,author_details.name,author_details.avatar_url,author_details.slug,acf',
  });

  return c.json(<ArrayResponse<ArticlePreview>>{
    data: toArticlePreviewList(result.data),
    total: Number(result.headers.get('x-wp-total')),
  });
});

app.get('/:slug', wpClientMw, async (c) => {
  const slug = c.req.param('slug');

  const result = await c.var.wpClient.get<WPPostDetailsDto[]>('posts', {
    slug: slug,
    _fields:
      'id,type,slug,title.rendered,author,content.rendered,date,featured_image_url,author_details,acf',
  });

  return c.json(toArticle(result.data[0]));
});

export default app;
