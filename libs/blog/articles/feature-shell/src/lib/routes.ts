import { Routes } from '@angular/router';

import {
  ArticleDetailsStore,
  articleExistsGuard,
  IsArticlePreview,
} from '@angular-love/blog/articles/data-access';

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
    path: 'angular-in-depth',
    loadComponent: async () =>
      (await import('@angular-love/feature-angular-in-depth'))
        .FeatureAngularInDepthComponent,
    data: {
      seo: { title: 'Angular In Depth' },
    },
  },
  {
    path: 'preview/:articleSlug',
    providers: [
      { provide: IsArticlePreview, useValue: true },
      ArticleDetailsStore,
    ],
    loadComponent: async () =>
      (await import('@angular-love/blog/articles/feature-article'))
        .ArticleDetailsContainerComponent,
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
