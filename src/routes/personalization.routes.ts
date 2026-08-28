import { Router } from "express";

import {
  getPersonalizationController,
} from "../controllers/personalization.controller";

import {
  authenticate,
} from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  getPersonalizationController
);

export default router;