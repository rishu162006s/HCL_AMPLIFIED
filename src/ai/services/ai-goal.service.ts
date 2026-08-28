import {
  analyzeGoalWithAI,
} from "../chains/goal-analysis.chain";

export const analyzeLearningGoal = async (
  goal: string
) => {
  if (!goal || goal.trim().length < 5) {
    throw new Error("GOAL_TEXT_TOO_SHORT");
  }

  try {
    const analysis = await analyzeGoalWithAI(
      goal.trim()
    );

    return {
      originalGoal: goal.trim(),

      analysis,
    };
  } catch (error) {
    console.error(
      "AI goal analysis failed:",
      error
    );

    throw new Error("AI_GOAL_ANALYSIS_FAILED");
  }
};