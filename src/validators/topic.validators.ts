import { z } from "zod";

export const createTopicSchema = z.object({
  name: z
    .string()
    .min(2, "Topic name must contain at least 2 characters")
    .max(200, "Topic name cannot exceed 200 characters"),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  skillId: z.string().uuid("Invalid skill ID"),
});

export const updateTopicSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(200)
    .optional(),

  description: z
    .string()
    .max(1000)
    .nullable()
    .optional(),
});

export const prerequisiteSchema = z.object({
  prerequisiteId: z.string().uuid(
    "Invalid prerequisite topic ID"
  ),
});

export const topicMasterySchema = z.object({
  topicId: z.string().uuid("Invalid topic ID"),

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

export type CreateTopicInput = z.infer<
  typeof createTopicSchema
>;

export type UpdateTopicInput = z.infer<
  typeof updateTopicSchema
>;

export type TopicMasteryInput = z.infer<
  typeof topicMasterySchema
>;