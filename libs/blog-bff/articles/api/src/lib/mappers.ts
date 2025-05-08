import * as cheerio from 'cheerio';

import { ArticlePreview } from '@angular-love/contracts/articles';

import { WPPostDto } from './dtos';

export const toArticlePreviewList = (dtos: WPPostDto[]): ArticlePreview[] => {
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
};
