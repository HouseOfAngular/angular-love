import { Hono } from 'hono';
import { env } from 'hono/adapter';

import { langMw } from '@angular-love/blog-bff/shared/util-middleware';
import { Slider } from '@angular-love/blog/contracts/banners';
import { wpClientMw } from '@angular-love/util-wp';

import { toBanner } from './mappers';
import { WpBanners } from './wp-banners';

type Env = {
  Bindings: {
    DISABLE_CACHE?: string;
    CACHE_KV: KVNamespace;
  };
};

const app = new Hono<Env>().use(wpClientMw).use(langMw());

const bannersMock: Slider = {
  slideDisplayTimeMs: 9000,
  slides: [],
};

app.get('/', async (c) => {
  try {
    const client = new WpBanners(c.var.createWPClient());

    const banner = (
      await client.getBanners({
        skip_cache: 1,
      })
    ).data[0];
    const media = await client.getMediaByBannerId(banner.id);

    return c.json(toBanner(banner, media.data));
  } catch (e) {
    const cacheKv = env(c).CACHE_KV;
    const kvBanners = await cacheKv.get('banners');
    let banners: Slider;
    if (kvBanners) {
      try {
        banners = JSON.parse(kvBanners);
      } catch (e) {
        banners = bannersMock;
      }
    } else {
      banners = bannersMock;
    }

    return c.json(banners);
  }
});

export default app;
