export interface Article {
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
