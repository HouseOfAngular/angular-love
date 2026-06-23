// libs/blog/shell/feature-shell-web/src/lib/blog-shell.routes.ts
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
          seo: {
            title: 'seo.aboutUs',
            autoHrefLang: true,
            jsonLd: 'AboutPage',
          },
        },
      },
      {
        path: 'author/:authorSlug',
        loadComponent: async () =>
          (await import('@angular-love/blog/authors/feature-author'))
            .FeatureAuthorComponent,
        data: {
          // TODO: emit a full Person entity once AuthorDetailsStore exposes withSeo()
          seo: { autoHrefLang: true, jsonLd: 'ProfilePage' },
        },
      },
      {
        path: 'become-author',
        loadComponent: async () =>
          (await import('@angular-love/blog/become-author-page-feature'))
            .BecomeAuthorPageFeatureComponent,
        data: {
          seo: {
            title: 'seo.becomeAuthor',
            autoHrefLang: true,
            jsonLd: 'WebPage',
          },
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
          seo: { autoHrefLang: true, jsonLd: 'WebPage' },
        },
      },
      {
        path: 'roadmap',
        loadComponent: async () =>
          await import('@angular-love/blog/roadmap/feature-roadmap').then(
            (m) => m.FeatureRoadmapComponent,
          ),
        data: {
          layoutConfig: {
            roadmap: true,
          },
          seo: { title: 'seo.roadmap' },
        },
      },
      {
        path: '404',
        loadComponent: async () =>
          (await import('@angular-love/blog/shared/ui-not-found'))
            .NotFoundPageComponent,
        data: {
          seo: { title: 'seo.notFound', jsonLd: false },
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
