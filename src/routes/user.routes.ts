import { Router } from "express";

import {
  registerUserController,
  loginUserController,
  getCurrentUserController,
} from "../controllers/user.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", registerUserController);

router.post("/login", loginUserController);

router.get(
  "/me",
  authenticate,
  getCurrentUserController
);

export default router;