import { Routes } from '@angular/router';

import { articleExistsGuard } from '@angular-love/blog/articles/data-access';

export const articleRoutes: Routes = [
  {
    path: 'news',
    loadComponent: async () =>
      (await import('@angular-love/blog/articles/feature/news'))
        .FeatureNewsComponent,
    data: {
      seo: { title: 'News' },
    },
  },
  {
    path: 'guides',
    loadComponent: async () =>
      (await import('@angular-love/blog/articles/feature-guides'))
        .FeatureGuidesComponent,
    data: {
      seo: { title: 'Guides' },
    },
  },
  {
    path: 'latest',
    loadComponent: async () =>
      (await import('@angular-love/feature-latest-articles'))
        .FeatureLatestArticlesPageComponent,
    data: {
      seo: { title: 'Latest Articles' },
    },
  },
  {
    path: ':articleSlug',
    pathMatch: 'full',
    canActivate: [articleExistsGuard],
    loadComponent: async () =>
      (await import('@angular-love/blog/articles/feature-article'))
        .ArticleDetailsContainerComponent,
  },
];
