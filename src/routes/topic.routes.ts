import { Router } from "express";

import {
  createTopicController,
  getAllTopicsController,
  getTopicController,
  getTopicsForSkillController,
  updateTopicController,
  deleteTopicController,
  addTopicPrerequisiteController,
  deleteTopicPrerequisiteController,
  getUserTopicMasteriesController,
  updateUserTopicMasteryController,
  addResourceToTopicController,
  getResourcesForTopicController,
  removeResourceFromTopicController,
} from "../controllers/topic.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// --------------------------------------------------
// TOPICS
// --------------------------------------------------

// Create topic
router.post(
  "/",
  createTopicController
);

// Get all topics
router.get(
  "/",
  getAllTopicsController
);

// Get topics for a skill
// IMPORTANT: must be before /:topicId
router.get(
  "/skill/:skillId",
  getTopicsForSkillController
);

// Get my topic masteries
router.get(
  "/mastery",
  getUserTopicMasteriesController
);

// Get one topic
router.get(
  "/:topicId",
  getTopicController
);

// Update topic
router.patch(
  "/:topicId",
  updateTopicController
);

// Delete topic
router.delete(
  "/:topicId",
  deleteTopicController
);

// --------------------------------------------------
// TOPIC PREREQUISITES
// --------------------------------------------------

// Add prerequisite
router.post(
  "/:topicId/prerequisites",
  addTopicPrerequisiteController
);

// Delete prerequisite
router.delete(
  "/:topicId/prerequisites/:prerequisiteId",
  deleteTopicPrerequisiteController
);

// --------------------------------------------------
// TOPIC MASTERY
// --------------------------------------------------

// Update/create mastery for the authenticated user
router.patch(
  "/:topicId/mastery",
  updateUserTopicMasteryController
);

// --------------------------------------------------
// TOPIC ↔ RESOURCE
// --------------------------------------------------

// Add resource to topic
router.post(
  "/:topicId/resources",
  addResourceToTopicController
);

// Get resources for topic
router.get(
  "/:topicId/resources",
  getResourcesForTopicController
);

// Remove resource from topic
router.delete(
  "/:topicId/resources/:resourceId",
  removeResourceFromTopicController
);

export default router;