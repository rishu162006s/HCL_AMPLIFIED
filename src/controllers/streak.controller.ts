import {
  Response,
} from "express";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

import {
  getMyStreak,
  getMyStreakHistory,
} from "../services/streak.service";

export const getStreakController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const streak =
      await getMyStreak(userId);

    res.status(200).json({
      success: true,
      data: streak,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch streak",
    });
  }
};

export const getStreakHistoryController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId =
        req.user!.userId;

      const history =
        await getMyStreakHistory(userId);

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch streak history",
      });
    }
  };