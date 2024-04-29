import { SearchResponse } from '@algolia/client-search';
import { ConfigService } from '@angular-love/shared/config';
import { Injectable, inject } from '@angular/core';
import algoliasearch from 'algoliasearch';
import { ArticleSearchResultDto } from '../models/search-result.model';

@Injectable()
export class SearchService {
  private readonly config = inject(ConfigService);

  private readonly _algoliaApplicationId = this.config.get<string>(
    'algoliaApplicationId',
  );

  private readonly _algoliaApiKey = this.config.get<string>('algoliaApiKey');

  private readonly _algoliaIndexName =
    this.config.get<string>('algoliaIndexName');

  private readonly _algoliaClient = algoliasearch(
    this._algoliaApplicationId,
    this._algoliaApiKey,
  );

  private readonly index = this._algoliaClient.initIndex(
    this._algoliaIndexName,
  );

  searchArticles(
    searchQuery: string,
  ): Promise<SearchResponse<ArticleSearchResultDto>> {
    return this.index
      .search<ArticleSearchResultDto>(searchQuery, {
        hitsPerPage: 3,
        restrictSearchableAttributes: ['post_title'],
      })
      .then((r) => {
        console.log(r);
        return r;
      });
  }
}
