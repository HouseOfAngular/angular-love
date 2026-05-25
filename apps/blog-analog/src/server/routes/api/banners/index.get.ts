import { defineEventHandler } from 'h3';

import { toBanner, WpBanners } from '@angular-love/blog-bff/banners/api';
import { type Slider } from '@angular-love/blog/contracts/banners';

import { CACHE_KEYS } from '../../../utils/cache-keys';
import { getRequiredEnv } from '../../../utils/env';
import { createWpClient } from '../../../utils/wp-client';

const bannersMock: Slider = {
  slideDisplayTimeMs: 9000,
  slides: [],
};

const CACHE_TTL = 43_200;

export default defineEventHandler(async (event) => {
  const CACHE_KV = getRequiredEnv(event, 'CACHE_KV');

  if (!CACHE_KV) {
    return bannersMock;
  }

  try {
    const kvBanners = await CACHE_KV.get(CACHE_KEYS.banners);

    if (kvBanners) {
      return JSON.parse(kvBanners);
    }

    const createWPClient = createWpClient(event);
    const client = new WpBanners(createWPClient());

    const bannerDto = (
      await client.getBanners({
        skip_cache: 1,
      })
    ).data[0];

    const slideImageIds = bannerDto.acf.slides?.map(
      (slide) => slide.slide_image,
    );

    if (!slideImageIds) {
      event.waitUntil(
        CACHE_KV.put(CACHE_KEYS.banners, JSON.stringify(bannersMock), {
          expirationTtl: CACHE_TTL,
        }),
      );
      return bannersMock;
    }

    const media = await client.getMediaByIds(slideImageIds);

    const banners = toBanner(bannerDto, media.data);

    event.waitUntil(
      CACHE_KV.put(CACHE_KEYS.banners, JSON.stringify(banners), {
        expirationTtl: CACHE_TTL,
      }),
    );

    return banners;
  } catch (e) {
    console.error(e);
    return bannersMock;
  }
});
