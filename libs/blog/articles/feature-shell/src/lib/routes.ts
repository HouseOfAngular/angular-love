import { Routes } from '@angular/router';

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
    path: 'recommended',
    loadComponent: async () =>
      (await import('@angular-love/recommended-articles'))
        .FeatureRecommendedArticlesPageComponent,
    data: {
      seo: { title: 'Recommended Articles' },
    },
  },
  {
    path: 'article/:articleSlug',
    pathMatch: 'full',
    loadComponent: async () =>
      (await import('@angular-love/blog/articles/feature-article'))
        .ArticleDetailsContainerComponent,
  },
];
