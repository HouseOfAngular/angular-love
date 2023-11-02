import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () =>
      (await import(/* webpackChunkName: 'home' */ '@angular-love/blog/home/feature'))
        .HomePageComponent,
  },
];
