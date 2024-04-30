import { ArticleCardDataModel } from '@angular-love/article-card-data-model';
import { ArticleSearchResultDto } from '@angular-love/blog/search/data-access';

export const mapToCardModel = (
  dto: ArticleSearchResultDto,
): ArticleCardDataModel => {
  return {
    author: {
      avatarUrl: 'assets/mock-avatar.png', //TODO: Replace with real dto data
      name: dto.post_author.display_name,
    },
    excerpt: dto._highlightResult.content.value.slice(0, 150),
    featuredImageUrl: 'assets/mock-avatar.png', //TODO: Replace with real dto data
    publishDate: dto.post_date_formatted,
    readingTime: 3, //TODO: Replace with real dto data
    slug: 'slug', //TODO: Replace with real dto data
    title: dto._highlightResult.post_title.value,
  };
};
