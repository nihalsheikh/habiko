import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IHabitLog extends Document {
  userId: Types.ObjectId;
  habitId: Types.ObjectId;
  completedDate: string; // Format: YYYY-MM-DD
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const habitLogSchema = new Schema<IHabitLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    habitId: {
      type: Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
      index: true,
    },
    completedDate: {
      // Format: YYYY-MM-DD
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

// Prevent duplicate entries for the same habit on the same day by same user
habitLogSchema.index(
  { userId: 1, habitId: 1, completedDate: 1 },
  { unique: true },
);

const HabitLog: Model<IHabitLog> = mongoose.model<IHabitLog>(
  "HabitLog",
  habitLogSchema,
);

export default HabitLog;
