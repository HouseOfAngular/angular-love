export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}

export interface SearchResult {
  title: string;
  publishDate: string;
  excerpt: string;
  slug: string;
  featuredImageUrl: string;
  readingTime: string;
  rawTitle: string;
  author: {
    name: string;
    avatarUrl: string;
  };
}

export type SearchOptions = {
  perPage?: number;
  page?: number;
};
