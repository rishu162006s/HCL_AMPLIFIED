
import { z } from "zod";

export const quizSchema = z.object({
  title: z.string(),

  description: z.string(),

  questions: z.array(
    z.object({
      question: z.string(),

      options: z
        .array(z.string())
        .length(4),

      correctAnswer: z
        .number()
        .int()
        .min(0)
        .max(3),

      explanation: z.string(),

      difficulty: z.enum([
        "EASY",
        "MEDIUM",
        "HARD",
      ]),
    })
  ),
});

export type AIQuiz =
  z.infer<typeof quizSchema>;




