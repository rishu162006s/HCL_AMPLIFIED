import { Router } from "express";

import {
  addLearningStepController,
  createLearningPathController,
  deleteLearningPathController,
  deleteLearningStepController,
  getLearningPathController,
  getMyLearningPathsController,
  reorderLearningStepController,
  updateLearningPathController,
} from "../controllers/learningPath.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// --------------------------------------------------
// LEARNING PATH
// --------------------------------------------------

router.post(
  "/",
  createLearningPathController
);

router.get(
  "/",
  getMyLearningPathsController
);

router.get(
  "/:learningPathId",
  getLearningPathController
);

router.patch(
  "/:learningPathId",
  updateLearningPathController
);

router.delete(
  "/:learningPathId",
  deleteLearningPathController
);

// --------------------------------------------------
// LEARNING STEPS
// --------------------------------------------------

router.post(
  "/:learningPathId/steps",
  addLearningStepController
);

router.delete(
  "/:learningPathId/steps/:stepId",
  deleteLearningStepController
);

router.patch(
  "/:learningPathId/steps/:stepId/order",
  reorderLearningStepController
);

export default router;