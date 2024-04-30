export interface ArticlePreview {
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string;
  publishDate: string;
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
