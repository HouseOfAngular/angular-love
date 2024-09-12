import { WPResponse, WPRestClient } from '@angular-love/util-wp';

import { WPPageDto } from './dtos';

export class WpPages {
  constructor(private readonly _wpClient: WPRestClient) {}

  getPages(): Promise<WPResponse<WPPageDto[]>> {
    return this._wpClient.get<WPPageDto[]>('pages', {});
  }

  getBySlug(slug: string): Promise<WPResponse<WPPageDto[]>> {
    return this._wpClient.get('pages', { slug: slug });
  }
}
