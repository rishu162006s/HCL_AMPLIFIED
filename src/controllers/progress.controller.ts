import {
  Response,
} from "express";

import {
  createNewProgress,
  getMyProgress,
  getProgress,
  getProgressByStatus,
  removeProgress,
  updateMyProgress,
} from "../services/progress.service";

import {
  createProgressSchema,
  updateProgressSchema,
} from "../validators/progress.validator";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

// --------------------------------------------------
// CREATE PROGRESS
// --------------------------------------------------

export const createProgressController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const data =
        createProgressSchema.parse(
          req.body
        );

      const progress =
        await createNewProgress(
          req.user!.userId,
          data
        );

      res.status(201).json({
        success: true,
        message:
          "Progress created successfully",
        data: progress,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "RESOURCE_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Resource not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "PROGRESS_ALREADY_EXISTS"
      ) {
        res.status(409).json({
          success: false,
          message:
            "Progress already exists for this resource",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "INVALID_PROGRESS_VALUE"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Progress must be between 0 and 100",
        });
        return;
      }

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message:
            error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

// --------------------------------------------------
// GET ALL MY PROGRESS
// --------------------------------------------------

export const getMyProgressController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const progress =
        await getMyProgress(
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch {
      res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

// --------------------------------------------------
// GET ONE PROGRESS
// --------------------------------------------------

export const getProgressController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const progress =
        await getProgress(
          req.user!.userId,
          req.params.progressId as string
        );

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "PROGRESS_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Progress not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_PROGRESS_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You do not have access to this progress record",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

// --------------------------------------------------
// GET PROGRESS BY STATUS
// --------------------------------------------------

export const getProgressByStatusController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const status =
        req.query.status;

      const validStatuses = [
        "NOT_STARTED",
        "IN_PROGRESS",
        "COMPLETED",
      ] as const;

      if (
        typeof status !== "string" ||
        !validStatuses.includes(
          status as
            | "NOT_STARTED"
            | "IN_PROGRESS"
            | "COMPLETED"
        )
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid progress status",
        });
        return;
      }

      const progress =
        await getProgressByStatus(
          req.user!.userId,
          status as
            | "NOT_STARTED"
            | "IN_PROGRESS"
            | "COMPLETED"
        );

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch {
      res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

// --------------------------------------------------
// UPDATE PROGRESS
// --------------------------------------------------

export const updateProgressController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const data =
        updateProgressSchema.parse(
          req.body
        );

      const progress =
        await updateMyProgress(
          req.user!.userId,
          req.params.progressId as string,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Progress updated successfully",
        data: progress,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "PROGRESS_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Progress not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_PROGRESS_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You do not have access to this progress record",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "INVALID_PROGRESS_VALUE"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Progress must be between 0 and 100",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "NO_PROGRESS_UPDATE"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Provide status or progress to update",
        });
        return;
      }

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message:
            error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

// --------------------------------------------------
// DELETE PROGRESS
// --------------------------------------------------

export const deleteProgressController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      await removeProgress(
        req.user!.userId,
        req.params.progressId as string
      );

      res.status(200).json({
        success: true,
        message:
          "Progress deleted successfully",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "PROGRESS_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Progress not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_PROGRESS_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You do not have access to this progress record",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };