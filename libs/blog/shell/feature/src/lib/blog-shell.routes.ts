import { LayoutComponent } from '@angular-love/blog/layouts/ui';
import { Route } from '@angular/router';

export const blogShellRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      //todo: handle wildcard route
      {
        path: '',
        pathMatch: 'full',
        loadComponent: async () =>
          (await import('@angular-love/blog/home/feature')).HomePageComponent,
      },
      {
        path: 'search',
        pathMatch: 'full',
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
    ],
  },
];
