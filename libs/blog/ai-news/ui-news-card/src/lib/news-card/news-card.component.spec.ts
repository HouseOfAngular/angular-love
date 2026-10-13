import { TranslocoTestingModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideFastSVG } from '@push-based/ngx-fast-svg';

import { AiNewsItem } from '@angular-love/blog/contracts/ai-news';

import { NewsClock } from '../news-dates';

import { NewsCardComponent } from './news-card.component';

const selectors = {
  link: 'a',
  image: '[data-testid="news-card-image"]',
  img: '[data-testid="news-card-image"] img',
  play: '[data-testid="news-card-play"]',
  source: '[data-testid="news-card-source"]',
  category: '[data-testid="news-card-category"]',
  time: '[data-testid="news-card-meta"] time',
};

const clock: NewsClock = { now: new Date('2026-10-13T12:00:00Z'), utc: true };

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
                relative: { hours: '{{count}}h ago' },
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

  function render(item: AiNewsItem) {
    spectator = createComponent({ props: { item, clock } });
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

  describe('standard layout (with thumbnail)', () => {
    beforeEach(() => render(blogItem));

    it('shows a lazy thumbnail with a reserved aspect ratio', () => {
      const img = spectator.query(selectors.img) as HTMLImageElement;
      expect(img.getAttribute('src')).toBe('https://cdn.example.dev/og.png');
      expect(img.getAttribute('loading')).toBe('lazy');
      expect(spectator.query(selectors.image)).toHaveClass('aspect-[1.91/1]');
    });

    it('shows the category and the relative date with the absolute one as a tooltip', () => {
      expect(spectator.query(selectors.category)).toHaveText('Models');
      const time = spectator.query(selectors.time) as HTMLTimeElement;
      expect(time).toHaveText('3h ago');
      expect(time.getAttribute('datetime')).toBe(blogItem.publishedAt);
      expect(time.getAttribute('title')).toBe('Oct 13, 2026, 9:00:00 AM');
    });

    it('has no play overlay for a non-YouTube item', () => {
      expect(spectator.query(selectors.play)).toBeNull();
    });
  });

  describe('text-forward layout (no thumbnail)', () => {
    beforeEach(() => render(socialItem));

    it('has no image slot at all', () => {
      expect(spectator.query(selectors.image)).toBeNull();
      expect(spectator.query('img#thumbnail, img[width="1200"]')).toBeNull();
    });

    it('labels who posted it where', () => {
      expect(spectator.query(selectors.source)).toHaveText(
        'Post on X by @fictional_dev',
      );
    });
  });

  it('names the source once, in the footer, on image cards too', () => {
    render(blogItem);

    expect(spectator.queryAll(selectors.source)).toHaveLength(1);
    expect(spectator.query(selectors.source)).toHaveText(
      'Article from Example Lab',
    );
  });

  describe('time', () => {
    const timeFor = (publishedAt: string) => {
      render({ ...blogItem, publishedAt });
      return spectator.query(selectors.time);
    };

    it('is relative today', () => {
      expect(timeFor('2026-10-13T09:00:00.000Z')).toHaveExactTrimmedText(
        '3h ago',
      );
    });

    it('is the time of day yesterday, which the heading already names', () => {
      expect(timeFor('2026-10-12T15:30:00.000Z')).toHaveExactTrimmedText(
        '3:30 PM',
      );
    });

    it('is the day and month for older items', () => {
      expect(timeFor('2026-10-09T15:30:00.000Z')).toHaveExactTrimmedText(
        'Oct 9',
      );
      expect(timeFor('2026-08-04T10:00:00.000Z')).toHaveExactTrimmedText(
        'Aug 4',
      );
    });
  });

  it('shows a play overlay on YouTube thumbnails', () => {
    render({
      ...blogItem,
      url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      sourceType: 'video',
    });

    expect(spectator.query(selectors.play)).toExist();
  });

  it('removes the image slot for a missing YouTube video placeholder', () => {
    render({
      ...blogItem,
      url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    });
    const img = spectator.query(selectors.img) as HTMLImageElement;
    jest.spyOn(img, 'naturalWidth', 'get').mockReturnValue(120);

    spectator.dispatchFakeEvent(img, 'load');
    spectator.detectChanges();

    expect(spectator.query(selectors.image)).toBeNull();
  });

  it('keeps a thumbnail that loaded', () => {
    render(blogItem);
    const img = spectator.query(selectors.img) as HTMLImageElement;
    jest.spyOn(img, 'naturalWidth', 'get').mockReturnValue(1200);

    spectator.dispatchFakeEvent(img, 'load');
    spectator.detectChanges();

    expect(spectator.query(selectors.image)).toExist();
  });

  it('removes the image slot when the thumbnail fails to load', () => {
    render(blogItem);

    spectator.dispatchFakeEvent(selectors.img, 'error');
    spectator.detectChanges();

    expect(spectator.query(selectors.image)).toBeNull();
    expect(spectator.query(selectors.source)).toExist();
  });
});
