
import { z } from "zod";

// --------------------------------------------------
// CREATE QUIZ
// --------------------------------------------------

export const createQuizSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2)
    .max(200),

  topicId: z
    .string()
    .uuid(),
});

// --------------------------------------------------
// UPDATE QUIZ
// --------------------------------------------------

export const updateQuizSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .optional(),
});

// --------------------------------------------------
// CREATE QUESTION
// --------------------------------------------------

export const createQuizQuestionSchema =
  z.object({
    question: z
      .string()
      .trim()
      .min(5)
      .max(2000),
  });

// --------------------------------------------------
// UPDATE QUESTION
// --------------------------------------------------

export const updateQuizQuestionSchema =
  z.object({
    question: z
      .string()
      .trim()
      .min(5)
      .max(2000)
      .optional(),
  });

// --------------------------------------------------
// CREATE ANSWER
// --------------------------------------------------

export const createQuizAnswerSchema =
  z.object({
    answerText: z
      .string()
      .trim()
      .min(1)
      .max(1000),

    isCorrect: z
      .boolean()
      .optional(),
  });

// --------------------------------------------------
// UPDATE ANSWER
// --------------------------------------------------

export const updateQuizAnswerSchema =
  z.object({
    answerText: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .optional(),

    isCorrect: z
      .boolean()
      .optional(),
  });

// --------------------------------------------------
// SUBMIT QUIZ
// --------------------------------------------------

export const submitQuizSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z
          .string()
          .uuid(),

        answerId: z
          .string()
          .uuid(),
      })
    )
    .min(1),
});

