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

    const result = await analyzeGoal(goal);

    res.status(200).json({
      success: true,
      message: "Goal analyzed successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "AI goal analysis failed",
    });
  }
};

export const generateLearningPathController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const result =
        await generateLearningPath(req.body);

      res.status(200).json({
        success: true,
        message:
          "AI learning path generated successfully",
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