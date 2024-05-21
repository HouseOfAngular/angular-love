import { Route } from '@angular/router';

export const articleRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'news',
        loadComponent: async () =>
          (await import('@angular-love/blog/articles/feature/news'))
            .FeatureNewsComponent,
      },
      {
        path: 'guides',
        loadComponent: async () =>
          (await import('@angular-love/blog/articles/feature-guides'))
            .FeatureGuidesComponent,
      },
      {
        path: 'latest',
        loadComponent: async () =>
          (await import('@angular-love/feature-latest-articles'))
            .FeatureLatestArticlesPageComponent,
      },
      {
        path: 'article/:slug',
        pathMatch: 'full',
        loadComponent: async () =>
          (await import('@angular-love/blog/articles/feature-article'))
            .ArticleDetailsContainerComponent,
      },
    ],
  },
];
