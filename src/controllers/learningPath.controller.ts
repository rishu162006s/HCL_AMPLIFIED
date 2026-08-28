import {
  Request,
  Response,
} from "express";

import {
  addResourceToLearningPath,
  createNewLearningPath,
  getMyLearningPath,
  getMyLearningPaths,
  removeLearningPath,
  removeLearningStep,
  reorderLearningStep,
  updateMyLearningPath,
} from "../services/learningPath.service";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

import {
  addLearningStepSchema,
  createLearningPathSchema,
  reorderLearningStepSchema,
  updateLearningPathSchema,
} from "../validators/learningPath.validators";

// --------------------------------------------------
// CREATE
// --------------------------------------------------

export const createLearningPathController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const data =
        createLearningPathSchema.parse(
          req.body
        );

      const learningPath =
        await createNewLearningPath(
          req.user!.userId,
          data
        );

      res.status(201).json({
        success: true,
        message:
          "Learning path created successfully",
        data: learningPath,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "GOAL_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Goal not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_GOAL_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You cannot use another user's goal",
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
        message:
          "Internal server error",
      });
    }
  };

// --------------------------------------------------
// GET ALL
// --------------------------------------------------

export const getMyLearningPathsController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const paths =
        await getMyLearningPaths(
          req.user!.userId
        );

      res.status(200).json({
        success: true,
        data: paths,
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
// GET ONE
// --------------------------------------------------

export const getLearningPathController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const learningPath =
        await getMyLearningPath(
          req.user!.userId,
          req.params.learningPathId as string
        );

      res.status(200).json({
        success: true,
        data: learningPath,
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

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_LEARNING_PATH_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You cannot access this learning path",
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
// UPDATE
// --------------------------------------------------

export const updateLearningPathController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const data =
        updateLearningPathSchema.parse(
          req.body
        );

      const learningPath =
        await updateMyLearningPath(
          req.user!.userId,
          req.params.learningPathId as string,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Learning path updated successfully",
        data: learningPath,
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

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_LEARNING_PATH_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You cannot modify this learning path",
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
        message:
          "Internal server error",
      });
    }
  };

// --------------------------------------------------
// DELETE
// --------------------------------------------------

export const deleteLearningPathController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      await removeLearningPath(
        req.user!.userId,
        req.params.learningPathId as string
      );

      res.status(200).json({
        success: true,
        message:
          "Learning path deleted successfully",
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

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_LEARNING_PATH_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You cannot delete this learning path",
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
// ADD STEP
// --------------------------------------------------

export const addLearningStepController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const data =
        addLearningStepSchema.parse(
          req.body
        );

      const step =
        await addResourceToLearningPath(
          req.user!.userId,
          req.params.learningPathId as string,
          data
        );

      res.status(201).json({
        success: true,
        message:
          "Resource added to learning path",
        data: step,
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
          "RESOURCE_ALREADY_IN_PATH"
      ) {
        res.status(409).json({
          success: false,
          message:
            "Resource is already in this learning path",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_LEARNING_PATH_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You cannot modify this learning path",
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
        message:
          "Internal server error",
      });
    }
  };

// --------------------------------------------------
// DELETE STEP
// --------------------------------------------------

export const deleteLearningStepController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      await removeLearningStep(
        req.user!.userId,
        req.params.learningPathId as string,
        Number(req.params.stepId)
      );

      res.status(200).json({
        success: true,
        message:
          "Learning step deleted successfully",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "LEARNING_STEP_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Learning step not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "LEARNING_STEP_NOT_IN_PATH"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Learning step does not belong to this path",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_LEARNING_PATH_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You cannot modify this learning path",
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
// REORDER STEP
// --------------------------------------------------

export const reorderLearningStepController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const data =
        reorderLearningStepSchema.parse(
          req.body
        );

      const step =
        await reorderLearningStep(
          req.user!.userId,
          req.params.learningPathId as string,
          Number(req.params.stepId),
          data.order
        );

      res.status(200).json({
        success: true,
        message:
          "Learning step reordered successfully",
        data: step,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "LEARNING_STEP_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Learning step not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "LEARNING_STEP_NOT_IN_PATH"
      ) {
        res.status(400).json({
          success: false,
          message:
            "Learning step does not belong to this path",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "UNAUTHORIZED_LEARNING_PATH_ACCESS"
      ) {
        res.status(403).json({
          success: false,
          message:
            "You cannot modify this learning path",
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
        message:
          "Internal server error",
      });
    }
  };