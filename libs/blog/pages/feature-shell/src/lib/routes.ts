import { Routes } from '@angular/router';

import { pageExistGuard } from '@angular-love/blog/pages/data-access';

export const pageRoutes: Routes = [
  {
    path: 'pages/:slug',
    canActivate: [pageExistGuard],
    loadComponent: async () =>
      (await import('@angular-love/blog/pages/feature-page'))
        .PageDetailsContainerComponent,
  },
];
