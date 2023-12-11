import { Route } from '@angular/router';
import { articleResolver } from '@angular-love/blog/articles/data-access';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () =>
      (await import('@angular-love/blog/home/feature')).HomePageComponent,
  },
  {
    path: ':slug',
    pathMatch: 'full',
    resolve: {
      article: articleResolver,
    },
    loadComponent: async () =>
      (await import('@angular-love/blog/articles/feature-article'))
        .BlogArticlesFeatureItemComponent,
  },
];
