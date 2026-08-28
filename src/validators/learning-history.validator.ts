import { z } from "zod";

export const createLearningHistorySchema =
  z.object({
    resourceId: z.string().uuid(),
    completedAt: z
      .string()
      .datetime()
      .optional(),
  });

export const updateLearningHistorySchema =
  z.object({
    completedAt: z
      .string()
      .datetime()
      .nullable()
      .optional(),
  });