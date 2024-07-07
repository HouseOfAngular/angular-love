import { WPResponse, WPRestClient } from '@angular-love/util-wp';

import { WPPostDetailsDto, WPPostDto } from './dtos';

export class WpPosts {
  constructor(private readonly _wpClient: WPRestClient) {}

  getPosts(
    query: Record<string, string | number>,
  ): Promise<WPResponse<WPPostDto[]>> {
    return this._wpClient.get<WPPostDto[]>('posts', {
      ...query,
      status: 'publish',
      _fields:
        'id,type,slug,title.rendered,author,excerpt.rendered,date,featured_image_url,author_details.name,author_details.avatar_url,author_details.slug,acf',
    });
  }

  getRelatedPosts(
    id: string,
    query: Record<string, string | number>,
  ): Promise<WPResponse<WPPostDto[]>> {
    return this._wpClient.get<WPPostDto[]>(`related/${id}`, {
      ...query,
      status: 'publish',
      _fields:
        'id,type,slug,title.rendered,author,excerpt.rendered,date,featured_image_url,author_details.name,author_details.avatar_url,author_details.slug,acf',
    });
  }

  getBySlug(slug: string): Promise<WPResponse<WPPostDetailsDto>> {
    const yoast_props = [
      'title',
      'description',
      'robots',
      'canonical',
      'og_locale',
      'og_type',
      'og_title',
      'og_description',
      'og_url',
      'og_site_name',
      'article_publisher',
      'article_modified_time',
      'og_image',
      'twitter_card',
      'twitter_misc',
    ]
      .map((p) => `yoast_head_json.${p}`)
      .join(',');

    return this._wpClient.get<WPPostDetailsDto>(`posts/${slug}`, {
      _fields: `id,type,slug,title.rendered,author,content.rendered,date,featured_image_url,author_details,acf,other_translations,lang,${yoast_props}`,
    });
  }
}
