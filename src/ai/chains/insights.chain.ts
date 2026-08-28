import llm from "../llm/llm";
import { insightsPrompt } from "../prompts/insights.prompt";
import { insightsSchema } from "../schemas/insights.schema";

const structuredLLM = llm.withStructuredOutput(
  insightsSchema
);

export const insightsChain =
  insightsPrompt.pipe(structuredLLM);

export const generateInsightsWithAI =
  async (data: {
    goal: string;
    learningHistory: string;
    progress: string;
    masteries: string;
    quizPerformance: string;
    streak: string;
  }) => {
    return insightsChain.invoke({
      goal: data.goal,
      learningHistory: data.learningHistory,
      progress: data.progress,
      masteries: data.masteries,
      quizPerformance: data.quizPerformance,
      streak: data.streak,
    });
  };