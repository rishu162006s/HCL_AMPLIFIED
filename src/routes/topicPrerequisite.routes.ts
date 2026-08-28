import { Router } from "express";

import {
  addTopicPrerequisiteController,
  deleteTopicPrerequisiteController,
  getTopicPrerequisitesController,
} from "../controllers/topicPrerequisite.controller";

import {
  authenticate,
} from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// Add prerequisite
router.post(
  "/topics/:topicId/prerequisites",
  addTopicPrerequisiteController
);

// Get prerequisites
router.get(
  "/topics/:topicId/prerequisites",
  getTopicPrerequisitesController
);

// Remove prerequisite
router.delete(
  "/topics/:topicId/prerequisites/:prerequisiteId",
  deleteTopicPrerequisiteController
);

export default router;