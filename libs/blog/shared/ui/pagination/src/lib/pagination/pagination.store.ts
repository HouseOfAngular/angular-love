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
  edge: number;
};

const initialState: PaginationState = {
  skip: 0,
  pageSize: 0,
  total: 0,
  edge: 3,
};

export const paginationStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    setSkip: rxMethod<number>(tap((skip) => patchState(store, { skip }))),
    setPageSize: rxMethod<number>(
      tap((pageSize) => patchState(store, { pageSize })),
    ),
    setTotal: rxMethod<number>(tap((total) => patchState(store, { total }))),
    setPage: (page: number) =>
      patchState(store, { skip: (page - 1) * store.pageSize() }),
    setNextPage: () =>
      patchState(store, { skip: store.skip() + store.pageSize() }),
    setPreviousPage: () =>
      patchState(store, { skip: store.skip() - store.pageSize() }),
  })),
  withComputed(({ skip, total, pageSize, edge }) => ({
    disabledPrevious: computed(() => skip() === 0),
    disabledNext: computed(() => skip() + pageSize() >= total()),
    pages: computed((): Page[] => {
      const last = Math.ceil(total() / pageSize());
      const current = Math.ceil(skip() / pageSize()) + 1;

      return constructPagesArray({ current, last, edge: edge() });
    }),
  })),
);

function constructPagesArray(params: {
  current: number;
  last: number;
  edge: number;
}): Page[] {
  const pageNumbers = Array.from({ length: params.last }, (_, i) => i + 1);

  return pageNumbers.reduce((acc, i) => {
    const isWithinEdgeRange =
      i > params.current - params.edge && i < params.current + params.edge;
    const isFirstOrLastPage = i === 1 || i === pageNumbers.length;
    const isCurrentPage = i === params.current;

    if (isFirstOrLastPage || isCurrentPage || isWithinEdgeRange) {
      acc.push({
        index: i,
        isActive: isCurrentPage,
        label: `${i}`,
      });
    } else if (acc[acc.length - 1]?.label !== '...') {
      acc.push({
        index: i,
        isActive: false,
        label: '...',
      });
    }
    return acc;
  }, [] as Page[]);
}
