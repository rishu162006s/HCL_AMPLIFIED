import llm from "../llm/llm";
import { goalAnalysisPrompt } from "../prompts/goal-analysts.prompt";
import { goalAnalysisSchema } from "../schemas/goal-analysts.schema";

const structuredLLM = llm.withStructuredOutput(
  goalAnalysisSchema
);

export const goalAnalysisChain =
  goalAnalysisPrompt.pipe(structuredLLM);

export const analyzeGoalWithAI = async (
  goal: string
) => {
  if (!goal || goal.trim().length === 0) {
    throw new Error("GOAL_TEXT_REQUIRED");
  }

  const result = await goalAnalysisChain.invoke({
    goal: goal.trim(),
  });

  return result;
};