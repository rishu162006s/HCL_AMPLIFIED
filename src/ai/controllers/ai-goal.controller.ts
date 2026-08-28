import {
  Request,
  Response,
} from "express";

import {
  analyzeLearningGoal,
} from "../services/ai-goal.service";

export const analyzeGoalController = async (
  req: Request,
  res: Response
) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      res.status(400).json({
        success: false,
        message: "Goal text is required",
      });

      return;
    }

    const result =
      await analyzeLearningGoal(goal);

    res.status(200).json({
      success: true,
      message: "Goal analyzed successfully",
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "GOAL_TEXT_TOO_SHORT"
    ) {
      res.status(400).json({
        success: false,
        message:
          "Goal must contain at least 5 characters",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        "AI_GOAL_ANALYSIS_FAILED"
    ) {
      res.status(500).json({
        success: false,
        message:
          "Unable to analyze the goal using AI",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};