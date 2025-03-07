import { computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { distinctUntilChanged } from 'rxjs';

export const CATEGORIES_LIST = [
  {
    name: 'All',
    link: 'latest',
    slug: null,
    translationPath: 'categories.all',
    langs: ['pl', 'en'],
  },
  {
    name: 'Guides',
    link: 'guides',
    slug: 'guides',
    translationPath: 'categories.guides',
    langs: ['pl', 'en'],
  },
  {
    name: 'News',
    link: 'news',
    slug: 'news',
    translationPath: 'categories.news',
    langs: ['pl', 'en'],
  },
  {
    name: 'In-Depth',
    link: 'angular-in-depth',
    slug: 'angular-in-depth',
    translationPath: 'categories.inDepth',
    langs: ['en'],
  },
] as const;

export type CategoryListItem = (typeof CATEGORIES_LIST)[number];

export function injectCategories() {
  const transloco = inject(TranslocoService);
  const activeLang = toSignal(
    transloco.langChanges$.pipe(distinctUntilChanged()),
    { initialValue: transloco.getActiveLang() },
  );

  return computed(() => {
    const lang = activeLang();
    return CATEGORIES_LIST.filter((category) =>
      (category.langs as readonly string[]).includes(lang),
    );
  });
}
