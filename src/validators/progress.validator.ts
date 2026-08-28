import { z } from "zod";

export const createProgressSchema = z.object({
  resourceId: z.string().uuid(),

  status: z
    .enum([
      "NOT_STARTED",
      "IN_PROGRESS",
      "COMPLETED",
    ])
    .optional(),

  progress: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional(),
});

export const updateProgressSchema = z.object({
  status: z
    .enum([
      "NOT_STARTED",
      "IN_PROGRESS",
      "COMPLETED",
    ])
    .optional(),

  progress: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional(),
});