
import { z } from "zod";

// --------------------------------------------------
// CREATE TOPIC
// --------------------------------------------------

export const createTopicSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Topic name must contain at least 2 characters"
    )
    .max(
      200,
      "Topic name cannot exceed 200 characters"
    ),

  description: z
    .string()
    .trim()
    .max(
      1000,
      "Description cannot exceed 1000 characters"
    )
    .optional(),

  skillId: z
    .string()
    .uuid("Invalid skill ID"),
});

// --------------------------------------------------
// UPDATE TOPIC
// --------------------------------------------------

export const updateTopicSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000)
    .nullable()
    .optional(),
});

// --------------------------------------------------
// TOPIC PREREQUISITE
// --------------------------------------------------
//
// topicId comes from:
// /:topicId/prerequisites
//
// Body contains only prerequisiteId.
// --------------------------------------------------

export const topicPrerequisiteSchema =
  z.object({
    prerequisiteId: z
      .string()
      .uuid("Invalid prerequisite topic ID"),
  });

// --------------------------------------------------
// TOPIC MASTERY
// --------------------------------------------------
//
// topicId comes from:
// /:topicId/mastery
//
// userId comes from authenticated user.
// --------------------------------------------------

export const updateTopicMasterySchema =
  z.object({
    score: z
      .number()
      .int()
      .min(0)
      .max(100),

    status: z.enum([
      "NOT_PREPARED",
      "NEEDS_IMPROVEMENT",
      "PREPARED",
    ]),
  });

// --------------------------------------------------
// TOPIC ↔ RESOURCE
// --------------------------------------------------
//
// topicId comes from:
// /:topicId/resources
//
// Body contains only resourceId.
// --------------------------------------------------

export const topicResourceSchema =
  z.object({
    resourceId: z
      .string()
      .uuid("Invalid resource ID"),
  });

// --------------------------------------------------
// TYPES
// --------------------------------------------------

export type CreateTopicInput = z.infer<
  typeof createTopicSchema
>;

export type UpdateTopicInput = z.infer<
  typeof updateTopicSchema
>;

export type TopicPrerequisiteInput =
  z.infer<typeof topicPrerequisiteSchema>;

export type UpdateTopicMasteryInput =
  z.infer<typeof updateTopicMasterySchema>;

export type TopicResourceInput =
  z.infer<typeof topicResourceSchema>;

