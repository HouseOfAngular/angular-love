import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tap } from 'rxjs';
import { computed } from '@angular/core';

export type Page = {
  index: number;
  isActive: boolean;
  label: string;
};
type PaginationState = {
  skip: number;
  pageSize: number;
  total: number;
};

export const paginationStore = signalStore(
  withState<PaginationState>({
    skip: 0,
    pageSize: 0,
    total: 0,
  }),
  withMethods((store) => ({
    setSkip: rxMethod<number>(tap((skip) => patchState(store, { skip }))),
    setPageSize: rxMethod<number>(
      tap((pageSize) => patchState(store, { pageSize }))
    ),
    setTotal: rxMethod<number>(tap((total) => patchState(store, { total }))),
    setPage: (page: number) =>
      patchState(store, { skip: (page - 1) * store.pageSize() }),
    setNextPage: () =>
      patchState(store, { skip: store.skip() + store.pageSize() }),
    setPreviousPage: () =>
      patchState(store, { skip: store.skip() - store.pageSize() }),
  })),
  withComputed((store) => ({
    current: computed(() => Math.ceil(store.skip() / store.pageSize()) + 1),
    last: computed(() => Math.ceil(store.total() / store.pageSize())),
    disabledPrevious: computed(() => store.skip() === 0),
    disabledNext: computed(
      () => store.skip() + store.pageSize() >= store.total()
    ),

    pages: computed((): Page[] => {
      const edge = 3;
      const pages = [];
      const last = Math.ceil(store.total() / store.pageSize());
      const current = Math.ceil(store.skip() / store.pageSize()) + 1;

      for (let i = 1; i <= last; i++) {
        if (
          i === 1 ||
          i === last ||
          i === current ||
          (i > current - edge && i < current + edge)
        ) {
          pages.push({
            index: i,
            isActive: i === current,
            label: `${i}`,
          });
        } else if (pages[pages.length - 1].label !== '...') {
          pages.push({
            index: i,
            isActive: false,
            label: '...',
          });
        }
      }
      return pages;
    }),
  }))
);
