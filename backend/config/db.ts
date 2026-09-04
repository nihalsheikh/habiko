import mongoose from "mongoose";
import { MONGODB_URL } from "./envConfig";

export const connectDB = async () => {
  try {
    const url = MONGODB_URL;
    if (!url) throw new Error("MONGODB_URL is not defined");

    const conn = await mongoose.connect(url);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log("MongoDB connection error:", message);
    process.exit(1);
  }
};
