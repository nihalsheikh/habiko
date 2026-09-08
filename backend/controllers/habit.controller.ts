import Habit from "../models/habit.model";
import HabitLog from "../models/habitLog.model";
import type { Request, Response } from "express";
import { handleControllerError } from "../utils/response";

// Get User's Habits
export const getHabits = async (req: Request, res: Response) => {
  try {
    const { includeArchived } = req.query;

    // Define filter type so optional fields can be added cleanly
    const filter: { userId?: any; isArchived?: boolean } = {
      userId: req.user?._id,
    };

    if (includeArchived !== "true") filter.isArchived = false;

    const habits = await Habit.find(filter).sort({ order: 1, createdAt: 1 });

    res.status(200).json(habits);
  } catch (error) {
    return handleControllerError(res, error, "Failed to fetch habits");
  }
};

// Create Habit
export const createHabit = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, description, category, frequency, targetDays, color, icon } =
      req.body;

    if (!name || !name.trim())
      return res.status(400).json({ message: "Habit name is required" });

    const count = await Habit.countDocuments({ userId: user._id });
    const habit = await Habit.create({
      userId: user._id,
      name: name.trim(),
      description: description?.trim() || "",
      category,
      frequency,
      targetDays,
      color,
      icon,
      order: count,
    });

    res.status(201).json(habit);
  } catch (error) {
    return handleControllerError(res, error, "Failed to create habit");
  }
};

// Update Habit
export const updateHabit = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: user._id,
    });
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const allowedFields = [
      "name",
      "description",
      "category",
      "frequency",
      "targetDays",
      "color",
      "icon",
      "order",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        habit.set(field, req.body[field]);
      }
    }

    await habit.save();
    res.status(200).json(habit);
  } catch (error) {
    return handleControllerError(res, error, "Failed to update habit");
  }
};

// Delete Habit
export const deleteHabit = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: user._id,
    });

    if (!habit) return res.status(404).json({ message: "Habit not found" });

    // delete all habits
    await HabitLog.deleteMany({ habitId: habit._id, userId: user._id });

    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    return handleControllerError(res, error, "Failed to delete habit");
  }
};

// Archive Habit
export const archiveHabit = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: user._id,
    });

    if (!habit) return res.status(404).json({ message: "Habit not found" });

    // toggle archive habbit
    habit.isArchived = !habit.isArchived;
    await habit.save();

    return res.status(200).json(habit);
  } catch (error) {
    return handleControllerError(res, error, "Failed to archive habit");
  }
};

// Reorder Habit
export const reorderHabits = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { order } = req.body;
    if (!Array.isArray(order))
      return res
        .status(400)
        .json({ message: "Order must be an array of habit IDs" });

    // Reordering habits
    const bulkOps = order.map((id: string, idx: number) => ({
      updateOne: {
        filter: { _id: id, userId: user._id },
        update: { $set: { order: idx } },
      },
    }));

    await Habit.bulkWrite(bulkOps);

    return res.status(200).json({ message: "Habits reordered successfully" });
  } catch (error) {
    return handleControllerError(res, error, "Failed to reorder habits");
  }
};
