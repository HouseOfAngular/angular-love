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
      seo: { title: 'News', autoHrefLang: true },
      category: 'news',
      title: 'Angular News',
      id: 'angular-news',
    },
  },
  {
    path: 'presentations',
    loadComponent: async () =>
      (await import('@angular-love/blog/presentations/presentations-page'))
        .PresentationsPageComponent,
    data: {
      seo: { title: 'Presentations', autoHrefLang: true },
      category: 'presentations',
      title: 'Angular Presentations',
      id: 'angular-presentations',
    },
  },
  {
    path: 'guides',
    loadComponent: async () =>
      (await import('@angular-love/blog/articles/feature-category'))
        .CategoryArticlesComponent,
    data: {
      seo: { title: 'Guides', autoHrefLang: true },
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
      seo: { title: 'Latest Articles', autoHrefLang: true },
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
      seo: { title: 'Angular In Depth', autoHrefLang: true },
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
