import { SearchOptions, SearchResponse } from '../models';

export abstract class SearchService {
  abstract search(
    query: string,
    options?: SearchOptions,
  ): Promise<SearchResponse>;
}
