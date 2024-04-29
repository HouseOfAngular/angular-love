import { Hono } from 'hono';
import { wpClientMw } from '@angular-love/util-wp';
import { toArticlePreviewList, toArticle } from './mappers';
import { WPPostDetailsDto, WPPostDto } from './dtos';

const app = new Hono();

app.get('/', wpClientMw, async (c) => {
  const result = await c.var.wpClient.get<WPPostDto[]>('posts', {
    lang: 'en',
    per_page: '10',
    _fields:
      'slug,title.rendered,author,excerpt.rendered,date,featured_image_url,author_details.name,author_details.avatar_url,author_details.slug,acf',
  });

  return c.json(toArticlePreviewList(result));
});

app.get('/:slug', wpClientMw, async (c) => {
  const slug = c.req.param('slug');

  const result = await c.var.wpClient.get<WPPostDetailsDto[]>('posts', {
    slug: slug,
    _fields:
      'slug,title.rendered,author,content.rendered,date,featured_image_url,author_details,acf',
  });

  return c.json(toArticle(result[0]));
});

export default app;
