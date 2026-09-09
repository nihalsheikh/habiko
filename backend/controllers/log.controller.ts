import type { Request, Response } from "express";
import { differenceInCalendarDays, parseISO } from "date-fns";
import HabitLog from "../models/habitLog.model";
import Habit from "../models/habit.model";
import {
  todayKey,
  last90Days,
  lastNDays,
  calcStreak,
} from "../utils/dateHelpers";
import { handleControllerError } from "../utils/response";

// Mark habit as complete
export const markComplete = async (req: Request, res: Response) => {
  try {
    const { habitId, date } = req.body;
    const completedDate = date || todayKey();
    const habit = await Habit.findOne({ _id: habitId, userId: req.user!._id });

    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const log = await HabitLog.findOneAndUpdate(
      { userId: req.user!._id, habitId, completedDate },
      { $setOnInsert: { userId: req.user!._id, habitId, completedDate } },
      { upsert: true, new: true },
    );

    return res.status(201).json(log);
  } catch (error) {
    return handleControllerError(
      res,
      error,
      "Failed to mark habit as complete",
    );
  }
};

// Unmark habit complete
export const unmarkComplete = async (req: Request, res: Response) => {
  try {
    const { habitId, date } = req.body;
    const completedDate = date || todayKey();

    await HabitLog.findOneAndDelete({
      userId: req.user!._id,
      habitId,
      completedDate,
    });

    return res.status(200).json({ message: "Unmarked habit" });
  } catch (error) {
    return handleControllerError(res, error, "Failed to unmark habit");
  }
};

// Get all logs for current user
export const getToday = async (req: Request, res: Response) => {
  try {
    const logs = await HabitLog.find({
      userId: req.user!._id,
      completedDate: todayKey(),
    });

    return res.status(200).json(logs);
  } catch (error) {
    return handleControllerError(res, error, "Failed to get logs");
  }
};

// Logs in range
export const getRange = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (typeof start !== "string" || typeof end !== "string") {
      return res
        .status(400)
        .json({ message: "Start and end dates are required" });
    }

    const logs = await HabitLog.find({
      userId: req.user!._id,
      completedDate: { $gte: start, $lte: end },
    });

    return res.status(200).json(logs);
  } catch (error) {
    return handleControllerError(res, error, "Failed to get logs in range");
  }
};

// Habit heatmap
export const getHeatmap = async (req: Request, res: Response) => {
  try {
    const days = last90Days();
    const logs = await HabitLog.find({
      userId: req.user!._id,
      completedDate: { $gte: days[0], $lte: days[days.length - 1] },
    });

    const counts: Record<string, number> = {};

    for (const d of days) counts[d] = 0;
    for (const l of logs)
      counts[l.completedDate] = (counts[l.completedDate] || 0) + 1;

    const data = days.map((d) => ({ date: d, count: counts[d] || 0 }));

    return res.status(200).json(data);
  } catch (error) {
    return handleControllerError(res, error, "Failed to get Heatmap");
  }
};

// Single Habit Stat
export const getHabitStats = async (req: Request, res: Response) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.habitId,
      userId: req.user!._id,
    });

    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const logs = await HabitLog.find({
      userId: req.user!._id,
      habitId: habit._id,
    }).sort({ completedDate: -1 });

    const dateKeys = logs.map((l) => l.completedDate);
    const { current, longest } = calcStreak(dateKeys);

    // Completion rate since habit created
    const createdKey = habit.createdAt.toISOString().slice(0, 10);
    const today = todayKey();

    const totalDays =
      Math.max(
        1,
        differenceInCalendarDays(parseISO(today), parseISO(createdKey)),
      ) + 1;

    const completionRate = Math.round((logs.length / totalDays) * 100);

    // Monthly breakdown
    const monthly: Record<string, number> = {};

    for (const l of logs) {
      const m = l.completedDate.slice(0, 7);
      monthly[m] = (monthly[m] || 0) + 1;
    }

    return res.status(200).json({
      habit,
      totalCompletions: logs.length,
      currentStreak: current,
      longestStreak: longest,
      completionRate,
      monthly,
    });
  } catch (error) {
    return handleControllerError(res, error, "Failed to get habit stats");
  }
};

// All habit stat
export const getAllStats = async (req: Request, res: Response) => {
  try {
    const habits = await Habit.find({
      userId: req.user!._id,
      isArchived: false,
    });
    const days = lastNDays(30);
    const logs = await HabitLog.find({
      userId: req.user!._id,
      completedDate: { $gte: days[0], $lte: days[days.length - 1] },
    });

    const perHabit = habits.map((h) => {
      const hLogs = logs.filter((l) => String(l.habitId) === String(h._id));
      const keys = hLogs
        .map((l) => l.completedDate)
        .sort()
        .reverse();

      const { current, longest } = calcStreak(keys);

      return {
        habitId: h._id,
        name: h.name,
        icon: h.icon,
        color: h.color,
        category: h.category,
        completions30d: hLogs.length,
        currentStreak: current,
        longestStreak: longest,
      };
    });

    return res.status(200).json({ perHabit, days });
  } catch (error) {
    return handleControllerError(res, error, "Failed to get all stats");
  }
};
