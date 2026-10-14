import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';

import { AiNewsItemDetail } from '@angular-love/blog/contracts/ai-news';
import { AlLocalizeService } from '@angular-love/blog/i18n/util';
import { withSeo } from '@angular-love/seo';
import { ConfigService } from '@angular-love/shared/config';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';

import { AiNewsService } from './ai-news.service';

type AiNewsItemState = {
  item: AiNewsItemDetail | null;
};

const initialState: AiNewsItemState = { item: null };

/** One item with its full summary, for the item panel. */
export const AiNewsItemStore = signalStore(
  withSeo(),
  withState(initialState),
  withCallState('fetch item'),
  withComputed((store) => ({
    /** No published item has that slug. */
    isNotFound: computed(() => {
      const state = store.fetchItemCallState();
      return (
        typeof state === 'object' &&
        state.error instanceof HttpErrorResponse &&
        state.error.status === 404
      );
    }),
  })),
  withMethods(
    (
      store,
      aiNewsService = inject(AiNewsService),
      localize = inject(AlLocalizeService),
      transloco = inject(TranslocoService),
      baseUrl = inject(ConfigService).get<string>('baseUrl'),
    ) => ({
      loadItem: rxMethod<string>(
        pipe(
          tap(() => {
            store.resetPageSeo();
            patchState(store, {
              item: null,
              fetchItemCallState: LoadingState.LOADING,
            });
          }),
          switchMap((slug) =>
            aiNewsService.getItem(slug).pipe(
              tap((item) => {
                const path = localize.localizePath(`/ai-news/${item.slug}`);
                store.setNoIndexPageSeo({
                  title: `${item.title} - ${transloco.translate('seo.aiNews')}`,
                  description: item.excerpt,
                  pageUrl: `${baseUrl}${path}`,
                });
                patchState(store, {
                  item,
                  fetchItemCallState: LoadingState.LOADED,
                });
              }),
              catchError((error) => {
                store.resetPageSeo();
                patchState(store, { fetchItemCallState: { error } });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
