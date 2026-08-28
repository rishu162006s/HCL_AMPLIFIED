import { ChatPromptTemplate } from "@langchain/core/prompts";

export const quizGenerationPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are an expert technical quiz generator.

Generate a high-quality quiz based on the supplied topic.

Requirements:
- questions must be relevant to the topic
- questions should match the requested difficulty
- each question must have exactly four options
- exactly one option must be correct
- explanations must explain why the answer is correct
- avoid ambiguous questions
- do not repeat questions
- include a mixture of conceptual and practical questions when appropriate

Return structured output matching the supplied schema.
`,
  ],
  [
    "human",
    `
Topic:
{topic}

Description:
{description}

Difficulty:
{difficulty}

Number of questions:
{questionCount}
`,
  ],
]);