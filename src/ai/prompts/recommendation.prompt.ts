import { ChatPromptTemplate } from "@langchain/core/prompts";

export const recommendationPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are a personalized learning recommendation engine.

Analyze the user's current learning state and recommend the most
useful next actions.

Consider:
- current skill
- current proficiency
- weak topics
- completed topics
- learning progress
- goal
- available time
- recent activity

Recommendations should be actionable and prioritized.

Do not recommend something the user has already mastered.

Return structured output matching the supplied schema.
`,
  ],
  [
    "human",
    `
Goal:
{goal}

Skill:
{skill}

Current level:
{currentLevel}

Weak topics:
{weakTopics}

Completed topics:
{completedTopics}

Recent progress:
{recentProgress}

Available time:
{availableTime}
`,
  ],
]);