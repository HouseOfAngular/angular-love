import * as cheerio from 'cheerio';

import { ArticlePreview } from '@angular-love/contracts/articles';

import { WPPostDto } from './dtos';

/**
 * WP's `date` is the site-local wall clock with no offset, so parsing it yields
 * an instant shifted by the site's timezone (2h in summer for Europe/Warsaw).
 * `date_gmt` is the real UTC instant but also carries no suffix, so it needs an
 * explicit `Z` before parsing.
 */
const toPublishDateIso = (dto: WPPostDto): string => {
  const utc = dto.date_gmt ? `${dto.date_gmt}Z` : dto.date;
  return new Date(utc || '').toISOString();
};

export const toArticlePreviewList = (dtos: WPPostDto[]): ArticlePreview[] => {
  return (dtos || []).map((dto) => {
    const summary = cheerio.load(dto.excerpt.rendered || '');
    const title = cheerio.load(dto.title.rendered || '');

    return {
      slug: dto.slug || '',
      title: title.text(),
      excerpt: summary.text(),
      featuredImageUrl: dto.featured_image_url || null,
      publishDate: toPublishDateIso(dto),
      readingTime: dto.acf?.reading_time?.toString() || '5',
      difficulty: dto.acf?.difficulty || 'intermediate',
      author: {
        slug: dto.author_details?.slug || '',
        name: dto.author_details?.name || '',
        avatarUrl: dto.author_details?.avatar_url || '',
      },
    };
  });
};
