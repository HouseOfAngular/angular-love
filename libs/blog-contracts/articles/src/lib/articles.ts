export const articleCategories = [
  'news',
  'guides',
  'recommended',
  'authors',
] as const;

export type ArticleCategory = (typeof articleCategories)[number];

export interface ArticlePreview {
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string;
  publishDate: string;
  readingTime: string;
  author: {
    name: string;
    slug: string;
    avatarUrl: string;
  };
}

export interface Article {
  title: string;
  content: string;
  publishDate: string;
  readingTime: string;
  author: {
    name: string;
    description: string;
    avatarUrl: string;
    position: string;
    slug: string;
  };
}
