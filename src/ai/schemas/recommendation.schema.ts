import { z } from "zod";

export const recommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string(),

      description: z.string(),

      type: z.enum([
        "TOPIC",
        "RESOURCE",
        "PRACTICE",
        "QUIZ",
        "PROJECT",
        "REVIEW",
      ]),

      priority: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
      ]),

      reason: z.string(),
    })
  ),
});

export type AIRecommendation =
  z.infer<typeof recommendationSchema>;