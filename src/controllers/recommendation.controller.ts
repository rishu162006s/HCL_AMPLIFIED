import { Response } from "express";

import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { recommendationSchema } from "../validators/recommendation.validators";
import {
  generateRecommendations,
} from "../services/recommendation.service";

export const getRecommendationsController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const data =
        recommendationSchema.parse({
          skillId: req.query.skillId,
          limit: req.query.limit
            ? Number(req.query.limit)
            : undefined,
        });

      const recommendations =
        await generateRecommendations(
          req.user!.userId,
          data.skillId,
          data.limit
        );

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };