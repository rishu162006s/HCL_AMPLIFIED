import { Response } from "express";

import {
  addPrerequisiteToTopic,
  getTopicPrerequisites,
  removeTopicPrerequisite,
} from "../services/topicPrerequisite.service";

import {
  addTopicPrerequisiteSchema,
} from "../validators/topicPrerequisite";

import {
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

// --------------------------------------------------
// ADD PREREQUISITE
// --------------------------------------------------

export const addTopicPrerequisiteController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const topicId =
        req.params.topicId;

      if (!topicId) {
        res.status(400).json({
          success: false,
          message: "Topic ID is required",
        });
        return;
      }

      const data =
        addTopicPrerequisiteSchema.parse(
          req.body
        );

      const result =
        await addPrerequisiteToTopic(
          topicId as string,
          data.prerequisiteId
        );

      res.status(201).json({
        success: true,
        message:
          "Prerequisite added successfully",
        data: result,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "TOPIC_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Topic not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "PREREQUISITE_TOPIC_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Prerequisite topic not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "TOPIC_CANNOT_BE_OWN_PREREQUISITE"
      ) {
        res.status(400).json({
          success: false,
          message:
            "A topic cannot be its own prerequisite",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "PREREQUISITE_ALREADY_EXISTS"
      ) {
        res.status(409).json({
          success: false,
          message:
            "Prerequisite already exists",
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
// GET PREREQUISITES
// --------------------------------------------------

export const getTopicPrerequisitesController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const topicId =
        req.params.topicId;

      if (!topicId) {
        res.status(400).json({
          success: false,
          message: "Topic ID is required",
        });
        return;
      }

      const prerequisites =
        await getTopicPrerequisites(
          topicId as string
        );

      res.status(200).json({
        success: true,
        data: prerequisites,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "TOPIC_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Topic not found",
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
// DELETE PREREQUISITE
// --------------------------------------------------

export const deleteTopicPrerequisiteController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const topicId =
        req.params.topicId;

      const prerequisiteId =
        req.params.prerequisiteId;

      if (!topicId || !prerequisiteId) {
        res.status(400).json({
          success: false,
          message:
            "Topic ID and prerequisite ID are required",
        });
        return;
      }

      await removeTopicPrerequisite(
        topicId as string,
        prerequisiteId as string
      );

      res.status(200).json({
        success: true,
        message:
          "Prerequisite removed successfully",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "TOPIC_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Topic not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "PREREQUISITE_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Prerequisite not found",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };