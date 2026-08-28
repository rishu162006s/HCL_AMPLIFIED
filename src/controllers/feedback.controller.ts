import { Response } from "express";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

import {
  createNewFeedback,
  getMyFeedback,
  getMyFeedbackById,
  removeMyFeedback,
  updateMyFeedback,
} from "../services/feedback.service";

import {
  createFeedbackSchema,
  updateFeedbackSchema,
} from "../validators/feedback.validators";

// --------------------------------------------------
// CREATE FEEDBACK
// --------------------------------------------------

export const createFeedbackController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const data =
        createFeedbackSchema.parse(
          req.body
        );

      const feedback =
        await createNewFeedback({
          userId: req.user!.userId,
          rating: data.rating,
          comment: data.comment,
        });

      res.status(201).json({
        success: true,
        message:
          "Feedback submitted successfully",
        data: feedback,
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

// --------------------------------------------------
// GET MY FEEDBACK
// --------------------------------------------------

export const getMyFeedbackController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const feedback =
        await getMyFeedback(
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        data: feedback,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

// --------------------------------------------------
// GET ONE FEEDBACK
// --------------------------------------------------

export const getFeedbackController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const feedback =
        await getMyFeedbackById(
          req.user!.userId,
          req.params.feedbackId as string
        );

      res.status(200).json({
        success: true,
        data: feedback,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "FEEDBACK_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Feedback not found",
        });

        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_FEEDBACK_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You cannot access this feedback",
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

// --------------------------------------------------
// UPDATE FEEDBACK
// --------------------------------------------------

export const updateFeedbackController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const data =
        updateFeedbackSchema.parse(
          req.body
        );

      const feedback =
        await updateMyFeedback(
          req.user!.userId,
          req.params.feedbackId as string,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Feedback updated successfully",
        data: feedback,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "FEEDBACK_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Feedback not found",
        });

        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_FEEDBACK_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You cannot modify this feedback",
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

// --------------------------------------------------
// DELETE FEEDBACK
// --------------------------------------------------

export const deleteFeedbackController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      await removeMyFeedback(
        req.user!.userId,
        req.params.feedbackId as string
      );

      res.status(200).json({
        success: true,
        message:
          "Feedback deleted successfully",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "FEEDBACK_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Feedback not found",
        });

        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_FEEDBACK_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You cannot delete this feedback",
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };