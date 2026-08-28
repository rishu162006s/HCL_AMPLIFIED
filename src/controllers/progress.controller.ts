import { Request, Response } from "express";

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

import { AuthenticatedRequest } from "../middleware/auth.middleware";

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

      const userId = req.user!.userId;

      const progress =
        await createNewProgress(
          userId,
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
        error.message === "RESOURCE_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Resource not found",
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

export const getMyProgressController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user!.userId;

      const progress =
        await getMyProgress(userId);

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

export const getProgressController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user!.userId;
      const progressId =
        req.params.progressId;

      const progress =
        await getProgress(
          userId,
          progressId as string
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
          message: "Progress not found",
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
        message: "Internal server error",
      });
    }
  };

export const getProgressByStatusController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const status = req.query.status;

      const validStatuses = [
        "NOT_STARTED",
        "IN_PROGRESS",
        "COMPLETED",
      ];

      if (
        typeof status !== "string" ||
        !validStatuses.includes(status)
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid progress status",
        });
        return;
      }

      const userId = req.user!.userId;

      const progress =
        await getProgressByStatus(
          userId,
          status as
            | "NOT_STARTED"
            | "IN_PROGRESS"
            | "COMPLETED"
        );

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

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

      const userId = req.user!.userId;
      const progressId =
        req.params.progressId;

      const progress =
        await updateMyProgress(
          userId,
          progressId as string,
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
          message: "Progress not found",
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

export const deleteProgressController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user!.userId;
      const progressId =
        req.params.progressId;

      await removeProgress(
        userId,
        progressId as string
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
          message: "Progress not found",
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
        message: "Internal server error",
      });
    }
  };