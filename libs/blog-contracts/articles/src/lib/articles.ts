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
    slug: string;
    name: string;
    avatarUrl: string;
  };
}

export interface Article {
  title: string;
  content: string;
  publishDate: string;
  readingTime: string;
  author: {
    slug: string;
    name: string;
    avatarUrl: string;
    description: string;
  };
}

//TODO: move shared contract lib
export interface ArrayResponse<T> {
  data: T[];
  total: number;
}
