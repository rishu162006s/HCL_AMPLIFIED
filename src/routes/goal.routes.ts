import { Router } from "express";

import {
  addGoalSkillController,
  createGoalController,
  deleteGoalController,
  deleteGoalSkillController,
  getGoalController,
  getMyGoalsController,
  updateGoalController,
  updateGoalSkillController,
} from "../controllers/goal.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/me",
  authenticate,
  getMyGoalsController
);

router.get(
  "/:goalId",
  authenticate,
  getGoalController
);

router.post(
  "/",
  authenticate,
  createGoalController
);

router.patch(
  "/:goalId",
  authenticate,
  updateGoalController
);

router.delete(
  "/:goalId",
  authenticate,
  deleteGoalController
);

router.post(
  "/:goalId/skills",
  authenticate,
  addGoalSkillController
);

router.patch(
  "/:goalId/skills/:skillId",
  authenticate,
  updateGoalSkillController
);

router.delete(
  "/:goalId/skills/:skillId",
  authenticate,
  deleteGoalSkillController
);

export default router;