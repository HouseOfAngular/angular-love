import { APP_BASE_HREF } from '@angular/common';
import { ActivatedRoute, RouterLink, UrlTree } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { createPipeFactory, mockProvider } from '@ngneat/spectator/jest';

import { AlLocalizePipe } from './localize.pipe';
import { AlLocalizeService } from './localize.service';

const baseUrlMock = 'https://test.com';

describe('AlLocalizePipe', () => {
  const createPipe = createPipeFactory({
    pipe: AlLocalizePipe,
    imports: [RouterLink],
    providers: [
      AlLocalizeService,
      mockProvider(ActivatedRoute, {}),
      {
        provide: APP_BASE_HREF,
        useValue: baseUrlMock,
      },
    ],
    template: '<a [routerLink]="value | alLocalize"></a>',
  });

  const testSetup = (options?: {
    value?: string | string[] | UrlTree;
    activeLang?: string;
    defaultLang?: string;
  }) => {
    const spectator = createPipe({
      providers: [
        mockProvider(TranslocoService, {
          getDefaultLang: () => options?.defaultLang ?? 'pl',
          getActiveLang: () => options?.activeLang ?? 'en',
        }),
      ],
      hostProps: {
        value: options?.value ?? '/en',
      },
    });

    return { spectator };
  };

  it.each([
    {
      options: { value: '/en', activeLang: 'en', defaultLang: 'pl' },
      result: '/en',
    },
    {
      options: { value: '/', activeLang: 'en', defaultLang: 'pl' },
      result: '/en',
    },
    {
      options: { value: '/', activeLang: 'pl', defaultLang: 'pl' },
      result: '/',
    },
    {
      options: { value: '/about-us', activeLang: 'en', defaultLang: 'pl' },
      result: '/en/about-us',
    },
    {
      options: { value: '/about-us', activeLang: 'pl', defaultLang: 'pl' },
      result: '/about-us',
    },
    {
      options: {
        value: ['/', 'nested', 'path'],
        activeLang: 'pl',
        defaultLang: 'pl',
      },
      result: '/nested/path',
    },
    {
      options: {
        value: ['/', 'nested', 'path'],
        activeLang: 'en',
        defaultLang: 'pl',
      },
      result: '/en/nested/path',
    },
  ])('translates given path', ({ options, result }) => {
    const { spectator } = testSetup(options);
    expect(spectator.element.querySelector('a')?.href).toEqual(
      `${baseUrlMock}${result}`,
    );
  });
});
