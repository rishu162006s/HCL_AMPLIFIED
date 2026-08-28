import llm from "../llm/llm";
import { recommendationPrompt } from "../prompts/recommendation.prompt";
import { recommendationSchema } from "../schemas/recommendation.schema";

const structuredLLM = llm.withStructuredOutput(
  recommendationSchema
);

export const recommendationChain =
  recommendationPrompt.pipe(structuredLLM);

export const generateRecommendationsWithAI =
  async (data: {
    goal: string;
    skill: string;
    currentLevel: string;
    weakTopics: string[];
    completedTopics: string[];
    recentProgress: string;
    availableTime: string;
  }) => {
    return recommendationChain.invoke({
      goal: data.goal,
      skill: data.skill,
      currentLevel: data.currentLevel,
      weakTopics:
        data.weakTopics.join(", ") ||
        "None available",
      completedTopics:
        data.completedTopics.join(", ") ||
        "None available",
      recentProgress: data.recentProgress,
      availableTime: data.availableTime,
    });
  };