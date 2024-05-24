import { AlgoliaSearchResult, SearchResult } from '../models';

export const mapHitToSearchResult = (
  dto: AlgoliaSearchResult,
): SearchResult => {
  return {
    author: {
      avatarUrl: dto.post_author.user_avatar_url,
      name: dto.post_author.display_name,
    },
    excerpt: dto._highlightResult.content.value.slice(0, 150),
    featuredImageUrl:
      dto.featured_image ||
      'https://testing.angular.love/wp-content/uploads/2022/12/Templatki-do-artykulów-12.png', // TODO: Replace with statically served placeholder image
    publishDate: dto.post_date_formatted,
    readingTime: `${dto.reading_time || 0}`,
    slug: dto.post_slug,
    title: dto._highlightResult.post_title.value,
    rawTitle: dto.post_title,
  };
};
