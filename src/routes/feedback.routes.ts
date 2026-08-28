import { Router } from "express";

import {
  createFeedbackController,
  deleteFeedbackController,
  getFeedbackController,
  getMyFeedbackController,
  updateFeedbackController,
} from "../controllers/feedback.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// --------------------------------------------------
// FEEDBACK
// --------------------------------------------------

router.post(
  "/",
  createFeedbackController
);

router.get(
  "/me",
  getMyFeedbackController
);

router.get(
  "/:feedbackId",
  getFeedbackController
);

router.patch(
  "/:feedbackId",
  updateFeedbackController
);

router.delete(
  "/:feedbackId",
  deleteFeedbackController
);

export default router;