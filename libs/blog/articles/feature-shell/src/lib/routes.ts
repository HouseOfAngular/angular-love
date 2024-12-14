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
      (await import('@angular-love/blog/articles/feature-category'))
        .CategoryArticlesComponent,
    data: {
      seo: { title: 'News' },
      category: 'news',
      title: 'Angular News',
      id: 'angular-news',
    },
  },
  {
    path: 'guides',
    loadComponent: async () =>
      (await import('@angular-love/blog/articles/feature-category'))
        .CategoryArticlesComponent,
    data: {
      seo: { title: 'Guides' },
      category: 'guides',
      title: 'Angular Guides',
      id: 'angular-guides-title',
    },
  },
  {
    path: 'latest',
    loadComponent: async () =>
      (await import('@angular-love/blog/articles/feature-category'))
        .CategoryArticlesComponent,
    data: {
      seo: { title: 'Latest Articles' },
      excludeCategory: 'angular-in-depth-en',
      title: 'Latest Articles',
      id: 'latest-articles',
    },
  },
  {
    path: 'angular-in-depth',
    loadComponent: async () =>
      (await import('@angular-love/blog/articles/feature-category'))
        .CategoryArticlesComponent,
    data: {
      seo: { title: 'Angular In Depth' },
      category: 'angular-in-depth',
      title: 'Angular In Depth',
      id: 'angular-in-depth-title',
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
