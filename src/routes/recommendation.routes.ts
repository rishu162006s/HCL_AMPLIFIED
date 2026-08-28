import { Router } from "express";

import {
  getRecommendationsController,
} from "../controllers/recommendation.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  getRecommendationsController
);

export default router;