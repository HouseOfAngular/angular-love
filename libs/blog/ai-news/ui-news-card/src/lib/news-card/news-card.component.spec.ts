import { LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideFastSVG } from '@push-based/ngx-fast-svg';

import { AiNewsItem } from '@angular-love/blog/contracts/ai-news';
import { AlLocalizeService } from '@angular-love/blog/i18n/util';

import { NewsClock } from '../news-dates';

import { NewsCardComponent } from './news-card.component';

const selectors = {
  link: 'a',
  category: '[data-testid="news-card-category"]',
  time: 'time',
  meta: '[data-testid="news-card-meta"]',
  source: '[data-testid="news-card-source"]',
};

const clock: NewsClock = {
  now: new Date('2026-10-13T12:00:00Z'),
  timeZone: 'UTC',
};

const blogItem: AiNewsItem = {
  id: 1,
  url: 'https://blog.example.dev/post',
  slug: 'a-fictional-model',
  title: 'A fictional model',
  excerpt: 'Excerpt about a fictional model.',
  thumbnailUrl: 'https://cdn.example.dev/og.png',
  sourceName: 'Example Lab',
  sourceType: 'blog',
  author: null,
  category: 'models',
  publishedAt: '2026-10-13T09:00:00.000Z',
};

const socialItem: AiNewsItem = {
  ...blogItem,
  id: 2,
  url: 'https://x.com/fictional_dev/status/1',
  slug: 'thread',
  thumbnailUrl: null,
  sourceName: 'X',
  sourceType: 'social',
  author: '@fictional_dev',
  category: 'tools',
};

/** ICU puts a narrow no-break space before AM/PM. */
const text = (el: Element | null) =>
  (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

describe('NewsCardComponent', () => {
  let spectator: Spectator<NewsCardComponent>;
  const createComponent = createComponentFactory({
    component: NewsCardComponent,
    imports: [
      TranslocoTestingModule.forRoot({
        langs: {
          en: {
            aiNewsPage: {
              categories: { models: 'Models', tools: 'Tools' },
              card: {
                byAuthor: 'by {{author}}',
                label: {
                  blog: 'Article from {{source}}',
                  social: 'Post on {{source}}',
                },
              },
            },
          },
        },
        preloadLangs: true,
        translocoConfig: { defaultLang: 'en', availableLangs: ['en'] },
      }),
    ],
    providers: [
      provideFastSVG({ url: (name) => `assets/icons/${name}.svg` }),
      provideRouter([]),
      AlLocalizeService,
    ],
    detectChanges: false,
  });

  function render(item: AiNewsItem, withClock: NewsClock = clock) {
    spectator = createComponent({ props: { item, clock: withClock } });
    spectator.detectChanges();
  }

  it("renders the whole card as one link to the item's page, named by the title", () => {
    render(blogItem);

    const link = spectator.query(selectors.link) as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/ai-news/a-fictional-model');
    expect(link.getAttribute('target')).toBeNull();
    expect(link.getAttribute('aria-label')).toBe('A fictional model');
    expect(spectator.queryAll('a')).toHaveLength(1);
  });

  it('shows the excerpt', () => {
    render(blogItem);

    expect(spectator.element).toContainText('Excerpt about a fictional model.');
  });

  it('shows no image, even when the item has a thumbnail', () => {
    render(blogItem);

    expect(spectator.query(`img[src="${blogItem.thumbnailUrl}"]`)).toBeNull();
  });

  it('puts the category and the time on the first row', () => {
    render(blogItem);

    const category = spectator.query(selectors.category) as HTMLElement;
    const time = spectator.query(selectors.time) as HTMLTimeElement;
    expect(category).toHaveText('Models');
    expect(time.parentElement).toBe(category.parentElement);
    expect(time.getAttribute('datetime')).toBe(blogItem.publishedAt);
    expect(text(time)).toBe('9:00 AM');
    expect(time.getAttribute('title')?.replace(/\s/g, ' ')).toBe(
      'Oct 13, 2026, 9:00 AM',
    );
  });

  it('keeps only the source in the footer', () => {
    render(socialItem);

    expect(spectator.query(`${selectors.meta} time`)).toBeNull();
    expect(text(spectator.query(selectors.meta))).toBe(
      'Post on X by @fictional_dev',
    );
    expect(spectator.queryAll(selectors.source)).toHaveLength(1);
  });

  describe('time', () => {
    const timeFor = (publishedAt: string, withClock: NewsClock = clock) => {
      render({ ...blogItem, publishedAt }, withClock);
      return text(spectator.query(selectors.time));
    };

    it('is the time of day today and yesterday, which the heading names', () => {
      expect(timeFor('2026-10-13T09:00:00.000Z')).toBe('9:00 AM');
      expect(timeFor('2026-10-12T15:30:00.000Z')).toBe('3:30 PM');
    });

    it('is the day and month for older items', () => {
      expect(timeFor('2026-10-09T15:30:00.000Z')).toBe('Oct 9');
      expect(timeFor('2026-08-04T10:00:00.000Z')).toBe('Aug 4');
    });

    it('formats in the locale, also when LOCALE_ID is an object', () => {
      const locale = { toLowerCase: () => 'pl' } as unknown as string;
      spectator = createComponent({
        props: {
          item: { ...blogItem, publishedAt: '2026-10-09T15:30:00.000Z' },
          clock,
        },
        providers: [{ provide: LOCALE_ID, useValue: locale }],
      });
      spectator.detectChanges();
      expect(text(spectator.query(selectors.time))).toBe('9 paź');
    });

    it("uses the clock's time zone for the day and the time", () => {
      const warsaw: NewsClock = { ...clock, timeZone: 'Europe/Warsaw' };
      // 23:30 UTC on the 11th is 01:30 on the 12th in Warsaw (CEST): yesterday.
      expect(timeFor('2026-10-11T23:30:00.000Z', warsaw)).toBe('1:30 AM');
      expect(timeFor('2026-10-11T23:30:00.000Z')).toBe('Oct 11');
    });
  });
});
