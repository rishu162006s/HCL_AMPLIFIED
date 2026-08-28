import {
  Response,
} from "express";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

import {
  getDashboard,
} from "../services/dashboard.service";

// --------------------------------------------------
// GET DASHBOARD
// --------------------------------------------------

export const getDashboardController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId =
        req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });

        return;
      }

      const dashboard =
        await getDashboard(userId);

      res.status(200).json({
        success: true,
        data: dashboard,
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

      console.error(
        "Dashboard error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };