import * as cheerio from 'cheerio';
import { defineEventHandler, getQuery, getRouterParam } from 'h3';

import { type WPRestClient } from '@angular-love/util-wp';

import { getLang } from '../../../../utils/lang';
import { createWpClient } from '../../../../utils/wp-client';

// WPPostDto is internal to the articles api lib (not exported publicly).
// Inlined here to avoid a deep import.
interface WPPostDto {
  date: string;
  slug: string;
  featured_image_url: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  author_details: { name: string; slug: string; avatar_url: string };
  acf: { reading_time: string | number; difficulty: string };
}

// Inlined from `libs/blog-bff/articles/api/src/lib/mappers.ts`
function toArticlePreviewList(dtos: WPPostDto[]) {
  return (dtos || []).map((dto) => {
    const summary = cheerio.load(dto.excerpt.rendered || '');
    const title = cheerio.load(dto.title.rendered || '');
    return {
      slug: dto.slug || '',
      title: title.text(),
      excerpt: summary.text(),
      featuredImageUrl: dto.featured_image_url || null,
      publishDate: new Date(dto.date || '').toISOString(),
      readingTime: dto.acf?.reading_time?.toString() || '5',
      difficulty: dto.acf?.difficulty || 'intermediate',
      author: {
        slug: dto.author_details?.slug || '',
        name: dto.author_details?.name || '',
        avatarUrl: dto.author_details?.avatar_url || '',
      },
    };
  });
}

const RELATED_FIELDS = [
  'id',
  'type',
  'slug',
  'title.rendered',
  'author',
  'excerpt.rendered',
  'date',
  'featured_image_url',
  'author_details.name',
  'author_details.avatar_url',
  'author_details.slug',
  'acf',
].join(',');

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!;
  const { limit } = getQuery(event) as Record<string, string>;
  const lang = getLang(event);
  const createWPClient = createWpClient(event);

  const client: WPRestClient = createWPClient({ namespace: 'yarpp/v1' });
  const result = await client.get<WPPostDto[]>(`related/${id}`, {
    lang,
    limit: (limit || '2') as string,
    status: 'publish',
    _fields: RELATED_FIELDS,
  });

  return {
    data: toArticlePreviewList(result.data),
    total: Number(result.headers.get('x-wp-total')),
  };
});
