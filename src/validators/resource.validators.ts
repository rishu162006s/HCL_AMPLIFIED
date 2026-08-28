import { z } from "zod";

const resourceTypes = [
  "COURSE",
  "PROJECT",
  "ARTICLE",
  "VIDEO",
  "BOOK",
  "ASSESSMENT",
] as const;

const experienceLevels = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
] as const;

export const createResourceSchema = z.object({
  title: z
    .string()
    .min(2, "Resource title must contain at least 2 characters")
    .max(200, "Resource title cannot exceed 200 characters"),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  url: z
    .string()
    .url("Please provide a valid resource URL"),

  type: z.enum(resourceTypes),

  difficulty: z
    .enum(experienceLevels)
    .optional(),
});

export const updateResourceSchema = z.object({
  title: z
    .string()
    .min(2)
    .max(200)
    .optional(),

  description: z
    .string()
    .max(1000)
    .nullable()
    .optional(),

  url: z
    .string()
    .url("Please provide a valid resource URL")
    .optional(),

  type: z
    .enum(resourceTypes)
    .optional(),

  difficulty: z
    .enum(experienceLevels)
    .nullable()
    .optional(),
});

export const resourceTypeSchema = z.object({
  type: z.enum(resourceTypes),
});

export const resourceDifficultySchema = z.object({
  difficulty: z.enum(experienceLevels),
});

export type CreateResourceInput = z.infer<
  typeof createResourceSchema
>;

export type UpdateResourceInput = z.infer<
  typeof updateResourceSchema
>;