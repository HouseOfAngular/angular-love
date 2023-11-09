export interface ArticlePreview {
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string;
  publishDate: string;
  author: {
    name: string;
    avatarUrl: string;
  };
}

export interface Article {
  title: string;
  content: string;
  publishDate: string;
  author: {
    name: string;
    avatarUrl: string;
    description: string;
  };
}
