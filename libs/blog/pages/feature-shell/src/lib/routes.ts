import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import {
  PageDetailsStore,
  pageExistGuard,
} from '@angular-love/blog/pages/data-access';

export const pageRoutes: Routes = [
  {
    path: ':slug',
    canMatch: [pageExistGuard],
    canDeactivate: [
      () => {
        inject(PageDetailsStore).reset();
        return true;
      },
    ],
    loadComponent: async () =>
      (await import('@angular-love/blog/pages/feature-page'))
        .PageDetailsContainerComponent,
  },
];
