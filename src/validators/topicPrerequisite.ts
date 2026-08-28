import { z } from "zod";

export const addTopicPrerequisiteSchema = z.object({
  prerequisiteId: z
    .string()
    .uuid(),
});