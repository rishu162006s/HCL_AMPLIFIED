import { z } from "zod";

export const createQuizSchema = z.object({
  title: z
    .string()
    .min(2)
    .max(200),

  topicId: z.string().uuid(),
});

export const updateQuizSchema = z.object({
  title: z
    .string()
    .min(2)
    .max(200)
    .optional(),
});

export const createQuizQuestionSchema =
  z.object({
    question: z
      .string()
      .min(5)
      .max(2000),
  });

export const updateQuizQuestionSchema =
  z.object({
    question: z
      .string()
      .min(5)
      .max(2000)
      .optional(),
  });

export const createQuizAnswerSchema =
  z.object({
    answerText: z
      .string()
      .min(1)
      .max(1000),

    isCorrect: z
      .boolean()
      .optional(),
  });

export const updateQuizAnswerSchema =
  z.object({
    answerText: z
      .string()
      .min(1)
      .max(1000)
      .optional(),

    isCorrect: z
      .boolean()
      .optional(),
  });

export const submitQuizSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        answerId: z.string().uuid(),
      })
    )
    .min(1),
});