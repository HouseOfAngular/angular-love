import { WPResponse, WPRestClient } from '@angular-love/util-wp';

import { WPAuthorDto } from './dtos';

export class WpAuthors {
  constructor(private readonly _wpClient: WPRestClient) {}

  async getAuthors(
    query?: Record<string, string | number>,
  ): Promise<WPResponse<WPAuthorDto[]>> {
    return this._wpClient.get<WPAuthorDto[]>('users', {
      ...query,
      _fields: 'id,type,slug,name,description,avatar_urls,acf,titles',
    });
  }

  async getBySlug(slug: string): Promise<WPResponse<WPAuthorDto[]>> {
    return this._wpClient.get<WPAuthorDto[]>('users', {
      slug: slug,
      _fields: 'id,type,slug,name,description,avatar_urls,acf,titles',
      acf_format: 'standard',
    });
  }
}
