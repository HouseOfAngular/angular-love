import { TestBed } from '@angular/core/testing';
import { Observable, of, Subject, throwError } from 'rxjs';

import {
  AiNewsFeedQuery,
  AiNewsFeedResponse,
  AiNewsItem,
} from '@angular-love/blog/contracts/ai-news';

import { AiNewsFeedStore } from './ai-news-feed.store';
import { AiNewsService } from './ai-news.service';

const item = (id: number): AiNewsItem => ({
  id,
  url: `https://example.com/${id}`,
  title: `Item ${id}`,
  summary: 'Summary',
  thumbnailUrl: null,
  sourceName: 'Example',
  sourceType: 'blog',
  author: null,
  category: 'models',
  publishedAt: '2026-10-13T10:00:00.000Z',
});

describe('AiNewsFeedStore', () => {
  let getFeed: jest.Mock<Observable<AiNewsFeedResponse>, [AiNewsFeedQuery]>;
  let store: InstanceType<typeof AiNewsFeedStore>;

  beforeEach(() => {
    getFeed = jest.fn();
    TestBed.configureTestingModule({
      providers: [
        AiNewsFeedStore,
        { provide: AiNewsService, useValue: { getFeed } },
      ],
    });
    store = TestBed.inject(AiNewsFeedStore);
  });

  it('loads the first page for a category', () => {
    getFeed.mockReturnValue(of({ items: [item(1)], nextCursor: 'c1' }));

    store.loadFeed('tools');

    expect(getFeed).toHaveBeenCalledWith({ category: 'tools' });
    expect(store.items()).toEqual([item(1)]);
    expect(store.nextCursor()).toBe('c1');
    expect(store.isFetchFeedLoaded()).toBe(true);
  });

  it('appends the next page with the cursor and category', () => {
    getFeed.mockReturnValueOnce(of({ items: [item(1)], nextCursor: 'c1' }));
    store.loadFeed('tools');

    getFeed.mockReturnValueOnce(of({ items: [item(2)], nextCursor: null }));
    store.loadMore();

    expect(getFeed).toHaveBeenLastCalledWith({
      category: 'tools',
      cursor: 'c1',
    });
    expect(store.items().map((i) => i.id)).toEqual([1, 2]);
    expect(store.nextCursor()).toBeNull();
  });

  it('does nothing on load more without a next page', () => {
    getFeed.mockReturnValue(of({ items: [item(1)], nextCursor: null }));
    store.loadFeed(null);
    store.loadMore();

    expect(getFeed).toHaveBeenCalledTimes(1);
  });

  it('switching category replaces the items and drops the in-flight request', () => {
    const slow = new Subject<AiNewsFeedResponse>();
    getFeed.mockReturnValueOnce(slow);
    store.loadFeed('models');

    getFeed.mockReturnValueOnce(of({ items: [item(3)], nextCursor: null }));
    store.loadFeed('research');
    slow.next({ items: [item(1)], nextCursor: null });

    expect(store.category()).toBe('research');
    expect(store.items().map((i) => i.id)).toEqual([3]);
  });

  it('keeps the items when load more fails, and retries load more', () => {
    getFeed.mockReturnValueOnce(of({ items: [item(1)], nextCursor: 'c1' }));
    store.loadFeed(null);
    getFeed.mockReturnValueOnce(throwError(() => new Error('offline')));
    store.loadMore();

    expect(store.isFetchMoreError()).toBe(true);
    expect(store.items().map((i) => i.id)).toEqual([1]);

    getFeed.mockReturnValueOnce(of({ items: [item(2)], nextCursor: null }));
    store.retry();

    expect(store.items().map((i) => i.id)).toEqual([1, 2]);
  });

  it('retries the first page after it fails', () => {
    getFeed.mockReturnValueOnce(throwError(() => new Error('offline')));
    store.loadFeed('tools');
    expect(store.isFetchFeedError()).toBe(true);

    getFeed.mockReturnValueOnce(of({ items: [item(1)], nextCursor: null }));
    store.retry();

    expect(getFeed).toHaveBeenLastCalledWith({ category: 'tools' });
    expect(store.items()).toEqual([item(1)]);
  });
});
