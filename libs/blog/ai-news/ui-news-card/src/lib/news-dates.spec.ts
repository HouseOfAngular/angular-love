import { dateGroup, groupByDate } from './news-dates';
import { sourceIcon } from './source-icon';

const clock = { now: new Date('2026-10-13T12:00:00Z'), timeZone: 'UTC' };
const d = (iso: string) => new Date(iso);

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

  it("uses the clock's midnight, not UTC's", () => {
    // 22:30 UTC on the 12th is 00:30 on the 13th in Warsaw (CEST).
    const item = d('2026-10-12T22:30:00Z');
    expect(dateGroup(item, clock)).toEqual({ kind: 'yesterday' });
    expect(dateGroup(item, { ...clock, timeZone: 'Europe/Warsaw' })).toEqual({
      kind: 'today',
    });
    expect(dateGroup(item, { ...clock, timeZone: 'America/New_York' })).toEqual(
      { kind: 'yesterday' },
    );
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
