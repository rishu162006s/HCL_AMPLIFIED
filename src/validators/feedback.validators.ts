import { z } from "zod";

// --------------------------------------------------
// CREATE FEEDBACK
// --------------------------------------------------

export const createFeedbackSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),

  comment: z
    .string()
    .max(
      1000,
      "Comment cannot exceed 1000 characters"
    )
    .optional(),
});

// --------------------------------------------------
// UPDATE FEEDBACK
// --------------------------------------------------

export const updateFeedbackSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .optional(),

  comment: z
    .string()
    .max(
      1000,
      "Comment cannot exceed 1000 characters"
    )
    .nullable()
    .optional(),
});

export type CreateFeedbackInput = z.infer<
  typeof createFeedbackSchema
>;

export type UpdateFeedbackInput = z.infer<
  typeof updateFeedbackSchema
>;