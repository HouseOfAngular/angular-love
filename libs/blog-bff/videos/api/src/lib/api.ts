import { Hono } from 'hono';

import { ArrayResponse } from '@angular-love/blog-contracts/shared';
import { VideoPreview } from '@angular-love/blog/contracts/videos';
import { getPagination, wpClientMw } from '@angular-love/util-wp';

import { mapWPVideoToVideoPreview } from './mappers';
import { WpVideos } from './wp-videos';

const app = new Hono().use(wpClientMw);

app.get('/', async (c) => {
  const queryParams = c.req.query();
  const { page, per_page } = getPagination(queryParams);

  const client = new WpVideos(c.var.createWPClient());

  const response = await client.getVideos({
    page,
    per_page,
  });

  return c.json(<ArrayResponse<VideoPreview>>{
    data: response.data.map(mapWPVideoToVideoPreview),
    total: Number(response.headers.get('x-wp-total')),
  });
});

export default app;
