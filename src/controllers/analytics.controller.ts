import { Response } from "express";

import { getLearningAnalytics } from "../services/analytics.service";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

// --------------------------------------------------
// GET LEARNING ANALYTICS
// --------------------------------------------------

export const getLearningAnalyticsController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const analytics =
        await getLearningAnalytics(
          userId
        );

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error(
        "Analytics error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };