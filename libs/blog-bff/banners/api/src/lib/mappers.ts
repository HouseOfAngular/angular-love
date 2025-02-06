import { Banners } from '@angular-love/blog/contracts/banners';

import { WPBannerDto, WPBannerMediaDto } from './dtos';

export const toBanner = (
  dto: WPBannerDto,
  mediaDto: WPBannerMediaDto[],
): Banners => {
  return {
    ...(dto.acf.is_slider_banner_displayed && {
      slider: {
        slideDisplayTimeMs: +dto.acf.display_time,
        slides: dto.acf.slides.map((slide) => {
          const media = mediaDto.find(
            (media) => media.id === slide.slide_image_desktop,
          )!;
          return {
            url: media?.guid.rendered,
            alt: media?.alt_text,
            navigateTo: slide.slide_url,
          };
        }),
      },
    }),
    ...(dto.acf.is_top_banner_displayed && {
      topBanner: {
        url: mediaDto.find(
          (media) => media.id === dto.acf.top_banner_image_desktop,
        )?.guid.rendered,
        alt: mediaDto.find(
          (media) => media.id === dto.acf.top_banner_image_desktop,
        )?.alt_text,
        navigateTo: dto.acf.top_banner_image_url,
      },
    }),
    ...(dto.acf.is_card_banner_displayed && {
      cardBanner: {
        url: mediaDto.find((media) => media.id === dto.acf.card_banner_image)
          ?.guid.rendered,
        alt: mediaDto.find((media) => media.id === dto.acf.card_banner_image)
          ?.alt_text,
        navigateTo: dto.acf.card_banner_url,
      },
    }),
  };
};
