import {
  Response,
} from "express";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

import {
  getPersonalization,
} from "../services/personalization.service";

export const getPersonalizationController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId =
        req.user!.userId;

      const data =
        await getPersonalization(
          userId
        );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "USER_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });

        return;
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch personalization data",
      });
    }
  };