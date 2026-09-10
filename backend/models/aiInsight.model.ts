import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type InsightType =
  | "weekly"
  | "suggestion"
  | "recovery"
  | "chat"
  | "morning";

export interface IAIInsight extends Document {
  userId: Types.ObjectId;
  type: InsightType;
  content: string;
  meta: Record<string, any>;
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const aiInsightSchema = new Schema<IAIInsight>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["weekly", "suggestion", "recovery", "chat", "morning"],
      required: true,
    },
    content: { type: String, required: true },
    meta: { type: Schema.Types.Mixed, default: {} },
    generatedAt: { type: Date, default: Date.now() },
  },
  { timestamps: true },
);

// Index for quickly fetching recent insights by type for a user
aiInsightSchema.index({ userId: 1, type: 1, createdAt: -1 });

const AIInsight: Model<IAIInsight> = mongoose.model<IAIInsight>(
  "AIInsight",
  aiInsightSchema,
);

export default AIInsight;
