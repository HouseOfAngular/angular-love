import { Route } from '@angular/router';

import { LayoutComponent } from '@angular-love/blog/layouts/ui';
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
        path: '',
        pathMatch: 'full',
        loadComponent: async () =>
          (await import('@angular-love/blog/home/feature')).HomePageComponent,
      },
      {
        path: 'author/:authorSlug',
        loadComponent: async () =>
          (await import('@angular-love/blog/authors/feature-author'))
            .FeatureAuthorComponent,
      },
      {
        path: '',
        loadChildren: async () =>
          (await import('@angular-love/blog/articles/feature/shell'))
            .articleRoutes,
      },
    ],
  },
];
