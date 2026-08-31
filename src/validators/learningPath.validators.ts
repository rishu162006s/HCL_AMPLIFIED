import { z } from "zod";

// --------------------------------------------------
// CREATE LEARNING PATH
// --------------------------------------------------

export const createLearningPathSchema =
  z.object({
    title: z
      .string()
      .min(
        2,
        "Title must contain at least 2 characters"
      )
      .max(
        200,
        "Title cannot exceed 200 characters"
      ),

    description: z
      .string()
      .max(
        1000,
        "Description cannot exceed 1000 characters"
      )
      .optional(),

    goalId: z
      .string()
      .uuid()
      .optional(),
  });

// --------------------------------------------------
// UPDATE LEARNING PATH
// --------------------------------------------------

export const updateLearningPathSchema =
  z.object({
    title: z
      .string()
      .min(
        2,
        "Title must contain at least 2 characters"
      )
      .max(
        200,
        "Title cannot exceed 200 characters"
      )
      .optional(),

    description: z
      .string()
      .max(
        1000,
        "Description cannot exceed 1000 characters"
      )
      .nullable()
      .optional(),
  });

// --------------------------------------------------
// ADD LEARNING STEP
// --------------------------------------------------

export const addLearningStepSchema =
  z.object({
    resourceId: z
      .string()
      .uuid(),

    milestone: z
      .string()
      .max(
        500,
        "Milestone cannot exceed 500 characters"
      )
      .optional(),
  });

// --------------------------------------------------
// REORDER LEARNING STEP
// --------------------------------------------------

export const reorderLearningStepSchema =
  z.object({
    order: z
      .number()
      .int()
      .min(
        1,
        "Order must be at least 1"
      ),
  });
  // --------------------------------------------------
// GENERATE LEARNING PATH
// --------------------------------------------------

// --------------------------------------------------
// GENERATE LEARNING PATH
// --------------------------------------------------

export const generateLearningPathSchema =
  z.object({
    goalId: z
      .string()
      .uuid(),
  });
  