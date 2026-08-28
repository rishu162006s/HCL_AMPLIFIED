import { ChatPromptTemplate } from "@langchain/core/prompts";

export const learningPathPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are an expert personalized learning-path designer.

Create a practical learning path based on the user's goal.

Consider:
- user's target skill
- current proficiency
- desired proficiency
- available duration
- learning objective
- constraints
- topics that should be learned first
- prerequisite relationships
- theory and practical work

The learning path should progress from fundamentals to advanced concepts.

Do not invent unrealistic requirements.

Return structured output matching the supplied schema.
`,
  ],
  [
    "human",
    `
User goal:
{goal}

Skill:
{skill}

Current level:
{currentLevel}

Target level:
{targetLevel}

Duration in days:
{durationDays}

Objective:
{objective}

Constraints:
{constraints}
`,
  ],
]);