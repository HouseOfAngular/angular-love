import { WPResponse, WPRestClient } from '@angular-love/util-wp';

import { WPBannerDto, WPBannerMediaDto } from './dtos';

export class WpBanners {
  constructor(private readonly _wpClient: WPRestClient) {}

  async getBanners(
    query?: Record<string, string | number>,
  ): Promise<WPResponse<WPBannerDto[]>> {
    return this._wpClient.get<WPBannerDto[]>('banner', {
      ...query,
      _fields: 'id,acf',
    });
  }

  async getMediaByBannerId(
    bannerId: number,
  ): Promise<WPResponse<WPBannerMediaDto[]>> {
    return this._wpClient.get<WPBannerMediaDto[]>('media', {
      parent: `${bannerId}`,
      _fields: 'id,guid,alt_text',
    });
  }
}
