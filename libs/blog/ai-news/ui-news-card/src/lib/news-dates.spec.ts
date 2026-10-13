import { dateGroup, groupByDate, relativeTime } from './news-dates';
import { sourceIcon } from './source-icon';

const clock = { now: new Date('2026-10-13T12:00:00Z'), utc: true };
const d = (iso: string) => new Date(iso);

describe('relativeTime', () => {
  it.each([
    ['2026-10-13T11:59:30Z', { unit: 'now' }],
    ['2026-10-13T13:00:00Z', { unit: 'now' }],
    ['2026-10-13T11:15:00Z', { unit: 'minutes', count: 45 }],
    ['2026-10-13T09:00:00Z', { unit: 'hours', count: 3 }],
    ['2026-10-12T13:00:00Z', { unit: 'hours', count: 23 }],
  ])('%s → %o', (iso, expected) => {
    expect(relativeTime(d(iso), clock.now)).toEqual(expected);
  });
});

describe('dateGroup', () => {
  it.each([
    ['2026-10-13T00:00:00Z', { kind: 'today' }],
    ['2026-10-12T23:59:59Z', { kind: 'yesterday' }],
    ['2026-10-07T00:00:00Z', { kind: 'thisWeek' }],
    ['2026-10-06T23:00:00Z', { kind: 'month', year: 2026, month: 10 }],
    ['2026-09-30T10:00:00Z', { kind: 'month', year: 2026, month: 9 }],
  ])('%s → %o', (iso, expected) => {
    expect(dateGroup(d(iso), clock)).toEqual(expected);
  });
});

describe('groupByDate', () => {
  it('keeps order and merges consecutive items of a group', () => {
    const items = [
      '2026-10-13T10:00:00Z',
      '2026-10-13T08:00:00Z',
      '2026-10-12T08:00:00Z',
      '2026-10-09T08:00:00Z',
      '2026-09-08T08:00:00Z',
      '2026-08-04T08:00:00Z',
    ];

    const groups = groupByDate(items, d, clock);

    expect(groups.map((g) => [g.id, g.items.length])).toEqual([
      ['today', 2],
      ['yesterday', 1],
      ['thisWeek', 1],
      ['2026-09', 1],
      ['2026-08', 1],
    ]);
  });
});

describe('sourceIcon', () => {
  it.each([
    ['https://x.com/a/status/1', 'social', 'twitter-x'],
    ['https://www.linkedin.com/posts/a', 'social', 'linkedIn'],
    ['https://github.com/a/b', 'repo', 'github-mark'],
    ['https://youtu.be/abc', 'video', 'youtube'],
    ['https://mastodon.example/@a/1', 'social', 'source-chat'],
    ['https://arxiv.org/abs/1', 'paper', 'source-paper'],
    ['https://gitlab.com/a/b', 'repo', 'source-code'],
    ['not a url', 'other', 'link'],
  ] as const)('%s (%s) → %s', (url, type, icon) => {
    expect(sourceIcon(url, type)).toBe(icon);
  });
});
