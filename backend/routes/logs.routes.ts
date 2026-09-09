import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  markComplete,
  unmarkComplete,
  getToday,
  getRange,
  getHeatmap,
  getHabitStats,
  getAllStats,
} from "../controllers/log.controller";

const router = express.Router();

// auth middleware to protect all habit routes
router.use(protect);

// Routes
router.post("/", markComplete);
router.delete("/", unmarkComplete);
router.get("/today", getToday);
router.get("/range", getRange);
router.get("/heatmap", getHeatmap);
router.get("/stats", getAllStats);
router.get("/stats/:habitId", getHabitStats);

export default router;
