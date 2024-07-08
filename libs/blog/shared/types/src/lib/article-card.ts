export type ArticleCard = {
  title: string;
  publishDate: string | Date;
  excerpt: string;
  slug: string;
  featuredImageUrl: string | null;
  readingTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  author: {
    name: string;
    avatarUrl: string;
  };
};
