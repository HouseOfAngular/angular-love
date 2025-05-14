import {
  searchClient,
  type SearchParams,
  type SearchResponse,
} from '@algolia/client-search';
import { inject, Injectable } from '@angular/core';

import { ALGOLIA_CLIENT_CONFIG } from './algolia.config';

@Injectable()
export class AlgoliaClientService {
  private readonly _config = inject(ALGOLIA_CLIENT_CONFIG);
  private readonly _algoliaClient = searchClient(
    this._config.applicationId,
    this._config.apKey,
  );

  search<T>(query: string, options?: SearchParams): Promise<SearchResponse<T>> {
    return this._algoliaClient.searchSingleIndex({
      indexName: this._config.indexName,
      searchParams: {
        query,
        ...options,
      },
    });
  }
}
