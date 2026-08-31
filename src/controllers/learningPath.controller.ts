
import { Response } from "express";

import {
  generateNewLearningPath,
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
  generateLearningPathSchema,
} from "../validators/learningPath.validators";

// ==================================================
// CREATE LEARNING PATH
// ==================================================

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
      if (error instanceof Error) {
        switch (error.message) {
          case "GOAL_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message: "Goal not found",
            });

          case "UNAUTHORIZED_GOAL_ACCESS":
            return res.status(403).json({
              success: false,
              message:
                "You cannot use another user's goal",
            });

          default:
            return res.status(400).json({
              success: false,
              message: error.message,
            });
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

// ==================================================
// GET MY LEARNING PATHS
// ==================================================

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
    } catch (error) {
      console.error(
        "Get learning paths error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

// ==================================================
// GET ONE LEARNING PATH
// ==================================================

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
      if (error instanceof Error) {
        switch (error.message) {
          case "LEARNING_PATH_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message:
                "Learning path not found",
            });

          case "UNAUTHORIZED_LEARNING_PATH_ACCESS":
            return res.status(403).json({
              success: false,
              message:
                "You cannot access this learning path",
            });

          default:
            return res.status(400).json({
              success: false,
              message: error.message,
            });
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

// ==================================================
// UPDATE LEARNING PATH
// ==================================================

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
      if (error instanceof Error) {
        switch (error.message) {
          case "LEARNING_PATH_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message:
                "Learning path not found",
            });

          case "UNAUTHORIZED_LEARNING_PATH_ACCESS":
            return res.status(403).json({
              success: false,
              message:
                "You cannot modify this learning path",
            });

          default:
            return res.status(400).json({
              success: false,
              message: error.message,
            });
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

// ==================================================
// DELETE LEARNING PATH
// ==================================================

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
      if (error instanceof Error) {
        switch (error.message) {
          case "LEARNING_PATH_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message:
                "Learning path not found",
            });

          case "UNAUTHORIZED_LEARNING_PATH_ACCESS":
            return res.status(403).json({
              success: false,
              message:
                "You cannot delete this learning path",
            });

          default:
            return res.status(400).json({
              success: false,
              message: error.message,
            });
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

// ==================================================
// ADD RESOURCE / LEARNING STEP
// ==================================================

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
      if (error instanceof Error) {
        switch (error.message) {
          case "LEARNING_PATH_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message:
                "Learning path not found",
            });

          case "RESOURCE_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message:
                "Resource not found",
            });

          case "RESOURCE_ALREADY_IN_PATH":
            return res.status(409).json({
              success: false,
              message:
                "Resource is already in this learning path",
            });

          case "UNAUTHORIZED_LEARNING_PATH_ACCESS":
            return res.status(403).json({
              success: false,
              message:
                "You cannot modify this learning path",
            });

          default:
            return res.status(400).json({
              success: false,
              message: error.message,
            });
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

// ==================================================
// DELETE LEARNING STEP
// ==================================================

export const deleteLearningStepController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const stepId =
        Number(req.params.stepId);

      if (!Number.isInteger(stepId)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid learning step ID",
        });
      }

      await removeLearningStep(
        req.user!.userId,
        req.params.learningPathId as string,
        stepId
      );

      res.status(200).json({
        success: true,
        message:
          "Learning step deleted successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "LEARNING_PATH_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message:
                "Learning path not found",
            });

          case "LEARNING_STEP_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message:
                "Learning step not found",
            });

          case "LEARNING_STEP_NOT_IN_PATH":
            return res.status(400).json({
              success: false,
              message:
                "Learning step does not belong to this path",
            });

          case "UNAUTHORIZED_LEARNING_PATH_ACCESS":
            return res.status(403).json({
              success: false,
              message:
                "You cannot modify this learning path",
            });

          default:
            return res.status(400).json({
              success: false,
              message: error.message,
            });
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

// ==================================================
// REORDER LEARNING STEP
// ==================================================

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

      const stepId =
        Number(req.params.stepId);

      if (!Number.isInteger(stepId)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid learning step ID",
        });
      }

      const step =
        await reorderLearningStep(
          req.user!.userId,
          req.params.learningPathId as string,
          stepId,
          data.order
        );

      res.status(200).json({
        success: true,
        message:
          "Learning step reordered successfully",
        data: step,
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "LEARNING_PATH_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message:
                "Learning path not found",
            });

          case "LEARNING_STEP_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message:
                "Learning step not found",
            });

          case "LEARNING_STEP_NOT_IN_PATH":
            return res.status(400).json({
              success: false,
              message:
                "Learning step does not belong to this path",
            });

          case "UNAUTHORIZED_LEARNING_PATH_ACCESS":
            return res.status(403).json({
              success: false,
              message:
                "You cannot modify this learning path",
            });

          default:
            return res.status(400).json({
              success: false,
              message: error.message,
            });
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

// ==================================================
// GENERATE AI LEARNING PATH
// ==================================================

export const generateLearningPathController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const data =
        generateLearningPathSchema.parse(
          req.body
        );

      const learningPath =
        await generateNewLearningPath(
          req.user!.userId,
          data.goalId
        );

      res.status(201).json({
        success: true,
        message:
          "Learning path generated successfully",
        data: learningPath,
      });
    } catch (error) {
      if (error instanceof Error) {
        switch (error.message) {
          case "GOAL_NOT_FOUND":
            return res.status(404).json({
              success: false,
              message:
                "Goal not found",
            });

          case "FORBIDDEN":
            return res.status(403).json({
              success: false,
              message:
                "You do not have access to this goal",
            });

          case "NO_GOAL_SKILLS":
            return res.status(400).json({
              success: false,
              message:
                "Goal has no required skills. Analyze the goal first.",
            });

          case "NO_USABLE_TOPICS":
            return res.status(400).json({
              success: false,
              message:
                "No topics with resources are available for this goal.",
            });

          case "AI_GENERATED_NO_TOPICS":
            return res.status(502).json({
              success: false,
              message:
                "AI did not select any topics.",
            });

          case "AI_GENERATED_NO_LEARNING_STEPS":
            return res.status(502).json({
              success: false,
              message:
                "AI generated a path without usable learning steps.",
            });

          case "AI_INVALID_JSON":
            return res.status(502).json({
              success: false,
              message:
                "AI returned an invalid response.",
            });

          case "AI_INVALID_LEARNING_PATH":
            return res.status(502).json({
              success: false,
              message:
                "AI generated an invalid learning path.",
            });

          case "AI_INVALID_PREREQUISITE_ORDER":
            return res.status(502).json({
              success: false,
              message:
                "AI generated an invalid prerequisite order.",
            });

          case "TOPIC_PREREQUISITE_CYCLE":
            return res.status(400).json({
              success: false,
              message:
                "A circular topic prerequisite was detected.",
            });

          case "TOPIC_PREREQUISITE_NOT_FOUND":
            return res.status(400).json({
              success: false,
              message:
                "A topic prerequisite could not be found.",
            });

          case "PREREQUISITE_HAS_NO_RESOURCE":
            return res.status(400).json({
              success: false,
              message:
                "A required prerequisite topic has no resource.",
            });

          default:
            console.error(
              "Generate learning path error:",
              error
            );

            return res.status(400).json({
              success: false,
              message:
                error.message,
            });
        }
      }

      return res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  };

