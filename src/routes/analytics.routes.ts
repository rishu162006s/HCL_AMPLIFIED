import { Router } from "express";

import {
  getLearningAnalyticsController,
} from "../controllers/analytics.controller";

import {
  authenticate,
} from "../middleware/auth.middleware";

const router = Router();

// --------------------------------------------------
// GET MY LEARNING ANALYTICS
// --------------------------------------------------

router.get(
  "/overview",
  authenticate,
  getLearningAnalyticsController
);

export default router;