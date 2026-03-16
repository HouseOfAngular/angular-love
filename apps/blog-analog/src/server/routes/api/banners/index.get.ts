import { defineEventHandler } from 'h3';

import { toBanner, WpBanners } from '@angular-love/blog-bff/banners/api';
import { type Slider } from '@angular-love/blog/contracts/banners';

import { getRequiredEnv } from '../../../utils/env';
import { createWpClient } from '../../../utils/wp-client';

const bannersMock: Slider = {
  slideDisplayTimeMs: 9000,
  slides: [],
};

export default defineEventHandler(async (event) => {
  const createWPClient = createWpClient(event);

  try {
    const client = new WpBanners(createWPClient());

    const banner = (
      await client.getBanners({
        skip_cache: 1,
      })
    ).data[0];
    const media = await client.getMediaByBannerId(banner.id);

    return toBanner(banner, media.data);
  } catch {
    const cacheKv = getRequiredEnv(event, 'CACHE_KV');
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

    return banners;
  }
});
