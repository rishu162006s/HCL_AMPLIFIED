import { Router } from "express";

import {
  createSkillController,
  deleteSkillController,
  getAllSkillsController,
  getMySkillsController,
  getSkillController,
  updateMySkillController,
  updateSkillController,
} from "../controllers/skill.controllers";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getAllSkillsController);

router.get(
  "/me",
  authenticate,
  getMySkillsController
);

router.get(
  "/:skillId",
  getSkillController
);

router.post(
  "/",
  authenticate,
  createSkillController
);

router.patch(
  "/:skillId",
  authenticate,
  updateSkillController
);

router.delete(
  "/:skillId",
  authenticate,
  deleteSkillController
);

router.post(
  "/me",
  authenticate,
  updateMySkillController
);

export default router;