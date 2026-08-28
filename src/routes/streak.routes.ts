import { Router } from "express";

import {
  getStreakController,
  getStreakHistoryController,
} from "../controllers/streak.controller";

import {
  authenticate,
} from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  getStreakController
);

router.get(
  "/history",
  getStreakHistoryController
);

export default router;