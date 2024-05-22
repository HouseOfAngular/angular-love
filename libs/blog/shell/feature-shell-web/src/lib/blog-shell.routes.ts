import { Route } from '@angular/router';

import { LayoutComponent } from '@angular-love/blog/layouts/ui-layouts';
import {
  SearchService,
  SearchStore,
} from '@angular-love/blog/search/data-access';

export const blogShellRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    providers: [SearchService, SearchStore],
    children: [
      //todo: handle wildcard route
      {
        path: 'search',
        pathMatch: 'full',
        loadComponent: async () =>
          (await import('@angular-love/feature-search-results-page'))
            .FeatureSearchResultsPageComponent,
      },
      {
        path: 'about-us',
        pathMatch: 'full',
        loadComponent: async () =>
          (await import('@angular-love/feature-about-us'))
            .FeatureAboutUsComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        loadComponent: async () =>
          (await import('@angular-love/blog/home/feature-home'))
            .HomePageComponent,
      },
      {
        path: 'author/:authorSlug',
        loadComponent: async () =>
          (await import('@angular-love/blog/authors/feature-author'))
            .FeatureAuthorComponent,
      },
      {
        path: 'become-author',
        loadComponent: async () =>
          (await import('@angular-love/blog/become-author-page-feature'))
            .BecomeAuthorPageFeatureComponent,
      },
      {
        path: '',
        loadChildren: async () =>
          (await import('@angular-love/blog/articles/feature/shell'))
            .articleRoutes,
      },
      {
        path: 'not-found',
        loadComponent: async () =>
          (await import('@angular-love/blog/shared/ui-not-found'))
            .NotFoundPageComponent,
      },
      {
        path: '**',
        redirectTo: 'not-found',
      },
    ],
  },
];
