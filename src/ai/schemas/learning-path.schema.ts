import { z } from "zod";

export const learningPathSchema = z.object({
  title: z.string(),

  description: z.string(),

  estimatedDays: z.number().int().positive(),

  phases: z.array(
    z.object({
      phaseNumber: z.number().int().positive(),

      title: z.string(),

      description: z.string(),

      estimatedDays: z.number().int().positive(),

      topics: z.array(
        z.object({
          name: z.string(),

          description: z.string(),

          priority: z.enum([
            "LOW",
            "MEDIUM",
            "HIGH",
          ]),
        })
      ),
    })
  ),

  dailyStudyRecommendation: z.string(),

  practicalProject: z.string().nullable(),
});

export type LearningPathAI =
  z.infer<typeof learningPathSchema>;