import { Route } from '@angular/router';

import { articleRoutes } from '@angular-love/blog/articles/feature/shell';
import { activeLanguageGuard } from '@angular-love/blog/i18n/data-access';

import { RootShellComponent } from './root-shell.component';

export const blogShellRoutes: Route[] = [
  {
    path: 'en',
    pathMatch: 'prefix',
    loadChildren: () => routes,
    canActivate: [activeLanguageGuard('en')],
  },
  {
    path: '',
    pathMatch: 'prefix',
    loadChildren: () => routes,
    canActivate: [activeLanguageGuard('pl')],
  },
];

export const routes: Route[] = [
  {
    path: '',
    component: RootShellComponent,
    children: [
      {
        path: '',
        loadComponent: async () =>
          (await import('@angular-love/blog/home/feature-home'))
            .HomePageComponent,
        data: {
          seo: { title: 'Home' },
        },
      },
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
        data: {
          seo: { title: 'About Us' },
        },
      },
      {
        path: 'author/:authorSlug',
        loadComponent: async () =>
          (await import('@angular-love/blog/authors/feature-author'))
            .FeatureAuthorComponent,
      },
      {
        path: 'become-author',
        loadComponent: async () =>
          (await import('@angular-love/blog/become-author-page-feature'))
            .BecomeAuthorPageFeatureComponent,
        data: {
          seo: { title: 'Become an author' },
        },
      },
      {
        path: 'newsletter',
        loadComponent: async () =>
          (await import('@angular-love/blog/newsletter'))
            .NewsletterPageComponent,
      },
      {
        path: 'not-found',
        loadComponent: async () =>
          (await import('@angular-love/blog/shared/ui-not-found'))
            .NotFoundPageComponent,
        data: {
          seo: { title: 'Not Found' },
        },
      },
      ...articleRoutes,
      {
        path: '**',
        redirectTo: 'not-found',
      },
    ],
  },
];
