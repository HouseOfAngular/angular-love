export type ArticleCardDataModel = {
  title: string;
  excerpt: string;
  slug: string;
  featuredImageUrl: string;
  readingTime: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  publishDate: string;
};
