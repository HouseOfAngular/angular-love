import { defineEventHandler } from 'h3';

import { type Slider } from '@angular-love/blog/contracts/banners';
import { type WPRestClient } from '@angular-love/util-wp';

import { createWpClient } from '../../../utils/wp-client';

// WPBannerDto and WPBannerMediaDto are internal to the banners api lib
// (not publicly exported). Inlined here to avoid a deep import.
interface WPBannerDto {
  id: number;
  acf: {
    display_time: string;
    slides: { slide_image: number; slide_url: string }[] | null;
  };
}

interface WPBannerMediaDto {
  id: number;
  alt_text: string;
  guid: { rendered: string };
}

// Inlined from `libs/blog-bff/banners/api/src/lib/mappers.ts`
function toBanner(dto: WPBannerDto, mediaDto: WPBannerMediaDto[]): Slider {
  return {
    slideDisplayTimeMs: +dto.acf.display_time,
    slides:
      dto.acf.slides?.map((slide) => {
        const media = mediaDto.find((m) => m.id === slide.slide_image)!;
        return {
          url: media.guid.rendered,
          alt: media.alt_text,
          navigateTo: slide.slide_url,
        };
      }) ?? [],
  };
}

const bannersMock: Slider = {
  slideDisplayTimeMs: 9000,
  slides: [],
};

export default defineEventHandler(async (event) => {
  const createWPClient = createWpClient(event);

  try {
    const client: WPRestClient = createWPClient();

    const bannersResponse = await client.get<WPBannerDto[]>('banner', {
      skip_cache: '1',
      _fields: 'id,acf',
    });
    const banner = bannersResponse.data[0];

    const media = await client.get<WPBannerMediaDto[]>('media', {
      parent: `${banner.id}`,
      _fields: 'id,guid,alt_text',
    });

    return toBanner(banner, media.data);
  } catch {
    // Cloudflare KV cache fallback from the original Hono handler is not
    // available in Nitro outside of Cloudflare Workers. Return mock on error.
    return bannersMock;
  }
});
