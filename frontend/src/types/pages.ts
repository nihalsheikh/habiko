import type { LucideIcon } from "lucide-react";
import type { Habit, HabitLog, HeatmapItem } from "./api";
import type { WeekDayKey } from "./components";

// Dashboard
export interface StreaksMap {
  [habitId: string]: {
    current: number;
    longest: number;
  };
}

export type LogsByHabitMap = Record<string, string[]>;

export interface DeleteHabitModalState {
  habit: Habit | null;
}

// Insight
export interface CachedWeeklyReport {
  content: string;
  generatedAt: string;
}

export interface DailyChartData {
  label: string;
  count: number;
}

export interface CompareChartData {
  label: string;
  "This week": number;
  "Last week": number;
}

export interface PerHabitPerformance {
  habit: Habit;
  done: number;
  target: number;
  pct: number;
}

export interface CategoryDataPoint {
  name: string;
  value: number;
}

// Landing
export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface LandingHabitPreview {
  icon: string;
  name: string;
  done: boolean;
  streak: number;
}

export interface LandingMetricPreview {
  label: string;
  value: string;
}

// Login
export interface LocationStateWithFrom {
  from?: string;
}

// Register
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

// Stats
export interface MonthlyStatItem {
  label: string;
  count: number;
}

export interface WeeklyStatItem {
  label: string;
  count: number;
}

// Weekly
export interface DayTotalItem extends WeekDayKey {
  count: number;
}

export interface PerHabitDoneCount {
  h: Habit;
  count: number;
}
