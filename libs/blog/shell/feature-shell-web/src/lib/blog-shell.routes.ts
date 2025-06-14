import { Route } from '@angular/router';

import { articleRoutes } from '@angular-love/blog/articles/feature/shell';
import { activeLanguageGuard } from '@angular-love/blog/i18n/data-access';

import { RootShellComponent } from './root-shell.component';

export const blogShellRoutes: Route[] = [
  {
    path: 'pl',
    pathMatch: 'prefix',
    loadChildren: () => commonRoutes,
    canActivate: [activeLanguageGuard('pl')],
  },
  {
    path: '',
    pathMatch: 'prefix',
    loadChildren: () => commonRoutes,
    canActivate: [activeLanguageGuard('en')],
  },
];

export const commonRoutes: Route[] = [
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
          seo: { title: 'seo.home', autoHrefLang: true },
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
          seo: { title: 'seo.aboutUs', autoHrefLang: true },
        },
      },
      {
        path: 'author/:authorSlug',
        loadComponent: async () =>
          (await import('@angular-love/blog/authors/feature-author'))
            .FeatureAuthorComponent,
        data: {
          seo: { autoHrefLang: true },
        },
      },
      {
        path: 'become-author',
        loadComponent: async () =>
          (await import('@angular-love/blog/become-author-page-feature'))
            .BecomeAuthorPageFeatureComponent,
        data: {
          seo: { title: 'seo.becomeAuthor', autoHrefLang: true },
        },
      },
      {
        path: 'newsletter',
        loadComponent: async () =>
          (await import('@angular-love/blog/newsletter'))
            .NewsletterPageComponent,
      },
      {
        path: 'writing-rules',
        loadComponent: async () =>
          (await import('@angular-love/blog/feature-writing-rules'))
            .WritingRulesComponent,
        data: {
          seo: { autoHrefLang: true },
        },
      },
      {
        path: '404',
        loadComponent: async () =>
          (await import('@angular-love/blog/shared/ui-not-found'))
            .NotFoundPageComponent,
        data: {
          seo: { title: 'seo.notFound' },
        },
      },
      ...articleRoutes,
      {
        path: '**',
        redirectTo: '404',
      },
    ],
  },
];
