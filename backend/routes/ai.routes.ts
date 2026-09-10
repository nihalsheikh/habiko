import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  weeklyReport,
  suggestHabits,
  recoveryPlan,
  chatAnalysis,
  morningMotivation,
} from "../controllers/ai.controller";

const router = express.Router();

// auth middleware to protect all habit routes
router.use(protect);

// Routes
router.post("/weekly-report", weeklyReport);
router.post("/suggest-habits", suggestHabits);
router.post("/recovery-plan", recoveryPlan);
router.post("/chat", chatAnalysis);
router.get("/morning", morningMotivation);

export default router;
