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
  articleLangToLangMap,
  articleLocaleToLangMap,
} from '@angular-love/contracts/articles';
import { HreflangEntry, withSeo } from '@angular-love/seo';
import { ConfigService } from '@angular-love/shared/config';
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
    const baseUrl = inject(ConfigService).get<string>('baseUrl');

    /**
     * Apply all article SEO with correct absolute URLs.
     * Shared by tapResponse.next (fetch) and applyArticleSeo (constructor
     * re-apply for non-preview routes where SeoService.init() may have
     * wiped the tags set during the guard).
     */
    function applyArticleSeoFor(article: Article): void {
      const lang = articleLangToLangMap[article.language];
      const pageUrl = `${baseUrl}${buildArticlePath(article.slug, lang)}`;

      store.setMeta(article.seo, pageUrl);
      store.setTitle(article.seo.title);

      const hreflangEntries = buildArticleHreflangEntries(article, baseUrl);
      if (hreflangEntries) {
        store.setHreflang(hreflangEntries);
      } else {
        store.clearHreflang();
      }

      store.setArticleJsonLd(article, lang, pageUrl, baseUrl);
    }

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
                    slug: null,
                    fetchArticleDetailsCallState: { error },
                  }),
                next: (articleDetails) => {
                  applyArticleSeoFor(articleDetails);

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
  baseUrl: string,
): HreflangEntry[] | null {
  if (!article.otherTranslations || article.otherTranslations.length < 2) {
    return null;
  }

  return article.otherTranslations.map((translation) => {
    const langCode = articleLocaleToLangMap[translation.locale];
    const path = buildArticlePath(translation.slug, langCode);

    return {
      locale: langCode,
      url: `${baseUrl}${path}`,
    } satisfies HreflangEntry;
  });
}

function buildArticlePath(slug: string, langCode: string): string {
  if (langCode === 'en') {
    return `/${slug}`;
  }

  return `/${langCode}/${slug}`;
}
