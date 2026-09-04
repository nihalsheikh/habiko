export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  morningMotivation?: boolean;
  [key: string]: unknown;
}

export interface Habit {
  _id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  frequency: string;
  targetDays: number;
  color: string;
  icon: string;
  isArchived: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface HabitLog {
  _id: string;
  userId: string;
  habitId: string;
  completedDate: string;
}

export interface StreakResult {
  current: number;
  longest: number;
}

export interface HeatmapItem {
  date: string;
  count: number;
}

export interface HabitStatsItem {
  habitId: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  completions30d: number;
  currentStreak: number;
  longestStreak: number;
}

export interface StatsResponse {
  perHabit: HabitStatsItem[];
  days: string[];
}

export interface HabitDetailStats {
  habit: Habit;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  monthly: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  data: T;
}

export interface RequestOptions {
  params?: Record<string, string | undefined>;
  data?: Record<string, unknown>;
}
