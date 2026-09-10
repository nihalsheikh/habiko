import type { Request, Response } from "express";
import { Types } from "mongoose";
import { parseISO } from "date-fns";
import Habit from "../models/habit.model";
import HabitLog from "../models/habitLog.model";
import AIInsight from "../models/aiInsight.model";
import {
  chatCompletion,
  getTimeOfDay,
  SYSTEM_PROMPTS,
  parseJSON,
} from "../utils/aiService";
import { lastNDays, calcStreak, todayKey } from "../utils/dateHelpers";
import { handleControllerError } from "../utils/response";

// For Weekly Context
export interface WeeklyContextHabit {
  name: string;
  category: string;
  frequency: string;
  completedDays: number;
  targetDays: number;
}

export interface WeeklyContext {
  days: string[];
  perHabit: WeeklyContextHabit[];
}

// For habit suggestion
interface HabitSuggestion {
  name: string;
  description: string;
  frequency: "daily" | "weekly";
  category: string;
  icon: string;
  reason: string;
}

// Weekly Context builder
const buildWeeklyContext = async (
  userId: Types.ObjectId | string,
): Promise<WeeklyContext> => {
  const habits = await Habit.find({ userId, isArchived: false });
  const days = lastNDays(7);
  const logs = await HabitLog.find({
    userId,
    completedDate: { $gte: days[0], $lte: days[days.length - 1] },
  });

  const perHabit = habits.map((h) => {
    const completed = logs.filter(
      (l) => String(l.habitId) === String(h._id),
    ).length;

    return {
      name: h.name,
      category: h.category,
      frequency: h.frequency,
      completedDays: completed,
      targetDays: h.targetDays,
    };
  });

  return { days, perHabit };
};

// Weekly Report
export const weeklyReport = async (req: Request, res: Response) => {
  try {
    const ctx = await buildWeeklyContext(req.user!._id);
    if (!ctx.perHabit.length) {
      return res.status(200).json({
        content:
          "You don't have any active habits yet. Create your first habit to start tracking - I'll generate a weekly report once you have some data.",
      });
    }

    const userMsg = `Here is the user's habit data for the past 7 days (${ctx.days[0]} to ${ctx.days[6]}):\n\n${ctx.perHabit
      .map(
        (h) =>
          `- ${h.name} (${h.category}, ${h.frequency}): completed ${h.completedDays} of the past 7 days, target ${h.targetDays}/week`,
      )
      .join("\n")}\n\nPlease write the personalised weekly report now.`;

    const { content } = await chatCompletion({
      system: SYSTEM_PROMPTS.weekly,
      user: userMsg,
    });

    await AIInsight.create({
      userId: req.user!._id,
      type: "weekly",
      content,
      meta: { days: ctx.days },
    });

    return res.status(200).json({ content });
  } catch (error) {
    return handleControllerError(res, error, "Error building weekly report");
  }
};

// Habit Suggestion
export const suggestHabits = async (req: Request, res: Response) => {
  try {
    const { goals, productiveTime, struggles } = req.body;

    const userMsg = `User goals: ${goals || "not provided"}
    Most productive time: ${productiveTime || "not provided"}
    Past struggles: ${struggles || "not provided"}

    Suggest 3 personalized habits now. Return JSON only.
    Important: The "icon" field must be a single literal emoji character (e.g., 🏋️, 📚, 🧘), never icon names or plain text.`;

    const { content } = await chatCompletion({
      system: SYSTEM_PROMPTS.suggestion,
      user: userMsg,
    });

    let suggestions: HabitSuggestion[] = [];
    try {
      const parsed = parseJSON<{ suggestions?: HabitSuggestion[] }>(content);
      suggestions = Array.isArray(parsed?.suggestions)
        ? parsed.suggestions
        : [];
    } catch {
      suggestions = [];
    }

    // Fallback Habit Suggestions
    if (!suggestions.length) {
      suggestions = [
        {
          name: "10-minute morning walk",
          description: "Start the day with light movement and fresh air.",
          frequency: "daily",
          category: "Fitness",
          icon: "🚶",
          reason: "Low-friction way to build consistency early in the day.",
        },
        {
          name: "Read 5 pages",
          description: "Short daily reading to build a learning routine.",
          frequency: "daily",
          category: "Learning",
          icon: "📚",
          reason: "Compounds into significant knowledge over weeks.",
        },
        {
          name: "2 minutes of mindful breathing",
          description: "Pause and breathe to reset focus and reduce stress.",
          frequency: "daily",
          category: "Mindfulness",
          icon: "🧘",
          reason: "Tiny anchor habit that fits any schedule.",
        },
      ];
    }

    await AIInsight.create({
      userId: req.user!._id,
      type: "suggestion",
      content: JSON.stringify(suggestions),
      meta: { goals, productiveTime, struggles },
    });

    return res.status(200).json({ suggestions });
  } catch (error) {
    return handleControllerError(res, error, "Error making habit suggestions");
  }
};

