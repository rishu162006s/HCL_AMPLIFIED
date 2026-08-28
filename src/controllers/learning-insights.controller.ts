import {
  Response,
} from "express";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

import {
  getLearningInsights,
} from "../services/learning-insights.service";

export const getLearningInsightsController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId =
        req.user!.userId;

      const data =
        await getLearningInsights(
          userId
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch learning insights",
      });
    }
  };