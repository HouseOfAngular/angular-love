import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { AlgoliaClientService } from '@angular-love/shared/utils-algolia';
import { convertLangToLocale } from '@angular-love/shared/utils-i18n';

import { AlgoliaSearchResult, SearchOptions, SearchResponse } from '../models';
import { mapHitToSearchResult } from '../utils';

import { SearchService } from './search.service';

@Injectable()
export class AlgoliaSearchService implements SearchService {
  private readonly _algoliaService = inject(AlgoliaClientService);
  private readonly _transloco = inject(TranslocoService);

  async search(
    query: string,
    options?: SearchOptions,
  ): Promise<SearchResponse> {
    const locale = convertLangToLocale(this._transloco.getActiveLang());
    // English content is indexed under en_GB
    const algoliaLocale = locale === 'en_US' ? 'en_GB' : locale;

    return this._algoliaService
      .search<AlgoliaSearchResult>(query, {
        filters: `locale: "${algoliaLocale}"`,
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
