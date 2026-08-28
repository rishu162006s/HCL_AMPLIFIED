import { Router } from "express";

import {
  analyzeGoalController,
  generateLearningPathController,
  generateRecommendationsController,
  generateInsightsController,
  generateQuizController,
  explainConceptController,
} from "../controllers/ai.controller";

import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// ========================================
// AI GOAL UNDERSTANDING
// ========================================

router.post(
  "/goals/analyze",
  authenticate,
  analyzeGoalController
);

// ========================================
// AI LEARNING PATH
// ========================================

router.post(
  "/learning-path",
  authenticate,
  generateLearningPathController
);

// ========================================
// AI RECOMMENDATIONS
// ========================================

router.post(
  "/recommendations",
  authenticate,
  generateRecommendationsController
);

// ========================================
// AI LEARNING INSIGHTS
// ========================================

router.post(
  "/insights",
  authenticate,
  generateInsightsController
);

// ========================================
// AI QUIZ GENERATION
// ========================================

router.post(
  "/quiz",
  authenticate,
  generateQuizController
);

// ========================================
// AI PERSONALIZED EXPLANATION
// ========================================

router.post(
  "/explain",
  authenticate,
  explainConceptController
);

export default router;