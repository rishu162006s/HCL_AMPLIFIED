import { z } from "zod";

export const learningPathSchema = z.object({
  title: z.string().min(1).default("Personalized Learning Path"),

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
          name: z.string().min(1).default("Practical Project"),

          description: z.string().min(1).default("Build a practical project to apply this phase."),

          priority: z.enum([
            "LOW",
            "MEDIUM",
            "HIGH",
          ]).default("MEDIUM"),
        })
      ),
    })
  ),

  dailyStudyRecommendation: z.string(),

  practicalProject: z.string().nullable().default(null),
});

export type LearningPathAI =
  z.infer<typeof learningPathSchema>;