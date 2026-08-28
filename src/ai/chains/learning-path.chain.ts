import llm from "../llm/llm";
import { learningPathPrompt } from "../prompts/learning-path.prompt";
import { learningPathSchema } from "../schemas/learning-path.schema";

const structuredLLM = llm.withStructuredOutput(
  learningPathSchema
);

export const learningPathChain =
  learningPathPrompt.pipe(structuredLLM);

export const generateLearningPathWithAI = async (
  data: {
    goal: string;
    skill: string;
    currentLevel: string;
    targetLevel: string;
    durationDays: number | null;
    objective: string;
    constraints: string[];
  }
) => {
  return learningPathChain.invoke({
    goal: data.goal,
    skill: data.skill,
    currentLevel: data.currentLevel,
    targetLevel: data.targetLevel,
    durationDays:
      data.durationDays ?? "Not specified",
    objective: data.objective,
    constraints:
      data.constraints.join(", ") ||
      "No specific constraints",
  });
};