// Streak Recovery Plan
export const recoveryPlan = async (req: Request, res: Response) => {
  try {
    const { habitId } = req.body;
    if (!habitId)
      return res.status(400).json({ message: "Habit ID is required" });

    const habit = await Habit.findOne({
      _id: habitId,
      userId: req.user!._id,
    });

    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const logs = await HabitLog.find({
      userId: req.user!._id,
      habitId,
    }).sort({ completedDate: -1 });

    const keys = logs.map((l) => l.completedDate);
    const { current, longest } = calcStreak(keys);

    const userMsg = `Habit: ${habit.name} (${habit.category}).\nDescription: ${habit.description || "none"}.\nCurrent streak: ${current} days. Longest ever: ${longest} days. The user just broke a streak. Write a warm, actionable 3-day recovery plan.`;

    const { content } = await chatCompletion({
      system: SYSTEM_PROMPTS.recovery,
      user: userMsg,
    });

    await AIInsight.create({
      userId: req.user!._id,
      type: "recovery",
      content,
      meta: { habitId: habit._id },
    });

    return res.status(200).json({ content });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Error making streak recovery plan",
    );
  }
};

// Chat Analysis
export const chatAnalysis = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }

    const habits = await Habit.find({
      userId: req.user!._id,
      isArchived: false,
    });

    const days = lastNDays(30);
    const logs = await HabitLog.find({
      userId: req.user!._id,
      completedDate: { $gte: days[0], $lte: days[days.length - 1] },
    });

    const context = habits.length
      ? habits
          .map((h) => {
            const hLogs = logs.filter(
              (l) => String(l.habitId) === String(h._id),
            );

            const byDow = [0, 0, 0, 0, 0, 0, 0];
            for (const l of hLogs) {
              const dow = parseISO(l.completedDate).getDay();
              if (typeof byDow[dow] === "number") {
                byDow[dow] += 1;
              }
            }

            return `${h.name} (${h.category}): ${hLogs.length}/30 in last 30 days, by weekday [Sun,Mon,Tue,Wed,Thu,Fri,Sat]=${JSON.stringify(
              byDow,
            )}`;
          })
          .join("\n")
      : "No active habits tracked in the last 30 days.";

    const userMsg = `User question: "${question}"\n\nUser data (last 30 days):\n${context}\n\nAnswer now.`;

    const { content } = await chatCompletion({
      system: SYSTEM_PROMPTS.chat,
      user: userMsg,
    });

    await AIInsight.create({
      userId: req.user!._id,
      type: "chat",
      content,
      meta: { question: question.trim() },
    });

    return res.status(200).json({ content });
  } catch (error) {
    return handleControllerError(res, error, "Error making chat analysis");
  }
};

// Morning Motivation
export const morningMotivation = async (req: Request, res: Response) => {
  try {
    const habits = await Habit.find({
      userId: req.user!._id,
      isArchived: false,
    });

    const timeOfDay = getTimeOfDay();

    if (!habits.length)
      return res.status(200).json({
        content: `Good ${timeOfDay}! Add your first habit now and let's get the momentum started.`,
      });

    const days = lastNDays(30);
    const logs = await HabitLog.find({
      userId: req.user!._id,
      completedDate: { $gte: days[0], $lte: days[days.length - 1] },
    });

    const ctx = habits
      .map((h) => {
        const hLogs = logs
          .filter((l) => String(l.habitId) === String(h._id))
          .map((l) => l.completedDate)
          .sort()
          .reverse();

        const { current } = calcStreak(hLogs);

        return `${h.name}: current streak ${current}`;
      })
      .join("\n");

    const today = todayKey();
    const todayLogs = logs.filter((l) => l.completedDate === today);
    const done = todayLogs.length;
    const total = habits.length;

    const userMsg = `Today's habits and streaks:\n${ctx}\n\nDone today: ${done}/${total}. Write the morning message now.`;

    const { content } = await chatCompletion({
      system: SYSTEM_PROMPTS.morning,
      user: userMsg,
      temperature: 0.8,
    });

    await AIInsight.create({
      userId: req.user!._id,
      type: "morning",
      content,
      meta: { timeOfDay, done, total },
    });

    return res.status(200).json({ content });
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Error generating morning motivation",
    );
  }
};
