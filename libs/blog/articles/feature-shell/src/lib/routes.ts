import { Routes } from '@angular/router';

export const articleRoutes: Routes = [
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
    path: 'recommended',
    loadComponent: async () =>
      (await import('@angular-love/recommended-articles'))
        .FeatureRecommendedArticlesPageComponent,
  },
  {
    path: 'article/:articleSlug',
    pathMatch: 'full',
    loadComponent: async () =>
      (await import('@angular-love/blog/articles/feature-article'))
        .ArticleDetailsContainerComponent,
  },
];
