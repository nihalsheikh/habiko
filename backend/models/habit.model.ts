import mongoose, { Document, Model, Schema, Types } from "mongoose";

export const HABIT_CATEGORIES = [
  "Health",
  "Fitness",
  "Learning",
  "Mindfulness",
  "Productivity",
  "Social",
  "Finance",
  "Creative",
  "Other",
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];
export type HabitFrequency = "daily" | "weekly";

// Interface for Habit Document
export interface IHabit extends Document {
  userId: Types.ObjectId;
  name: string;
  description: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetDays: number;
  color: string;
  icon: string;
  isArchived: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    category: { type: String, enum: HABIT_CATEGORIES, default: "Other" },
    frequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
    targetDays: { type: Number, default: 7, min: 1, max: 7 },
    color: { type: String, default: "#6366f1" },
    icon: { type: String, default: "🎯" },
    isArchived: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Compound index to quickly fetch an active user's habits in order
habitSchema.index({ userId: 1, isArchived: 1, order: 1 });

const Habit: Model<IHabit> = mongoose.model<IHabit>("Habit", habitSchema);
export default Habit;
