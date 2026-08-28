import { Response } from "express";

import {
  addLearningHistory,
  getLearningHistory,
  getMyLearningHistory,
  removeLearningHistory,
  updateMyLearningHistory,
} from "../services/learning-history.service";

import {
  createLearningHistorySchema,
  updateLearningHistorySchema,
} from "../validators/learning-history.validator";

import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { StringDecoder } from "string_decoder";

export const addLearningHistoryController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const data =
        createLearningHistorySchema.parse(
          req.body
        );

      const userId = req.user!.userId;

      const history =
        await addLearningHistory(
          userId,
          data
        );

      res.status(201).json({
        success: true,
        message:
          "Learning history added successfully",
        data: history,
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
          "RESOURCE_ALREADY_IN_HISTORY"
      ) {
        res.status(409).json({
          success: false,
          message:
            "Resource already exists in learning history",
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

export const getMyLearningHistoryController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user!.userId;

      const history =
        await getMyLearningHistory(userId);

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

export const getLearningHistoryController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user!.userId;
      const historyId =
        req.params.historyId as string;

      const history =
        await getLearningHistory(
          userId,
          historyId
        );

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "LEARNING_HISTORY_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Learning history record not found",
        });

        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_HISTORY_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You do not have access to this history record",
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

export const updateLearningHistoryController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const data =
        updateLearningHistorySchema.parse(
          req.body
        );

      const userId = req.user!.userId;
      const historyId =
        req.params.historyId;

      const history =
        await updateMyLearningHistory(
          userId,
          historyId as string,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Learning history updated successfully",
        data: history,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "LEARNING_HISTORY_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Learning history record not found",
        });

        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_HISTORY_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You do not have access to this history record",
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

export const deleteLearningHistoryController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user!.userId;
      const historyId =
        req.params.historyId;

      await removeLearningHistory(
        userId,
        historyId as string
      );

      res.status(200).json({
        success: true,
        message:
          "Learning history deleted successfully",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "LEARNING_HISTORY_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Learning history record not found",
        });

        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_HISTORY_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You do not have access to this history record",
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };