import { ConfigService } from '@angular-love/shared/config';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch';

@Injectable()
export class SearchService {
  private readonly config = inject(ConfigService);

  private readonly _algoliaApplicationId = this.config.get<string>(
    'algoliaApplicationId',
  );

  private readonly _algoliaApiKey = this.config.get<string>('algoliaApiKey');

  private readonly _algoliaIndexName =
    this.config.get<string>('algoliaIndexName');

  private readonly _apiBaseUrl = `https://${this._algoliaApplicationId}-dsn.algolia.net/1/indexes/${this._algoliaIndexName}/query`;

  private readonly _http = inject(HttpClient);

  lol = algoliasearch(this._algoliaApplicationId, this._algoliaApiKey);

  searchArticles(searchQuery: string): void {
    const formData = new FormData();
    formData.append('query', searchQuery);
    formData.append('indexName', this._algoliaIndexName);

    this.lol
      .search([
        {
          indexName: this._algoliaIndexName,
          query: searchQuery,
          params: {
            restrictSearchableAttributes: ['post_title'],
          },
        },
      ])
      .then((res) => {
        console.log(res.results);
      });
  }
}
