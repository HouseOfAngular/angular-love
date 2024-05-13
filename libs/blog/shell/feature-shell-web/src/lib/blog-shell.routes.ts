import { Route } from '@angular/router';

import { RootShellComponent } from './root-shell.component';

export const blogShellRoutes: Route[] = [
  {
    path: '',
    component: RootShellComponent,
    children: [
      //todo: handle wildcard route
      {
        path: 'search',
        pathMatch: 'full',
        loadChildren: async () =>
          (await import('@angular-love/blog/search/feature-shell'))
            .searchRoutes,
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
