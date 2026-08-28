import { Router } from "express";

import {
  getAdaptiveLearningPathController,
  recalculateLearningPathController,
} from "../controllers/adaptive-learning-path.controller";

import {
  authenticate,
} from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/:pathId",
  getAdaptiveLearningPathController
);

router.post(
  "/:pathId/recalculate",
  recalculateLearningPathController
);

export default router;