import { Request, Response } from "express";

import {
  addAnswer,
  addQuestion,
  createNewQuiz,
  getMyQuizAttempts,
  getQuestion,
  getQuiz,
  getQuizzes,
  getQuizzesForTopic,
  removeAnswer,
  removeQuestion,
  removeQuiz,
  submitQuiz,
  updateAnswer,
  updateExistingQuiz,
  updateQuestion,
} from "../services/quiz.service";

import {
  createQuizQuestionSchema,
  createQuizSchema,
  createQuizAnswerSchema,
  submitQuizSchema,
  updateQuizAnswerSchema,
  updateQuizQuestionSchema,
  updateQuizSchema,
} from "../validators/quiz.validators";

import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const createQuizController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = createQuizSchema.parse(req.body);

    const quiz = await createNewQuiz(data);

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "TOPIC_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Topic not found",
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getQuizzesController = async (
  req: Request,
  res: Response
) => {
  try {
    const quizzes = await getQuizzes();

    res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getQuizController = async (
  req: Request,
  res: Response
) => {
  try {
    const quiz = await getQuiz(
      req.params.quizId as string
    );

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "QUIZ_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getQuizzesForTopicController = async (
  req: Request,
  res: Response
) => {
  try {
    const quizzes = await getQuizzesForTopic(
      req.params.topicId as string
    );

    res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "TOPIC_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Topic not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateQuizController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = updateQuizSchema.parse(req.body);

    const quiz = await updateExistingQuiz(
        String(req.params.quizId),  
      data
    );

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "QUIZ_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteQuizController = async (
  req: Request,
  res: Response
) => {
  try {
    await removeQuiz(
      req.params.quizId as string
    );

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "QUIZ_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addQuestionController = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      createQuizQuestionSchema.parse(req.body);

    const question = await addQuestion(
      req.params.quizId as string,
      data.question
    );

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: question,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "QUIZ_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getQuestionController = async (
  req: Request,
  res: Response
) => {
  try {
    const question = await getQuestion(
      req.params.questionId as string
    );

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "QUESTION_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Question not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateQuestionController = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      updateQuizQuestionSchema.parse(req.body);

    const question = await updateQuestion(
      req.params.questionId as string,
      data.question!
    );

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: question,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "QUESTION_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Question not found",
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteQuestionController = async (
  req: Request,
  res: Response
) => {
  try {
    await removeQuestion(
      req.params.questionId as string
    );

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "QUESTION_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Question not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addAnswerController = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      createQuizAnswerSchema.parse(req.body);

    const answer = await addAnswer(
      req.params.questionId as string,
      data
    );

    res.status(201).json({
      success: true,
      message: "Answer created successfully",
      data: answer,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "QUESTION_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Question not found",
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateAnswerController = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      updateQuizAnswerSchema.parse(req.body);

    const answer = await updateAnswer(
      req.params.answerId as string,
      data
    );

    res.status(200).json({
      success: true,
      message: "Answer updated successfully",
      data: answer,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "ANSWER_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Answer not found",
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteAnswerController = async (
  req: Request,
  res: Response
) => {
  try {
    await removeAnswer(
      req.params.answerId as string
    );

    res.status(200).json({
      success: true,
      message: "Answer deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "ANSWER_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Answer not found",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const submitQuizController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const data = submitQuizSchema.parse(
      req.body
    );

    const result = await submitQuiz(
      req.user!.userId,
      req.params.quizId as string,
      data.answers
    );

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "QUIZ_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "QUIZ_HAS_NO_QUESTIONS"
    ) {
      res.status(400).json({
        success: false,
        message:
          "Quiz does not contain any questions",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "INVALID_QUESTION"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid question submitted",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "INVALID_ANSWER"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid answer submitted",
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMyQuizAttemptsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const attempts = await getMyQuizAttempts(
      req.user!.userId
    );

    res.status(200).json({
      success: true,
      data: attempts,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};