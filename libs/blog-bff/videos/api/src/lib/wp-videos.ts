import { WPResponse, WPRestClient } from '@angular-love/util-wp';

import { WPVideoDto } from './dtos';

export class WpVideos {
  constructor(private readonly _wpClient: WPRestClient) {}

  getVideos(
    query?: Record<string, string | number>,
  ): Promise<WPResponse<WPVideoDto[]>> {
    return this._wpClient.get<WPVideoDto[]>('yt-video', {
      ...query,
      _fields: 'id,acf,title',
    });
  }
}
