import { z } from "zod";

export const insightsSchema = z.object({
  summary: z.string(),

  strengths: z.array(z.string()),

  weaknesses: z.array(z.string()),

  trends: z.array(z.string()),

  concerns: z.array(z.string()),

  progressAssessment: z.string(),

  recommendations: z.array(z.string()),

  goalProgressPercentage: z
    .number()
    .min(0)
    .max(100),
});

export type AIInsights =
  z.infer<typeof insightsSchema>;