import { z } from "zod";

export const goalAnalysisSchema = z.object({
  skill: z.string().min(1),

  proficiencyLevel: z.enum([
    "BEGINNER",
    "INTERMEDIATE",
    "ADVANCED",
  ]),

  durationDays: z.number().int().positive().nullable(),

  hasDeadline: z.boolean(),

  objective: z.enum([
    "CAREER",
    "ACADEMIC",
    "PROJECT",
    "INTERVIEW",
    "PERSONAL",
    "OTHER",
  ]),

  intendedOutcome: z.string().nullable(),

  constraints: z.array(z.string()),

  normalizedGoal: z.string().min(1),

  confidence: z.number().min(0).max(1),
});

export type GoalAnalysis = z.infer<
  typeof goalAnalysisSchema
>;