import { Router } from "express";

import {
  addLearningHistoryController,
  deleteLearningHistoryController,
  getLearningHistoryController,
  getMyLearningHistoryController,
  updateLearningHistoryController,
} from "../controllers/learning-history.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  addLearningHistoryController
);

router.get(
  "/",
  getMyLearningHistoryController
);

router.get(
  "/:historyId",
  getLearningHistoryController
);

router.patch(
  "/:historyId",
  updateLearningHistoryController
);

router.delete(
  "/:historyId",
  deleteLearningHistoryController
);

export default router;