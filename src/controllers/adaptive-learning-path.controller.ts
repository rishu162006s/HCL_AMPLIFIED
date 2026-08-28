import {
  Response,
} from "express";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

import {
  getAdaptiveLearningPath,
  recalculateLearningPath,
} from "../services/adaptive-learning.service";

export const getAdaptiveLearningPathController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId =
        req.user!.userId;

      const {
        pathId,
      } = req.params;

      const data =
        await getAdaptiveLearningPath(
          userId,
          pathId as string
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "LEARNING_PATH_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Learning path not found",
        });

        return;
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch adaptive learning path",
      });
    }
  };

export const recalculateLearningPathController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId =
        req.user!.userId;

      const {
        pathId,
      } = req.params;

      const data =
        await recalculateLearningPath(
          userId,
          pathId as string 
        );

      res.status(200).json({
        success: true,
        message:
          "Learning path recalculated successfully",
        data,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "LEARNING_PATH_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Learning path not found",
        });

        return;
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to recalculate learning path",
      });
    }
  };