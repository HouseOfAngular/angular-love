import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { SearchListStore } from '@angular-love/blog/search/data-access';

function injectRouteSearchParams() {
  const { snapshot, queryParamMap } = inject(ActivatedRoute);
  const page = Number(snapshot.queryParamMap.get('page')) || 1;
  const query = snapshot.queryParamMap.get('q') || '';
  const query$ = queryParamMap.pipe(map((params) => params.get('q') || ''));
  const page$ = queryParamMap.pipe(map((params) => params.get('page') || 1));
  return { page, query, query$, page$ };
}

@Injectable()
export class SearchResultsPagePresenter {
  readonly searchStore = inject(SearchListStore);
  readonly routeParams = injectRouteSearchParams();

  readonly pagination = signal({
    skip: (this.routeParams.page - 1) * this.searchStore.pageSize(),
    take: this.searchStore.pageSize(),
  });
  readonly searchPayload = computed(() => ({
    page: this._page(),
    query: this._query(),
  }));

  private readonly _query = toSignal(this.routeParams.query$, {
    initialValue: this.routeParams.query,
  });
  private readonly _page = computed(() => {
    const { skip, take } = this.pagination();
    return Math.floor(skip / take);
  });
}
