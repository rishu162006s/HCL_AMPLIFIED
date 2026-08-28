import {
  createTopicPrerequisite,
  deleteTopicPrerequisite,
  findTopicById,
  findTopicPrerequisite,
  findTopicPrerequisites,
} from "../repositories/topicPrerequisite";

// --------------------------------------------------
// ADD PREREQUISITE
// --------------------------------------------------

export const addPrerequisiteToTopic =
  async (
    topicId: string,
    prerequisiteId: string
  ) => {
    // Check target topic
    const topic =
      await findTopicById(topicId);

    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    // Check prerequisite topic
    const prerequisite =
      await findTopicById(
        prerequisiteId
      );

    if (!prerequisite) {
      throw new Error(
        "PREREQUISITE_TOPIC_NOT_FOUND"
      );
    }

    // Prevent self-reference
    if (topicId === prerequisiteId) {
      throw new Error(
        "TOPIC_CANNOT_BE_OWN_PREREQUISITE"
      );
    }

    // Prevent duplicate
    const existing =
      await findTopicPrerequisite(
        topicId,
        prerequisiteId
      );

    if (existing) {
      throw new Error(
        "PREREQUISITE_ALREADY_EXISTS"
      );
    }

    return createTopicPrerequisite({
      topicId,
      prerequisiteId,
    });
  };

// --------------------------------------------------
// GET PREREQUISITES
// --------------------------------------------------

export const getTopicPrerequisites =
  async (topicId: string) => {
    const topic =
      await findTopicById(topicId);

    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    return findTopicPrerequisites(
      topicId
    );
  };

// --------------------------------------------------
// REMOVE PREREQUISITE
// --------------------------------------------------

export const removeTopicPrerequisite =
  async (
    topicId: string,
    prerequisiteId: string
  ) => {
    const topic =
      await findTopicById(topicId);

    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    const existing =
      await findTopicPrerequisite(
        topicId,
        prerequisiteId
      );

    if (!existing) {
      throw new Error(
        "PREREQUISITE_NOT_FOUND"
      );
    }

    await deleteTopicPrerequisite(
      topicId,
      prerequisiteId
    );
  };