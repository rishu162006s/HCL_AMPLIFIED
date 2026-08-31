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
  generateLearningPathController,
} from "../controllers/learningPath.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// --------------------------------------------------
// LEARNING PATH
// --------------------------------------------------

// Manual learning path creation
router.post(
  "/",
  createLearningPathController
);

// AI-generated learning path
// IMPORTANT: this must be before /:learningPathId
router.post(
  "/generate",
  generateLearningPathController
);

// Get all my learning paths
router.get(
  "/",
  getMyLearningPathsController
);

// Get one learning path
router.get(
  "/:learningPathId",
  getLearningPathController
);

// Update learning path
router.patch(
  "/:learningPathId",
  updateLearningPathController
);

// Delete learning path
router.delete(
  "/:learningPathId",
  deleteLearningPathController
);

// --------------------------------------------------
// LEARNING STEPS
// --------------------------------------------------

// Add resource to learning path
router.post(
  "/:learningPathId/steps",
  addLearningStepController
);

// Delete learning step
router.delete(
  "/:learningPathId/steps/:stepId",
  deleteLearningStepController
);

// Reorder learning step
router.patch(
  "/:learningPathId/steps/:stepId/order",
  reorderLearningStepController
);

export default router;