
import { Request, Response } from "express";

import {
  addResourceToTopic,
  addTopicPrerequisite,
  createNewTopic,
  getAllTopics,
  getResourcesForTopic,
  getTopic,
  getTopicsForSkill,
  getUserTopicMasteries,
  removeResourceFromTopic,
  removeTopic,
  removeTopicPrerequisite,
  updateExistingTopic,
  updateUserTopicMastery,
} from "../services/topic.service";

import {
  createTopicSchema,
  updateTopicSchema,
  topicPrerequisiteSchema,
  updateTopicMasterySchema,
  topicResourceSchema,
} from "../validators/topic.validators";

import { AuthenticatedRequest } from "../middleware/auth.middleware";

// --------------------------------------------------
// CREATE TOPIC
// --------------------------------------------------

export const createTopicController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = createTopicSchema.parse(
      req.body
    );

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
        message:
          "A topic with this name already exists for this skill",
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
// GET ALL TOPICS
// --------------------------------------------------

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
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// --------------------------------------------------
// GET TOPIC BY ID
// --------------------------------------------------

export const getTopicController = async (
  req: Request,
  res: Response
) => {
  try {
    const topic = await getTopic(
      req.params.topicId as string
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

// --------------------------------------------------
// GET TOPICS BY SKILL
// --------------------------------------------------

export const getTopicsForSkillController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const topics =
        await getTopicsForSkill(
          req.params.skillId as string
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

// --------------------------------------------------
// UPDATE TOPIC
// --------------------------------------------------

export const updateTopicController = async (
  req: Request,
  res: Response
) => {
  try {
    const data =
      updateTopicSchema.parse(req.body);

    const topic =
      await updateExistingTopic(
        req.params.topicId as string,
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

// --------------------------------------------------
// DELETE TOPIC
// --------------------------------------------------

export const deleteTopicController = async (
  req: Request,
  res: Response
) => {
  try {
    await removeTopic(
      req.params.topicId as string
    );

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

// --------------------------------------------------
// ADD TOPIC PREREQUISITE
// --------------------------------------------------

export const addTopicPrerequisiteController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const data =
        topicPrerequisiteSchema.parse(
          req.body
        );

      const prerequisite =
        await addTopicPrerequisite({
          topicId:
            req.params.topicId as string,
          prerequisiteId:
            data.prerequisiteId,
        });

      res.status(201).json({
        success: true,
        message:
          "Topic prerequisite added successfully",
        data: prerequisite,
      });
    } catch (error) {
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
          message:
            "Prerequisite topic not found",
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
// DELETE TOPIC PREREQUISITE
// --------------------------------------------------

export const deleteTopicPrerequisiteController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      await removeTopicPrerequisite(
        req.params.topicId as string,
        req.params.prerequisiteId as string
      );

      res.status(200).json({
        success: true,
        message:
          "Topic prerequisite deleted successfully",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "PREREQUISITE_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Prerequisite relationship not found",
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
// GET MY TOPIC MASTERIES
// --------------------------------------------------

export const getUserTopicMasteriesController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const masteries =
        await getUserTopicMasteries(
          req.user!.userId
        );

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

// --------------------------------------------------
// UPDATE TOPIC MASTERY
// --------------------------------------------------

export const updateUserTopicMasteryController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const data =
        updateTopicMasterySchema.parse(
          req.body
        );

      const mastery =
        await updateUserTopicMastery({
          userId: req.user!.userId,
          topicId:
            req.params.topicId as string,
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

// --------------------------------------------------
// ADD RESOURCE TO TOPIC
// --------------------------------------------------

export const addResourceToTopicController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const data =
        topicResourceSchema.parse(
          req.body
        );

      const relation =
        await addResourceToTopic(
          req.params.topicId as string,
          data.resourceId
        );

      res.status(201).json({
        success: true,
        message:
          "Resource added to topic successfully",
        data: relation,
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
          "RESOURCE_ALREADY_ADDED_TO_TOPIC"
      ) {
        res.status(409).json({
          success: false,
          message:
            "Resource is already associated with this topic",
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
// GET RESOURCES FOR TOPIC
// --------------------------------------------------

export const getResourcesForTopicController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const resources =
        await getResourcesForTopic(
          req.params.topicId as string
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

// --------------------------------------------------
// DELETE RESOURCE FROM TOPIC
// --------------------------------------------------

export const removeResourceFromTopicController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      await removeResourceFromTopic(
        req.params.topicId as string,
        req.params.resourceId as string
      );

      res.status(200).json({
        success: true,
        message:
          "Resource removed from topic successfully",
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
          "RESOURCE_NOT_ASSOCIATED_WITH_TOPIC"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Resource is not associated with this topic",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

