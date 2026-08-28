import { Router } from "express";

import {
  getLearningInsightsController,
} from "../controllers/learning-insights.controller";

import {
  authenticate,
} from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  getLearningInsightsController
);

export default router;