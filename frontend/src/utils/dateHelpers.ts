import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import type { DayInfo, StreakResult } from "../types/utils";

export const toKey = (d: Date | number): string => format(d, "yyyy-MM-dd");

export const todayKey = (): string => toKey(new Date());

export const last7Days = (): DayInfo[] => {
  const end = new Date();
  const start = subDays(end, 6);
  return eachDayOfInterval({ start, end }).map((d) => ({
    key: toKey(d),
    label: format(d, "EEE"),
    short: format(d, "d"),
    date: d,
  }));
};

export const last90Days = (): string[] => {
  const end = new Date();
  const start = subDays(end, 89);
  return eachDayOfInterval({ start, end }).map((d) => toKey(d));
};

export const weekKeys = (): DayInfo[] => weekKeysFor(new Date());

export const weekKeysFor = (date: Date | number): DayInfo[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map((d) => ({
    key: toKey(d),
    label: format(d, "EEE"),
    short: format(d, "d"),
    date: d,
  }));
};

export const prettyDate = (d: Date | string | number): string =>
  format(d instanceof Date ? d : new Date(d), "MMM d, yyyy");

export const streakFromKeys = (keys?: string[]): StreakResult => {
  if (!keys?.length) return { current: 0, longest: 0 };
  const set = new Set(keys);
  const today = todayKey();
  const yKey = toKey(subDays(new Date(), 1));
  let current = 0;
  let cursor = new Date();

  if (!set.has(today) && !set.has(yKey)) {
    current = 0;
  } else {
    if (!set.has(today)) cursor = subDays(cursor, 1);
    while (set.has(toKey(cursor))) {
      current += 1;
      cursor = subDays(cursor, 1);
    }
  }

  const sorted = [...keys].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;

  for (const k of sorted) {
    if (prev) {
      const diff = Math.round(
        (new Date(k).getTime() - new Date(prev).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      run = diff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
    prev = k;
  }

  return { current, longest };
};
