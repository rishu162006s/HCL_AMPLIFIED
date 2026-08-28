import { z } from "zod";

export const createSkillSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100),

  description: z
    .string()
    .max(1000)
    .optional(),
});

export const updateSkillSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .optional(),

  description: z
    .string()
    .max(1000)
    .nullable()
    .optional(),
});

export const userSkillSchema = z.object({
  skillId: z.string().uuid(),

  level: z.enum([
    "NONE",
    "BASIC",
    "INTERMEDIATE",
    "EXPERT",
  ]),
});

export type CreateSkillInput = z.infer<
  typeof createSkillSchema
>;

export type UserSkillInput = z.infer<
  typeof userSkillSchema
>;