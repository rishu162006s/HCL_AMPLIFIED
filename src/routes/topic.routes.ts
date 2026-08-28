import { Router } from "express";

import {
  addPrerequisiteController,
  createTopicController,
  deletePrerequisiteController,
  deleteTopicController,
  getTopicController,
  getAllTopicsController,
  getTopicsBySkillController,
  getUserMasteriesController,
  updateTopicController,
  updateUserMasteryController,
  addResourceToTopicController,
  getResourcesForTopicController,
  removeResourceFromTopicController,
} from "../controllers/topic.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// ========================================
// Public topic information
// ========================================

router.get(
  "/",
  getAllTopicsController
);

router.get(
  "/skill/:skillId",
  getTopicsBySkillController
);

// ========================================
// User mastery
// ========================================

router.get(
  "/me/masteries",
  authenticate,
  getUserMasteriesController
);

router.post(
  "/me/masteries",
  authenticate,
  updateUserMasteryController
);

// ========================================
// Topic ↔ Resource
// ========================================

router.get(
  "/:topicId/resources",
  getResourcesForTopicController
);

router.post(
  "/:topicId/resources",
  authenticate,
  addResourceToTopicController
);

router.delete(
  "/:topicId/resources/:resourceId",
  authenticate,
  removeResourceFromTopicController
);

// ========================================
// Topic administration
// ========================================

router.post(
  "/",
  authenticate,
  createTopicController
);

router.patch(
  "/:topicId",
  authenticate,
  updateTopicController
);

router.delete(
  "/:topicId",
  authenticate,
  deleteTopicController
);

// ========================================
// Prerequisites
// ========================================

router.post(
  "/:topicId/prerequisites",
  authenticate,
  addPrerequisiteController
);

router.delete(
  "/:topicId/prerequisites/:prerequisiteId",
  authenticate,
  deletePrerequisiteController
);

// ========================================
// Single topic
// ========================================

router.get(
  "/:topicId",
  getTopicController
);

export default router;