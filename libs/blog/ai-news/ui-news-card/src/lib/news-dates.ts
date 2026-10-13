/**
 * The reference point for relative dates. The server renders with its own
 * time in UTC and the client hydrates with the same values (see the feature's
 * clock), then switches to the browser's time and time zone, so hydration
 * never sees different text.
 */
export interface NewsClock {
  now: Date;
  /** Use UTC (server render and hydration) instead of the runtime's zone. */
  utc: boolean;
}

/** Only used within the "Today" group, so it never goes past hours. */
export type RelativeTime =
  | { unit: 'now' }
  | { unit: 'minutes' | 'hours'; count: number };

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function relativeTime(date: Date, now: Date): RelativeTime {
  const diff = Math.max(0, now.getTime() - date.getTime());
  if (diff < MINUTE) {
    return { unit: 'now' };
  }
  if (diff < HOUR) {
    return { unit: 'minutes', count: Math.floor(diff / MINUTE) };
  }
  return { unit: 'hours', count: Math.floor(diff / HOUR) };
}

export type DateGroupKey =
  | { kind: 'today' | 'yesterday' | 'thisWeek' }
  /** `month` is 1-based. */
  | { kind: 'month'; year: number; month: number };

/** Today, Yesterday, the rest of the last 7 days, then calendar months. */
export function dateGroup(date: Date, clock: NewsClock): DateGroupKey {
  const day = calendarDay(date, clock.utc);
  const daysAgo = Math.round(
    (calendarDay(clock.now, clock.utc).utc - day.utc) / DAY,
  );

  if (daysAgo <= 0) {
    return { kind: 'today' };
  }
  if (daysAgo === 1) {
    return { kind: 'yesterday' };
  }
  if (daysAgo < 7) {
    return { kind: 'thisWeek' };
  }
  return { kind: 'month', year: day.year, month: day.month };
}

export function dateGroupId(key: DateGroupKey): string {
  return key.kind === 'month'
    ? `${key.year}-${String(key.month).padStart(2, '0')}`
    : key.kind;
}

export interface DateGroup<T> {
  id: string;
  key: DateGroupKey;
  items: T[];
}

/** Groups items that are already sorted newest first, keeping their order. */
export function groupByDate<T>(
  items: readonly T[],
  getDate: (item: T) => Date,
  clock: NewsClock,
): DateGroup<T>[] {
  const groups: DateGroup<T>[] = [];
  for (const item of items) {
    const key = dateGroup(getDate(item), clock);
    const id = dateGroupId(key);
    const last = groups[groups.length - 1];
    if (last?.id === id) {
      last.items.push(item);
    } else {
      groups.push({ id, key, items: [item] });
    }
  }
  return groups;
}

function calendarDay(
  date: Date,
  utc: boolean,
): { year: number; month: number; utc: number } {
  // Numeric parts don't depend on the ICU build, unlike formatted strings.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: utc ? 'UTC' : undefined,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);
  const part = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  const year = part('year');
  const month = part('month');

  return { year, month, utc: Date.UTC(year, month - 1, part('day')) };
}
