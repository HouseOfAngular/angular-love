import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, exhaustMap, pipe, switchMap, tap } from 'rxjs';

import {
  AiNewsCategory,
  AiNewsItem,
} from '@angular-love/blog/contracts/ai-news';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';

import { AiNewsService } from './ai-news.service';

type AiNewsFeedState = {
  category: AiNewsCategory | null;
  items: AiNewsItem[];
  nextCursor: string | null;
};

const initialState: AiNewsFeedState = {
  category: null,
  items: [],
  nextCursor: null,
};

/** The feed's first page (`fetch feed`) and the pages appended by "Load more" (`fetch more`). */
export const AiNewsFeedStore = signalStore(
  { protectedState: false }, withState(initialState),
  withCallState('fetch feed'),
  withCallState('fetch more'),
  withMethods((store, aiNewsService = inject(AiNewsService)) => {
    const loadFeed = rxMethod<AiNewsCategory | null>(
      pipe(
        tap((category) =>
          patchState(store, {
            category,
            items: [],
            nextCursor: null,
            fetchFeedCallState: LoadingState.LOADING,
            fetchMoreCallState: LoadingState.INIT,
          }),
        ),
        switchMap((category) =>
          aiNewsService.getFeed({ category: category ?? undefined }).pipe(
            tap(({ items, nextCursor }) =>
              patchState(store, {
                items,
                nextCursor,
                fetchFeedCallState: LoadingState.LOADED,
              }),
            ),
            catchError((error) => {
              patchState(store, { fetchFeedCallState: { error } });
              return EMPTY;
            }),
          ),
        ),
      ),
    );

    const loadMore = rxMethod<void>(
      exhaustMap(() => {
        const cursor = store.nextCursor();
        if (!cursor) {
          return EMPTY;
        }
        patchState(store, { fetchMoreCallState: LoadingState.LOADING });
        return aiNewsService
          .getFeed({ category: store.category() ?? undefined, cursor })
          .pipe(
            tap(({ items, nextCursor }) =>
              patchState(store, {
                items: [...store.items(), ...items],
                nextCursor,
                fetchMoreCallState: LoadingState.LOADED,
              }),
            ),
            catchError((error) => {
              patchState(store, { fetchMoreCallState: { error } });
              return EMPTY;
            }),
          );
      }),
    );

    return {
      loadFeed,
      loadMore,
      /** Repeats whichever request failed. */
      retry(): void {
        if (store.isFetchMoreError()) {
          loadMore();
        } else {
          loadFeed(store.category());
        }
      },
    };
  }),
);
