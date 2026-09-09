import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  differenceInCalendarDays,
  parseISO,
} from "date-fns";

export interface StreakResult {
  current: number;
  longest: number;
}

// Date Formater string
export const toDateKey = (date: Date | number): string =>
  format(date, "yyyy-MM-dd");

// Make new date shortcut
export const todayKey = (): string => toDateKey(new Date());

// Heatmap 90 Dates in chronological order
export const last90Days = (): string[] => {
  const end = new Date();
  const start = subDays(end, 89);

  return eachDayOfInterval({ start, end }).map(toDateKey);
};

// Get 7 days Weeks (Monday start)
export const currentWeekKeys = (): string[] => {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end }).map(toDateKey);
};

// Last N days
export const lastNDays = (n: number): string[] => {
  const end = new Date();
  const start = subDays(end, n - 1);

  return eachDayOfInterval({ start, end }).map(toDateKey);
};

// Habit Streak Calc
export const calcStreak = (sortedDateKeys: string[]): StreakResult => {
  // sortedDateKeys newest first, unique
  if (!sortedDateKeys.length) return { current: 0, longest: 0 };

  const set = new Set(sortedDateKeys);
  const today = todayKey();
  const yesterday = toDateKey(subDays(new Date(), 1));

  // Current streak calc
  let current = 0;
  let cursor = new Date();

  if (!set.has(today) && !set.has(yesterday)) {
    current = 0;
  } else {
    if (!set.has(today)) cursor = subDays(cursor, 1);
    while (set.has(toDateKey(cursor))) {
      current += 1;
      cursor = subDays(cursor, 1);
    }
  }

  // Longest Streak Calc
  const sortedAsc = [...new Set(sortedDateKeys)].sort();

  let longest = 0;
  let run = 0;
  let prev: string | null = null;

  for (const k of sortedAsc) {
    if (prev) {
      const diff = differenceInCalendarDays(parseISO(k), parseISO(prev));

      if (diff === 1) {
        run += 1;
      } else {
        run = 1;
      }
    } else {
      run = 1;
    }

    if (run > longest) longest = run;
    prev = k;
  }

  return { current, longest };
};
