import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: async () =>
      (await import('@angular-love/blog/home/feature')).HomePageComponent,
  },
  {
    path: 'search',
    loadComponent: async () =>
      (await import('@angular-love/feature-search-results-page'))
        .FeatureSearchResultsPageComponent,
  },
  {
    path: ':slug',
    pathMatch: 'full',
    loadComponent: async () =>
      (await import('@angular-love/blog/articles/feature-article'))
        .ArticleDetailsContainerComponent,
  },
];
