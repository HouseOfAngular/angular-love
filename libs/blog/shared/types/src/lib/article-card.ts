export type ArticleCard = {
  title: string;
  publishDate: string;
  excerpt: string;
  slug: string;
  featuredImageUrl: string;
  readingTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  author: {
    name: string;
    avatarUrl: string;
  };
};
