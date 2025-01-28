import { Slider } from '@angular-love/blog/contracts/banners';

import { WPBannerDto, WPBannerMediaDto } from './dtos';

export const toBanner = (
  dto: WPBannerDto,
  mediaDto: WPBannerMediaDto[],
): Slider => {
  return {
    slideDisplayTimeMs: +dto.acf.display_time,
    slides:
      dto.acf.slides?.map((slide) => {
        const media = mediaDto.find((media) => media.id === slide.slide_image)!;
        return {
          url: media.guid.rendered,
          alt: media.alt_text,
          navigateTo: slide.slide_url,
        };
      }) ?? [],
  };
};
