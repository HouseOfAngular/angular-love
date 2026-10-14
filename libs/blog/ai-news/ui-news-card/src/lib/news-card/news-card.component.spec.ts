import { LOCALE_ID } from '@angular/core';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideFastSVG } from '@push-based/ngx-fast-svg';

import { AiNewsItem } from '@angular-love/blog/contracts/ai-news';

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
  title: 'A fictional model',
  summary: 'Summary of a fictional model.',
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
                linkLabel: '{{title}} ({{source}}, opens in a new tab)',
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
    providers: [provideFastSVG({ url: (name) => `assets/icons/${name}.svg` })],
    detectChanges: false,
  });

  function render(item: AiNewsItem, withClock: NewsClock = clock) {
    spectator = createComponent({ props: { item, clock: withClock } });
    spectator.detectChanges();
  }

  it('renders the whole card as one external link with an accessible name', () => {
    render(blogItem);

    const link = spectator.query(selectors.link) as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('https://blog.example.dev/post');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.getAttribute('aria-label')).toBe(
      'A fictional model (Example Lab, opens in a new tab)',
    );
    expect(spectator.queryAll('a')).toHaveLength(1);
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
