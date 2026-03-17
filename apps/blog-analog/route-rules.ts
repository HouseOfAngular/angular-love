import type { Options } from '@analogjs/platform';

export const nitroRouteRules: NonNullable<Options['nitro']>['routeRules'] = {
  '/parsowanie-i-mapowanie-odpowiedzi-z-api-z-wykorzystaniem-zod-js': {
    redirect: {
      to: '/pl/parsowanie-i-mapowanie-odpowiedzi-z-api-z-wykorzystaniem-zod-js/',
      statusCode: 301,
    },
  },
  '/sygnaly-w-angular-gleboka-analiza-dla-zapracowanych-deweloperow': {
    redirect: {
      to: '/pl/sygnaly-w-angular-gleboka-analiza-dla-zapracowanych-deweloperow/',
      statusCode: 301,
    },
  },
  '/najistotniejsze-zmiany-wprowadzone-w-nowej-wersji-typescripta-5-5': {
    redirect: {
      to: '/pl/najistotniejsze-zmiany-wprowadzone-w-nowej-wersji-typescripta-5-5/',
      statusCode: 301,
    },
  },
  '/przywracanie-pozycji-przewijania-scroll-w-angularze': {
    redirect: {
      to: '/pl/przywracanie-pozycji-przewijania-scroll-w-angularze/',
      statusCode: 301,
    },
  },
  '/angular-zmienna-szablonu-let-hit-czy-kit': {
    redirect: {
      to: '/pl/angular-zmienna-szablonu-let-hit-czy-kit/',
      statusCode: 301,
    },
  },
  '/en': { redirect: { to: '/', statusCode: 301 } },
  '/en/': { redirect: { to: '/', statusCode: 301 } },
};
