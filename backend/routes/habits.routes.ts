import express from "express";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  archiveHabit,
  reorderHabits,
} from "../controllers/habit.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// auth middleware to protect all habit routes
router.use(protect);

// routes
router.get("/", getHabits);
router.post("/", createHabit);
router.put("/reorder", reorderHabits);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);
router.put("/:id/archive", archiveHabit);

export default router;
