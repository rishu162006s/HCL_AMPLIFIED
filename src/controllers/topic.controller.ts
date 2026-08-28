import { Request, Response } from "express";

import {
  addTopicPrerequisite,
  createNewTopic,
  getAllTopics,
  getTopic,
  getTopicsForSkill,
  getUserTopicMasteries,
  removeTopic,
  removeTopicPrerequisite,
  updateExistingTopic,
  updateUserTopicMastery,
  addResourceToTopic,
  getResourcesForTopic,
  removeResourceFromTopic,
} from "../services/topic.service";

import {
  createTopicSchema,
  prerequisiteSchema,
  topicMasterySchema,
  updateTopicSchema,
} from "../validators/topic.validators";

import { AuthenticatedRequest } from "../middleware/auth.middleware";

// ========================================
// GET ALL TOPICS
// ========================================

export const getAllTopicsController = async (
  req: Request,
  res: Response
) => {
  try {
    const topics = await getAllTopics();

    res.status(200).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// CREATE TOPIC
// ========================================

export const createTopicController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = createTopicSchema.parse(req.body);

    const topic = await createNewTopic(data);

    res.status(201).json({
      success: true,
      message: "Topic created successfully",
      data: topic,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "SKILL_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Skill not found",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "TOPIC_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        success: false,
        message: "Topic already exists for this skill",
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

// ========================================
// GET SINGLE TOPIC
// ========================================

export const getTopicController = async (
  req: Request,
  res: Response
) => {
  try {
    const topicId = req.params.topicId;

    if (!topicId) {
      res.status(400).json({
        success: false,
        message: "Topic ID is required",
      });
      return;
    }

    const topic = await getTopic(
      topicId as string
    );

    res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "TOPIC_NOT_FOUND"
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

// ========================================
// GET TOPICS BY SKILL
// ========================================

export const getTopicsBySkillController =
  async (req: Request, res: Response) => {
    try {
      const skillId = req.params.skillId;

      if (!skillId) {
        res.status(400).json({
          success: false,
          message: "Skill ID is required",
        });
        return;
      }

      const topics = await getTopicsForSkill(
        skillId as string
      );

      res.status(200).json({
        success: true,
        data: topics,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "SKILL_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Skill not found",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

// ========================================
// UPDATE TOPIC
// ========================================

export const updateTopicController = async (
  req: Request,
  res: Response
) => {
  try {
    const topicId = req.params.topicId;

    if (!topicId) {
      res.status(400).json({
        success: false,
        message: "Topic ID is required",
      });
      return;
    }

    const data = updateTopicSchema.parse(
      req.body
    );

    const topic = await updateExistingTopic(
      topicId as string,
      data
    );

    res.status(200).json({
      success: true,
      message: "Topic updated successfully",
      data: topic,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "TOPIC_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Topic not found",
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

// ========================================
// DELETE TOPIC
// ========================================

export const deleteTopicController = async (
  req: Request,
  res: Response
) => {
  try {
    const topicId = req.params.topicId;

    if (!topicId) {
      res.status(400).json({
        success: false,
        message: "Topic ID is required",
      });
      return;
    }

    await removeTopic(topicId as string);

    res.status(200).json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "TOPIC_NOT_FOUND"
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

// ========================================
// ADD PREREQUISITE
// ========================================

export const addPrerequisiteController =
  async (req: Request, res: Response) => {
    try {
      const topicId = req.params.topicId;

      if (!topicId) {
        res.status(400).json({
          success: false,
          message: "Topic ID is required",
        });
        return;
      }

      const data = prerequisiteSchema.parse(
        req.body
      );

      const prerequisite =
        await addTopicPrerequisite({
          topicId: topicId as string,
          prerequisiteId: data.prerequisiteId,
        });

      res.status(201).json({
        success: true,
        message: "Prerequisite added successfully",
        data: prerequisite,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "TOPIC_NOT_FOUND"
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
          message: "Prerequisite topic not found",
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
          message: "Prerequisite already exists",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message ===
          "TOPIC_CANNOT_BE_ITS_OWN_PREREQUISITE"
      ) {
        res.status(400).json({
          success: false,
          message:
            "A topic cannot be its own prerequisite",
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

// ========================================
// DELETE PREREQUISITE
// ========================================

export const deletePrerequisiteController =
  async (req: Request, res: Response) => {
    try {
      const topicId = req.params.topicId;
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
        error.message === "PREREQUISITE_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Prerequisite not found",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

// ========================================
// GET USER MASTERIES
// ========================================

export const getUserMasteriesController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const masteries =
        await getUserTopicMasteries(userId);

      res.status(200).json({
        success: true,
        data: masteries,
      });
    } catch {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

// ========================================
// UPDATE USER MASTERY
// ========================================

export const updateUserMasteryController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const data = topicMasterySchema.parse(
        req.body
      );

      const mastery =
        await updateUserTopicMastery({
          userId,
          topicId: data.topicId,
          score: data.score,
          status: data.status,
        });

      res.status(200).json({
        success: true,
        message:
          "Topic mastery updated successfully",
        data: mastery,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "TOPIC_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Topic not found",
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

// ========================================
// ADD RESOURCE TO TOPIC
// ========================================

export const addResourceToTopicController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const topicId = req.params.topicId;
      const resourceId = req.body.resourceId;

      if (!topicId) {
        res.status(400).json({
          success: false,
          message: "Topic ID is required",
        });
        return;
      }

      if (!resourceId) {
        res.status(400).json({
          success: false,
          message: "Resource ID is required",
        });
        return;
      }

      const relation =
        await addResourceToTopic(
          topicId as string,
          resourceId
        );

      res.status(201).json({
        success: true,
        message:
          "Resource added to topic successfully",
        data: relation,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === "TOPIC_NOT_FOUND"
        ) {
          res.status(404).json({
            success: false,
            message: "Topic not found",
          });
          return;
        }

        if (
          error.message === "RESOURCE_NOT_FOUND"
        ) {
          res.status(404).json({
            success: false,
            message: "Resource not found",
          });
          return;
        }

        if (
          error.message ===
          "RESOURCE_ALREADY_ADDED_TO_TOPIC"
        ) {
          res.status(409).json({
            success: false,
            message:
              "Resource is already associated with this topic",
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

// ========================================
// GET RESOURCES FOR TOPIC
// ========================================

export const getResourcesForTopicController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const topicId = req.params.topicId;

      if (!topicId) {
        res.status(400).json({
          success: false,
          message: "Topic ID is required",
        });
        return;
      }

      const resources =
        await getResourcesForTopic(
          topicId as string
        );

      res.status(200).json({
        success: true,
        data: resources,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "TOPIC_NOT_FOUND"
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

// ========================================
// REMOVE RESOURCE FROM TOPIC
// ========================================

export const removeResourceFromTopicController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const topicId = req.params.topicId;
      const resourceId =
        req.params.resourceId;

      if (!topicId || !resourceId) {
        res.status(400).json({
          success: false,
          message:
            "Topic ID and Resource ID are required",
        });
        return;
      }

      await removeResourceFromTopic(
        topicId as string,
        resourceId as string
      );

      res.status(200).json({
        success: true,
        message:
          "Resource removed from topic successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === "TOPIC_NOT_FOUND"
        ) {
          res.status(404).json({
            success: false,
            message: "Topic not found",
          });
          return;
        }

        if (
          error.message ===
          "RESOURCE_NOT_ASSOCIATED_WITH_TOPIC"
        ) {
          res.status(404).json({
            success: false,
            message:
              "Resource is not associated with this topic",
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };