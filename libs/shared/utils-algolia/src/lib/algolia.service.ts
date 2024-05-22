import type { SearchOptions, SearchResponse } from '@algolia/client-search';
import { inject, Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch/lite';

import { ALGOLIA_CLIENT_CONFIG } from './algolia.config';

@Injectable()
export class AlgoliaClientService {
  private readonly _config = inject(ALGOLIA_CLIENT_CONFIG);
  private readonly _algoliaClient = algoliasearch(
    this._config.applicationId,
    this._config.apKey,
  );
  private readonly _index = this._algoliaClient.initIndex(
    this._config.indexName,
  );

  search<T>(
    query: string,
    options?: SearchOptions,
  ): Promise<SearchResponse<T>> {
    return this._index.search(query, options);
  }
}
