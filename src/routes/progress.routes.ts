import { Router } from "express";

import {
  createProgressController,
  deleteProgressController,
  getMyProgressController,
  getProgressByStatusController,
  getProgressController,
  updateProgressController,
} from "../controllers/progress.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  createProgressController
);

router.get(
  "/",
  getMyProgressController
);

router.get(
  "/filter/status",
  getProgressByStatusController
);

router.get(
  "/:progressId",
  getProgressController
);

router.patch(
  "/:progressId",
  updateProgressController
);

router.delete(
  "/:progressId",
  deleteProgressController
);

export default router;