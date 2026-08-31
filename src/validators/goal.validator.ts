import { z } from "zod";

export const createGoalSchema = z.object({
  title: z
    .string()
    .min(2)
    .max(200),

  description: z
    .string()
    .max(2000)
    .optional(),

  objective: z.enum([
    "PERSONAL",
    "CAREER",
    "ACADEMIC",
    "INTERVIEW",
    "PROJECT",
  ]),

  targetDate: z
    .coerce
    .date()
    .optional(),

  weeklyHours: z
    .number()
    .positive()
    .max(168)
    .optional(),

  preferredResourceTypes: z
    .union([
      z.enum([
        "COURSE",
        "PROJECT",
        "ARTICLE",
        "VIDEO",
        "BOOK",
        "ASSESSMENT",
      ]),
      z.array(
        z.enum([
          "COURSE",
          "PROJECT",
          "ARTICLE",
          "VIDEO",
          "BOOK",
          "ASSESSMENT",
        ])
      ),
    ])
    .optional(),

  theoryPracticeRatio: z
    .enum([
      "MORE_THEORY",
      "BALANCED",
      "MORE_PRACTICE",
    ])
    .optional(),
});

export const updateGoalSchema = z.object({
  title: z
    .string()
    .min(2)
    .max(200)
    .optional(),

  description: z
    .string()
    .max(2000)
    .nullable()
    .optional(),

  status: z
    .enum([
      "ACTIVE",
      "COMPLETED",
      "PAUSED",
    ])
    .optional(),

  objective: z
    .enum([
      "PERSONAL",
      "CAREER",
      "ACADEMIC",
      "INTERVIEW",
      "PROJECT",
    ])
    .optional(),

  targetDate: z
    .coerce
    .date()
    .nullable()
    .optional(),

  weeklyHours: z
    .number()
    .positive()
    .max(168)
    .nullable()
    .optional(),

  preferredResourceTypes: z
    .union([
      z.enum([
        "COURSE",
        "PROJECT",
        "ARTICLE",
        "VIDEO",
        "BOOK",
        "ASSESSMENT",
      ]),
      z.array(
        z.enum([
          "COURSE",
          "PROJECT",
          "ARTICLE",
          "VIDEO",
          "BOOK",
          "ASSESSMENT",
        ])
      ),
    ])
    .optional(),

  theoryPracticeRatio: z
    .enum([
      "MORE_THEORY",
      "BALANCED",
      "MORE_PRACTICE",
    ])
    .nullable()
    .optional(),
});

export const goalSkillSchema = z.object({
  skillId: z.string().uuid(),

  currentLevel: z.enum([
    "NONE",
    "BASIC",
    "INTERMEDIATE",
    "EXPERT",
  ]),

  targetLevel: z.enum([
    "NONE",
    "BASIC",
    "INTERMEDIATE",
    "EXPERT",
  ]),
});

export type CreateGoalInput = z.infer<
  typeof createGoalSchema
>;

export type UpdateGoalInput = z.infer<
  typeof updateGoalSchema
>;

export type GoalSkillInput = z.infer<
  typeof goalSkillSchema
>;