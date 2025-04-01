import { Hono } from 'hono';

import { langMw } from '@angular-love/blog-bff/shared/util-middleware';
import { wpClientMw } from '@angular-love/util-wp';

import { toBanner } from './mappers';
import { WpBanners } from './wp-banners';

const app = new Hono().use(wpClientMw).use(langMw());

app.get('/', async (c) => {
  const client = new WpBanners(c.var.createWPClient());

  const banner = (await client.getBanners()).data[0];
  const media = await client.getMediaByBannerId(banner.id);

  return c.json(toBanner(banner, media.data));
});

export default app;
