import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import type { Habit, HabitStatsItem, HeatmapItem, User } from "./api";

// AI Chat Component
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIChatResponse {
  content: string;
}

// AI Weekly Report
export interface AIWeeklyReportResponse {
  content: string;
}

// Category Pie Chart
export interface CategoryPieData {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface CategoryPieChartProps {
  data?: CategoryPieData[];
}

// Habit Form
export interface HabitFormData {
  name: string;
  description: string;
  category: string;
  frequency: string;
  targetDays: number | string;
  color: string;
  icon: string;
}

export interface HabitFormSubmitData {
  name: string;
  description: string;
  category: string;
  frequency: string;
  targetDays: number;
  color: string;
  icon: string;
}

export interface HabitFormProps {
  initial?: Partial<Habit>;
  onSubmit: (data: HabitFormSubmitData) => void;
  onCancel: () => void;
  submitting?: boolean;
}

// Habit Stats Card
export interface HabitStatsCardProps {
  stat: HabitStatsItem;
}

// Habit Suggestion Modal
export interface HabitSuggestion {
  name: string;
  description: string;
  category: string;
  frequency: string;
  icon: string;
  reason?: string;
  [key: string]: unknown;
}

export interface HabitSuggestionsResponse {
  suggestions: HabitSuggestion[];
}

export interface HabitSuggestionModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: (suggestion: HabitSuggestion) => Promise<void> | void;
}

// HeatMap Chart
export interface HeatmapChartProps {
  data?: HeatmapItem[];
}

export interface HeatmapMemoResult {
  cols: (HeatmapItem | null)[][];
  max: number;
}

// Loading Spinner
export interface LoadingSpinnerProps {
  full?: boolean;
  size?: number;
}

// Markdown
export interface MarkdownProps {
  children?: ReactNode;
  className?: string;
}

// Mobile Nav
export interface MobileNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

// Modal
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

// Monthly Bar Chart
export interface MonthlyBarData {
  label: string;
  count: number;
  [key: string]: unknown;
}

export interface MonthlyBarChartProps {
  data?: MonthlyBarData[];
}

// Morning Motivation
export interface MorningMotivationResponse {
  content: string;
}

// Orbiting Habits
export type OrbitType = "outer" | "middle" | "inner";

export interface OrbitHabitConfig {
  Icon: IconType;
  color: string;
  orbit: OrbitType;
  delay: number;
  reverse?: boolean;
}

export interface OrbitDetails {
  inset: string;
  duration: number;
  planet: number;
}

export interface OrbitStar {
  top: string;
  left: string;
  size: number;
  delay: number;
}

// Progress Ring
export interface ProgressRingProps {
  value?: number;
  size?: number;
  stroke?: number;
  color?: string;
}

// Protected Route
export interface ProtectedRouteProps {
  children: ReactNode;
}

// Sidebar
export interface SidebarNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export interface ProfileUpdateResponse {
  user: User;
}

// Streak Recovery Card
export interface StreakRecoveryResponse {
  content: string;
}

export interface StreakRecoveryCardProps {
  habit: Habit;
  onDismiss: () => void;
}

// Summary Cards
export interface SummaryCardItemProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  iconBg: string;
  iconFg: string;
}

export interface SummaryCardsProps {
  totalHabits: number;
  activeStreaks: number;
  bestStreak: number;
  weekRate: number;
}

// Today Habit Card
export interface TodayHabitCardProps {
  habit: Habit;
  completed: boolean;
  onToggle: () => void;
  streak?: number;
  onEdit: () => void;
  onDelete: () => void;
  onArchive: () => void;
}

export interface MenuPosition {
  top: number;
  left: number;
}

// Weekly Bar Chart
export interface WeeklyBarData {
  label: string;
  count: number;
  [key: string]: unknown;
}

export interface WeeklyBarChartProps {
  data?: WeeklyBarData[];
  title?: string;
}

// Weekly Grid
export interface WeekDayKey {
  key: string;
  label: string;
  short: string;
}

export interface WeeklyGridProps {
  habits: Habit[];
  logsByHabit: Record<string, string[]>;
  days?: WeekDayKey[];
}
