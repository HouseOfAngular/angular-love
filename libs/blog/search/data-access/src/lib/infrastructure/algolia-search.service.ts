import { inject, Injectable } from '@angular/core';

import { AlgoliaClientService } from '@angular-love/shared/utils-algolia';

import { AlgoliaSearchResult, SearchOptions, SearchResponse } from '../models';
import { mapHitToSearchResult } from '../utils';

import { SearchService } from './search.service';

@Injectable()
export class AlgoliaSearchService implements SearchService {
  private readonly _algoliaService = inject(AlgoliaClientService);

  async search(
    query: string,
    options?: SearchOptions,
  ): Promise<SearchResponse> {
    return this._algoliaService
      .search<AlgoliaSearchResult>(query, {
        restrictSearchableAttributes: ['post_title'],
        hitsPerPage: options?.perPage,
        page: options?.page,
      })
      .then((result) => {
        return {
          total: result.nbHits,
          query: result.query,
          results: result.hits.map(mapHitToSearchResult),
        };
      });
  }
}
