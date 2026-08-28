import { Router } from "express";

import {
  addAnswerController,
  addQuestionController,
  createQuizController,
  getMyQuizAttemptsController,
  getQuizController,
  getQuizzesForTopicController,
  submitQuizController,
} from "../controllers/quiz.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/topic/:topicId",
  getQuizzesForTopicController
);

router.get(
  "/me/attempts",
  authenticate,
  getMyQuizAttemptsController
);

router.get(
  "/:quizId",
  getQuizController
);

router.post(
  "/",
  authenticate,
  createQuizController
);

router.post(
  "/:quizId/questions",
  authenticate,
  addQuestionController
);

router.post(
  "/questions/:questionId/answers",
  authenticate,
  addAnswerController
);

router.post(
  "/:quizId/submit",
  authenticate,
  submitQuizController
);

export default router;