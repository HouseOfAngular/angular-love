import type { Hit } from '@algolia/client-search';

import { AlgoliaSearchResult, SearchResult } from '../models';

export const mapHitToSearchResult = (
  dto: Hit<AlgoliaSearchResult>,
): SearchResult => {
  return {
    author: {
      avatarUrl: dto.post_author.user_avatar_url,
      name: dto.post_author.display_name,
    },
    excerpt: dto._highlightResult.content.value.slice(0, 150),
    featuredImageUrl: dto.featured_image || 'assets/article-placeholder.webp',
    publishDate: new Date(dto.post_date * 1000),
    readingTime: `${dto.reading_time || 5}`,
    difficulty: 'intermediate', // TODO reindex algolia
    slug: dto.post_slug,
    title: dto._highlightResult.post_title.value,
    rawTitle: dto.post_title,
  };
};
