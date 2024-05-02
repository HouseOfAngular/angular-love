import { Route } from '@angular/router';

import { LayoutComponent } from '@angular-love/blog/layouts/ui';

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
