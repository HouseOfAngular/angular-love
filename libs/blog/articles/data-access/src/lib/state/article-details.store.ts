import { computed, inject, InjectionToken } from '@angular/core';
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

import { withLangState } from '@angular-love/blog/i18n/data-access';
import {
  Article,
  articleLocaleToLangMap,
} from '@angular-love/contracts/articles';
import { HreflangEntry, withSeo } from '@angular-love/seo';
import {
  LoadingState,
  withCallState,
} from '@angular-love/shared/utils-signal-store';

import { ArticlesService } from '../infrastructure/articles.service';

type ArticleDetailsState = {
  articleDetails: Article | null;
  slug: string | null;
};

const initialState: ArticleDetailsState = {
  articleDetails: null,
  slug: null,
};

export const IsArticlePreview = new InjectionToken<boolean>(
  'Article Details Store Is Article Preview',
  {
    factory: () => false,
  },
);

export const ArticleDetailsStore = signalStore(
  { providedIn: 'root' },
  withSeo(),
  withState(initialState),
  withCallState('fetch article details'),
  withLangState(),
  withMethods(({ ...store }) => {
    const articlesService = inject(ArticlesService);
    const isPreview = inject(IsArticlePreview);

    return {
      fetchArticleDetails: rxMethod<string | undefined>(
        pipe(
          filter((slug): slug is string => !!slug && slug !== store.slug()),
          tap((slug) =>
            patchState(store, {
              slug: slug,
              fetchArticleDetailsCallState: LoadingState.LOADING,
              articleDetails: null,
            }),
          ),
          switchMap((slug) =>
            (isPreview
              ? articlesService.getArticlePreviewBySlug(slug)
              : articlesService.getArticleBySlug(slug)
            ).pipe(
              tapResponse({
                error: (error) =>
                  patchState(store, {
                    slug: slug,
                    fetchArticleDetailsCallState: { error },
                  }),
                next: (articleDetails) => {
                  store.setMeta(articleDetails.seo);
                  store.setTitle(articleDetails.seo.title);

                  const hreflangEntries =
                    buildArticleHreflangEntries(articleDetails);

                  if (hreflangEntries) {
                    store.setHreflang(hreflangEntries);
                  } else {
                    store.clearHreflang();
                  }

                  return patchState(store, {
                    articleDetails,
                    slug: slug,
                    fetchArticleDetailsCallState: LoadingState.LOADED,
                  });
                },
              }),
            ),
          ),
        ),
      ),
    };
  }),
  withComputed(({ articleDetails, lang }) => ({
    alternativeLanguageSlug: computed(() => {
      return articleDetails()?.otherTranslations.find((t) =>
        t.locale.includes(lang()),
      )?.slug;
    }),
  })),
);

export function buildArticleHreflangEntries(
  article: Article,
): HreflangEntry[] | null {
  if (!article.otherTranslations || article.otherTranslations.length < 2) {
    return null;
  }

  return article.otherTranslations.map((translation) => {
    const langCode = articleLocaleToLangMap[translation.locale];
    const url = buildArticlePath(translation.slug, langCode);

    return {
      locale: langCode,
      url: url,
    } satisfies HreflangEntry;
  });
}

function buildArticlePath(slug: string, langCode: string): string {
  if (langCode === 'en') {
    return `/${slug}`;
  }

  return `/${langCode}/${slug}`;
}
