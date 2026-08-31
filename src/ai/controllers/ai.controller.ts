import {
  Request,
  Response,
} from "express";

import {
  analyzeGoal,
  generateLearningPath,
  generateRecommendations,
  generateInsights,
  generateQuiz,
  explainConcept,
} from "../services/ai.service";

import { AuthenticatedRequest } from "../../middleware/auth.middleware";

// ========================================
// AI GOAL UNDERSTANDING
// ========================================

export const analyzeGoalController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { goal, goalId } = req.body;

    if (!goal) {
      res.status(400).json({
        success: false,
        message: "Goal text is required",
      });
      return;
    }

    const result = await analyzeGoal(goal, {
      goalId,
      userId: req.user?.userId,
    });

    res.status(200).json({
      success: true,
      message: "Goal analyzed successfully",
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "GOAL_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Goal not found",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      res.status(403).json({
        success: false,
        message: "You do not have access to this goal",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "AI_SKILL_NOT_FOUND"
    ) {
      res.status(422).json({
        success: false,
        message: "AI could not identify a valid skill for this goal",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "GOAL_TEXT_TOO_SHORT"
    ) {
      res.status(400).json({
        success: false,
        message: "Goal text must contain at least 5 characters",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "AI goal analysis failed",
    });
  }}

// ========================================
// AI LEARNING PATH
// ========================================

export const generateLearningPathController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await generateLearningPath(req.body);

    res.status(200).json({
      success: true,
      message: "AI learning path generated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "AI learning path generation failed",
    });
  }
};

// ========================================
// AI RECOMMENDATIONS
// ========================================

export const generateRecommendationsController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const result =
        await generateRecommendations(req.body);

      res.status(200).json({
        success: true,
        message:
          "AI recommendations generated successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "AI recommendation generation failed",
      });
    }
  };

// ========================================
// AI LEARNING INSIGHTS
// ========================================

export const generateInsightsController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const result =
        await generateInsights(req.body);

      res.status(200).json({
        success: true,
        message:
          "AI learning insights generated successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "AI insights generation failed",
      });
    }
  };

// ========================================
// AI QUIZ GENERATION
// ========================================

export const generateQuizController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const result =
        await generateQuiz(req.body);

      res.status(200).json({
        success: true,
        message:
          "AI quiz generated successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "AI quiz generation failed",
      });
    }
  };

// ========================================
// AI PERSONALIZED EXPLANATION
// ========================================

export const explainConceptController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        concept,
        level,
        context = "",
      } = req.body;

      if (!concept) {
        res.status(400).json({
          success: false,
          message: "Concept is required",
        });
        return;
      }

      const result =
        await explainConcept({
          concept,
          level: level || "BEGINNER",
          context,
        });

      res.status(200).json({
        success: true,
        message:
          "Concept explanation generated successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "AI explanation failed",
      });
    }
  };