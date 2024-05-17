export type ArticleCard = {
  title: string;
  publishDate: string;
  excerpt: string;
  slug: string;
  featuredImageUrl: string;
  readingTime: string;
  author: {
    name: string;
    avatarUrl: string;
  };
};
