/**
 * The reference point for dates: "now" and the time zone that decides the
 * calendar day and the clock time. The server renders in the site's zone, the
 * client hydrates in the same zone (so the date groups match), then switches
 * to the reader's own zone.
 */
export interface NewsClock {
  now: Date;
  /** IANA zone, e.g. `Europe/Warsaw`; `undefined` is the runtime's own zone. */
  timeZone?: string;
}

/** Most readers are in Poland, so rendering there makes the switch a no-op for them. */
export const NEWS_SITE_TIME_ZONE = 'Europe/Warsaw';

/**
 * Formats in the clock's zone. Uses `Intl` because Angular's `formatDate`
 * only takes fixed offsets, which are wrong across daylight saving changes.
 */
export function formatNewsDate(
  date: Date,
  clock: NewsClock,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  // LOCALE_ID is an object in this app (LocaleIdProvider) whose toLowerCase()
  // returns the active language; Intl ignores anything but a string.
  return new Intl.DateTimeFormat(locale.toLowerCase(), {
    ...options,
    timeZone: clock.timeZone,
  }).format(date);
}

const DAY = 24 * 60 * 60 * 1000;

export type DateGroupKey =
  | { kind: 'today' | 'yesterday' | 'thisWeek' }
  /** `month` is 1-based. */
  | { kind: 'month'; year: number; month: number };

/** Today, Yesterday, the rest of the last 7 days, then calendar months. */
export function dateGroup(date: Date, clock: NewsClock): DateGroupKey {
  const day = calendarDay(date, clock.timeZone);
  const daysAgo = Math.round(
    (calendarDay(clock.now, clock.timeZone).utc - day.utc) / DAY,
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
  timeZone: string | undefined,
): { year: number; month: number; utc: number } {
  // Numeric parts don't depend on the ICU build, unlike formatted strings.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
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
