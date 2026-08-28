import {
  Router,
} from "express";

import {
  getDashboardController,
} from "../controllers/dashboard.controller";

import {
  authenticate,
} from "../middleware/auth.middleware";

const router = Router();

// --------------------------------------------------
// DASHBOARD
// --------------------------------------------------

router.get(
  "/",
  authenticate,
  getDashboardController
);

export default router;