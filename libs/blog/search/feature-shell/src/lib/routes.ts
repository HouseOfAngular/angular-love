import { Route } from '@angular/router';

import { provideSearch } from '@angular-love/blog/search/data-access';

export const searchRoutes: Route[] = [
  {
    path: '',
    loadComponent: async () =>
      (await import('@angular-love/feature-search-results-page'))
        .SearchResultsPageComponent,
    providers: [provideSearch()],
    data: {
      seo: { title: 'Search Results' },
    },
  },
];
