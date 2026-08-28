import llm from "../llm/llm";
import { quizGenerationPrompt } from "../prompts/quiz-generation.prompt";
import { quizSchema } from "../schemas/quiz.schema";

const structuredLLM = llm.withStructuredOutput(
  quizSchema
);

export const quizGenerationChain =
  quizGenerationPrompt.pipe(structuredLLM);

export const generateQuizWithAI = async (
  data: {
    topic: string;
    description: string;
    difficulty: string;
    questionCount: number;
  }
) => {
  return quizGenerationChain.invoke({
    topic: data.topic,
    description: data.description,
    difficulty: data.difficulty,
    questionCount: data.questionCount,
  });
};