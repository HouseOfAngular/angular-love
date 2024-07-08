import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, mockProvider } from '@ngneat/spectator/jest';

import { AlLocalizeService } from './localize.service';

describe('AlLocalizeService', () => {
  const createService = createServiceFactory({
    service: AlLocalizeService,
  });

  const testSetup = (options?: {
    activeLang?: string;
    defaultLang?: string;
  }) => {
    const spectator = createService({
      providers: [
        mockProvider(TranslocoService, {
          getDefaultLang: () => options?.defaultLang ?? 'pl',
          getActiveLang: () => options?.activeLang ?? 'en',
        }),
      ],
    });

    return { service: spectator.service };
  };

  describe('localizePath', () => {
    it.each([
      {
        options: { activeLang: 'en', defaultLang: 'pl' },
        value: '/en',
        result: '/en',
      },
      {
        options: { activeLang: 'en', defaultLang: 'pl' },
        value: '/',
        result: '/en',
      },
      {
        options: { activeLang: 'pl', defaultLang: 'pl' },
        value: '/',
        result: '/',
      },
      {
        options: { activeLang: 'en', defaultLang: 'pl' },
        value: '/about-us',
        result: '/en/about-us',
      },
      {
        options: { activeLang: 'pl', defaultLang: 'pl' },
        value: '/about-us',
        result: '/about-us',
      },
      {
        options: { activeLang: 'en', defaultLang: 'pl' },
        value: '/nested/path',
        result: '/en/nested/path',
      },
      {
        options: { activeLang: 'pl', defaultLang: 'pl' },
        value: '/nested/path',
        result: '/nested/path',
      },
      {
        options: { activeLang: 'pl', defaultLang: 'pl' },
        value: ['/', 'path'],
        result: ['/', 'path'],
      },
      {
        options: { activeLang: 'en', defaultLang: 'pl' },
        value: ['/', 'path'],
        result: ['/en', 'path'],
      },
      {
        options: { activeLang: 'pl', defaultLang: 'pl' },
        value: ['/', 'path', { param: 'test' }],
        result: ['/', 'path', { param: 'test' }],
      },
      {
        options: { activeLang: 'en', defaultLang: 'pl' },
        value: ['/', 'path', { param: 'test' }],
        result: ['/en', 'path', { param: 'test' }],
      },
    ])('translates given path', ({ options, value, result }) => {
      const { service } = testSetup(options);
      expect(service.localizePath(value)).toEqual(result);
    });
  });
});
