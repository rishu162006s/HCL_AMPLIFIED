import { Router } from "express";

import {
  createResourceController,
  deleteResourceController,
  getResourceController,
  getResourcesByDifficultyController,
  getResourcesByTypeController,
  getResourcesController,
  updateResourceController,
} from "../controllers/resource.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Get all resources
router.get(
  "/",
  getResourcesController
);

// Get resources by type
router.get(
  "/type/:type",
  getResourcesByTypeController
);

// Get resources by difficulty
router.get(
  "/difficulty/:difficulty",
  getResourcesByDifficultyController
);

// Get single resource
router.get(
  "/:resourceId",
  getResourceController
);

// Create resource
router.post(
  "/",
  authenticate,
  createResourceController
);

// Update resource
router.patch(
  "/:resourceId",
  authenticate,
  updateResourceController
);

// Delete resource
router.delete(
  "/:resourceId",
  authenticate,
  deleteResourceController
);

export default router;