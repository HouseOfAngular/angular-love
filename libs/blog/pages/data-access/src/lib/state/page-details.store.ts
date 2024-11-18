import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';

import { Page } from '@angular-love/blog/contracts/pages';
import { withLangState } from '@angular-love/blog/i18n/data-access';
import { withSeo } from '@angular-love/seo';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';

import { PageService } from '../infrastructure/page.service';

type PageDetailsState = {
  slug: string | null;
  pageDetails: Page | null;
};

const initialState: PageDetailsState = {
  slug: null,
  pageDetails: null,
};

export const PageDetailsStore = signalStore(
  { providedIn: 'root' },
  withSeo(),
  withState(initialState),
  withCallState('fetch page details'),
  withLangState(),
  withMethods(({ ...store }) => {
    const pageService = inject(PageService);
    return {
      fetchPageDetails: rxMethod<string | undefined>(
        pipe(
          filter((slug): slug is string => !!slug && slug !== store.slug()),
          tap((slug) =>
            patchState(store, {
              slug: slug,
              fetchPageDetailsCallState: LoadingState.LOADING,
              pageDetails: null,
            }),
          ),
          switchMap((slug) =>
            pageService.getPage(slug as string).pipe(
              tapResponse({
                error: (error) =>
                  patchState(store, {
                    slug: slug as string,
                    fetchPageDetailsCallState: { error },
                  }),
                next: (pageDetails) => {
                  return patchState(store, {
                    pageDetails,
                    slug: slug as string,
                    fetchPageDetailsCallState: LoadingState.LOADED,
                  });
                },
              }),
            ),
          ),
        ),
      ),
      reset: () => {
        return patchState(store, initialState);
      },
    };
  }),
  withComputed(({ pageDetails, lang }) => ({
    alternativeLanguageSlug: computed(() => {
      return pageDetails()?.otherTranslations.find((t) =>
        t.locale.includes(lang()),
      )?.slug;
    }),
  })),
);
