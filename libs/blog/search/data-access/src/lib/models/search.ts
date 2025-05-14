export interface SearchResponse {
  results: SearchResult[];
  total: number | undefined;
  query: string;
}

export interface SearchResult {
  title: string;
  publishDate: Date;
  excerpt: string;
  slug: string;
  featuredImageUrl: string;
  readingTime: string;
  rawTitle: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  author: {
    name: string;
    avatarUrl: string;
  };
}

export type SearchOptions = {
  perPage?: number;
  page?: number;
};
