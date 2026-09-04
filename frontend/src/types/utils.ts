import { CATEGORIES, ICONS, COLORS } from "../utils/constants";
import type { StreakResult, Habit, HabitLog, User } from "./api";
import type { HabitSuggestion } from "./components";

// Confetti
export interface ConfettiOrigin {
  x?: number;
  y?: number;
}

// Constants
export type Category = (typeof CATEGORIES)[number];
export type HabitIcon = (typeof ICONS)[number];
export type HabitColor = (typeof COLORS)[number];

// Date Helpers
export interface DayInfo {
  key: string;
  label: string;
  short: string;
  date: Date;
}

export type { StreakResult };

// Mock Data
export interface MockHabitOverrides extends Partial<Habit> {
  _streakProb?: number;
  _pattern?: "weekdays" | "dropoff";
  _brokeAt?: number;
}

export interface MockHabit extends Habit {
  _streakProb?: number;
  _pattern?: "weekdays" | "dropoff";
  _brokeAt?: number;
}

export interface MockAIChatResponses {
  default: string;
  [question: string]: string;
}

export interface MockAIStructure {
  weeklyReport: string;
  recovery: string;
  morning: string;
  chat: MockAIChatResponses;
  suggestions: HabitSuggestion[];
}
