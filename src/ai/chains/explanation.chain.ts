import llm from "../llm/llm";
import { explanationPrompt } from "../prompts/explanation.prompt";

export const explanationChain =
  explanationPrompt.pipe(llm);

export const explainConceptWithAI = async (
  data: {
    concept: string;
    level: string;
    context: string;
  }
) => {
  const response =
    await explanationChain.invoke({
      concept: data.concept,
      level: data.level,
      context: data.context,
    });

  return {
    explanation:
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content),
  };
};