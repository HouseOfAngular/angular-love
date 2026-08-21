import {
  provideTransloco,
  Translation,
  translocoConfig,
  TranslocoLoader,
} from '@jsverse/transloco';
import { applicationConfig, Decorator } from '@storybook/angular';
import { Observable, of } from 'rxjs';

import { AlLocalizeService } from '@angular-love/blog/i18n/util';
import { ArticleCard } from '@angular-love/blog/shared/types';

export const article: ArticleCard = {
  title: 'Angular Storybook',
  readingTime: '3',
  excerpt:
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. ',
  featuredImageUrl: '/assets/storybook/article-featured-image.png',
  difficulty: 'intermediate',
  author: {
    name: 'Author Data',
    avatarUrl: '/assets/storybook/author-image.jpg',
  },
  slug: 'angular-storybook',
  publishDate: new Date('2021-05-01').toISOString(),
};

/** Every card template localizes its routerLink through AlLocalizePipe. */
export const articleCardProviders = [AlLocalizeService];

/**
 * The cards render no translated copy — AlLocalizeService only reads the
 * configured langs to prefix routerLinks — so no translation file is ever
 * fetched. Serving an empty translation keeps this ui lib off data-access.
 */
class NoopTranslocoLoader implements TranslocoLoader {
  getTranslation(): Observable<Translation> {
    return of({});
  }
}

export const articleCardAppConfig: Decorator = applicationConfig({
  providers: [
    provideTransloco({
      config: translocoConfig({
        availableLangs: ['pl', 'en'],
        defaultLang: 'pl',
      }),
      loader: NoopTranslocoLoader,
    }),
  ],
});
