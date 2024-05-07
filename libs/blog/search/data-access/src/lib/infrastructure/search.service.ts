import { SearchResponse } from '@algolia/client-search';
import { inject, Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch';

import { ConfigService } from '@angular-love/shared/config';

import { AlgoliaArticleSearchResultDto } from '../models/search-result.model';

@Injectable()
export class SearchService {
  private readonly _config = inject(ConfigService);

  private readonly _algoliaApplicationId = this._config.get<string>(
    'alAlgoliaApplicationId',
  );

  private readonly _algoliaApiKey = this._config.get<string>('alAlgoliaApiKey');

  private readonly _algoliaIndexName =
    this._config.get<string>('alAlgoliaIndexName');

  private readonly _algoliaClient = algoliasearch(
    this._algoliaApplicationId,
    this._algoliaApiKey,
  );

  private readonly _index = this._algoliaClient.initIndex(
    this._algoliaIndexName,
  );

  searchArticles(
    searchQuery: string,
    page: number,
  ): Promise<SearchResponse<AlgoliaArticleSearchResultDto>> {
    return this._index
      .search<AlgoliaArticleSearchResultDto>(searchQuery, {
        hitsPerPage: 6,
        restrictSearchableAttributes: ['post_title'],
        page,
      })
      .then((r) => r);
  }
}
