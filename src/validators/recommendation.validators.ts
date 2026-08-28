import { z } from "zod";

export const recommendationSchema = z.object({
  skillId: z.string().uuid().optional(),
  limit: z.number().int().min(1).max(20).optional(),
});