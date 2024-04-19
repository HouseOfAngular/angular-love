export type SmallArticleCardDataModel = {
  title: string;
  excerpt: string;
  slug: string;
  featuredImageUrl: string;
  readingTime: number;
  author: {
    name: string;
    avatarUrl: string;
  };
};
