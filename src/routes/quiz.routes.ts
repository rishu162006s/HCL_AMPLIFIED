import { Router } from "express";

import {
  addAnswerController,
  addQuestionController,
  createQuizController,
  deleteAnswerController,
  deleteQuestionController,
  deleteQuizController,
  getMyQuizAttemptsController,
  getQuestionController,
  getQuizController,
  getQuizzesController,
  getQuizzesForTopicController,
  submitQuizController,
  updateAnswerController,
  updateQuestionController,
  updateQuizController,
} from "../controllers/quiz.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// --------------------------------------------------
// AUTHENTICATION
// --------------------------------------------------

router.use(authenticate);

// --------------------------------------------------
// QUIZZES
// --------------------------------------------------

// Create quiz
router.post(
  "/",
  createQuizController
);

// Get all quizzes
router.get(
  "/",
  getQuizzesController
);

// Get my quiz attempts
// IMPORTANT: keep this before /:quizId
router.get(
  "/attempts/me",
  getMyQuizAttemptsController
);

// Get quizzes for a topic
// IMPORTANT: keep this before /:quizId
router.get(
  "/topic/:topicId",
  getQuizzesForTopicController
);

// Get one quiz
router.get(
  "/:quizId",
  getQuizController
);

// Update quiz
router.patch(
  "/:quizId",
  updateQuizController
);

// Delete quiz
router.delete(
  "/:quizId",
  deleteQuizController
);

// --------------------------------------------------
// QUIZ QUESTIONS
// --------------------------------------------------

// Add question
router.post(
  "/:quizId/questions",
  addQuestionController
);

// Get question
router.get(
  "/questions/:questionId",
  getQuestionController
);

// Update question
router.patch(
  "/questions/:questionId",
  updateQuestionController
);

// Delete question
router.delete(
  "/questions/:questionId",
  deleteQuestionController
);

// --------------------------------------------------
// QUESTION ANSWERS
// --------------------------------------------------

// Add answer
router.post(
  "/questions/:questionId/answers",
  addAnswerController
);

// Update answer
router.patch(
  "/answers/:answerId",
  updateAnswerController
);

// Delete answer
router.delete(
  "/answers/:answerId",
  deleteAnswerController
);

// --------------------------------------------------
// QUIZ SUBMISSION
// --------------------------------------------------

// Submit quiz
router.post(
  "/:quizId/submit",
  submitQuizController
);

export default router;