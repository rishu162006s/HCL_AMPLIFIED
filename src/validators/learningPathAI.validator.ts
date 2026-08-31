import { z } from "zod";

// --------------------------------------------------
// AI GENERATED LEARNING PATH SCHEMA
// --------------------------------------------------

export const learningPathSchema = z.object({
  title: z
    .string()
    .min(1),

  description: z
    .string()
    .min(1),

  estimatedDays: z
    .number()
    .int()
    .positive(),

  phases: z
    .array(
      z.object({
        phaseNumber: z
          .number()
          .int()
          .positive(),

        title: z
          .string()
          .min(1),

        description: z
          .string()
          .min(1),

        estimatedDays: z
          .number()
          .int()
          .positive(),

        topics: z
          .array(
            z.object({
              // IMPORTANT:
              // AI must return the actual database Topic ID
              topicId: z
                .string()
                .uuid(),

              name: z
                .string()
                .min(1),

              description: z
                .string()
                .min(1),

              priority: z
                .enum([
                  "LOW",
                  "MEDIUM",
                  "HIGH",
                ]),
            })
          )
          .min(1),
      })
    )
    .min(1),

  dailyStudyRecommendation: z
    .string()
    .min(1),

  practicalProject: z
    .string()
    .nullable(),
});

// --------------------------------------------------
// TYPE
// --------------------------------------------------

export type LearningPathAI =
  z.infer<typeof learningPathSchema>;