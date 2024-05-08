import { ArticleCardDataModel } from '@angular-love/article-card-data-model';

import { AlgoliaArticleSearchResultDto } from './search-result.model';

export const mapToCardModel = (
  dto: AlgoliaArticleSearchResultDto,
): ArticleCardDataModel => {
  return {
    author: {
      avatarUrl: dto.post_author.user_avatar_url,
      name: dto.post_author.display_name,
    },
    excerpt: dto._highlightResult.content.value.slice(0, 150),
    featuredImageUrl: 'assets/mock-avatar.png', //TODO: Replace with real dto data
    publishDate: dto.post_date_formatted,
    readingTime: `${dto.reading_time || 0}`,
    slug: dto.post_slug,
    title: dto._highlightResult.post_title.value,
  };
};
