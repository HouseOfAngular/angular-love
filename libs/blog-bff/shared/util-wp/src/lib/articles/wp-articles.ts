import { WPRespone, WPRestClient } from '../wp-client';

import { WPPostDetailsDto, WPPostDto } from './dtos';

export class WPArticles {
  constructor(private readonly _wpClient: WPRestClient) {}

  getAll(query?: {
    per_page?: string;
    page?: string;
    lang?: string;
    author_slug?: string;
  }): Promise<WPRespone<WPPostDto[]>> {
    return this._wpClient.get<WPPostDto[]>('posts', {
      ...query,
      _fields:
        'id,type,slug,title.rendered,author,excerpt.rendered,date,featured_image_url,author_details.name,author_details.avatar_url,author_details.slug,acf',
    });
  }

  getBySlug(slug: string): Promise<WPRespone<WPPostDetailsDto[]>> {
    return this._wpClient.get<WPPostDetailsDto[]>('posts', {
      slug,
      _fields:
        'id,type,slug,title.rendered,author,content.rendered,date,featured_image_url,author_details,acf',
    });
  }
}
