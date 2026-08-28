import {
  createPrerequisite,
  createTopic,
  createTopicMastery,
  deletePrerequisite,
  deleteTopic,
  findPrerequisite,
  findTopicById,
  findTopicByName,
  findTopicsBySkill,
  findAllTopics,
  findTopicMastery,
  findUserTopicMasteries,
  updateTopic,
  updateTopicMastery,
  findTopicResource,
  createTopicResource,
  findResourcesForTopic,
  deleteTopicResource,
} from "../repositories/topic.repository";

import {
  findSkillById,
} from "../repositories/skill.repository";

import {
  findResourceById,
} from "../repositories/resource.repository";

export const createNewTopic = async (data: {
  name: string;
  description?: string;
  skillId: string;
}) => {
  const skill = await findSkillById(data.skillId);

  if (!skill) {
    throw new Error("SKILL_NOT_FOUND");
  }

  const existingTopic = await findTopicByName(
    data.skillId,
    data.name.trim()
  );

  if (existingTopic) {
    throw new Error("TOPIC_ALREADY_EXISTS");
  }

  return createTopic({
    name: data.name.trim(),
    description: data.description?.trim(),
    skillId: data.skillId,
  });
};

export const getAllTopics = async () => {
  return findAllTopics();
};

export const getTopic = async (
  topicId: string
) => {
  const topic = await findTopicById(topicId);

  if (!topic) {
    throw new Error("TOPIC_NOT_FOUND");
  }

  return topic;
};

export const getTopicsForSkill = async (
  skillId: string
) => {
  const skill = await findSkillById(skillId);

  if (!skill) {
    throw new Error("SKILL_NOT_FOUND");
  }

  return findTopicsBySkill(skillId);
};

export const updateExistingTopic = async (
  topicId: string,
  data: {
    name?: string;
    description?: string | null;
  }
) => {
  const topic = await findTopicById(topicId);

  if (!topic) {
    throw new Error("TOPIC_NOT_FOUND");
  }

  return updateTopic(topicId, {
    name: data.name?.trim(),
    description: data.description?.trim(),
  });
};

export const removeTopic = async (
  topicId: string
) => {
  const topic = await findTopicById(topicId);

  if (!topic) {
    throw new Error("TOPIC_NOT_FOUND");
  }

  await deleteTopic(topicId);
};

export const addTopicPrerequisite = async (data: {
  topicId: string;
  prerequisiteId: string;
}) => {
  if (data.topicId === data.prerequisiteId) {
    throw new Error(
      "TOPIC_CANNOT_BE_ITS_OWN_PREREQUISITE"
    );
  }

  const topic = await findTopicById(data.topicId);

  if (!topic) {
    throw new Error("TOPIC_NOT_FOUND");
  }

  const prerequisite = await findTopicById(
    data.prerequisiteId
  );

  if (!prerequisite) {
    throw new Error(
      "PREREQUISITE_TOPIC_NOT_FOUND"
    );
  }

  const existingPrerequisite =
    await findPrerequisite(
      data.topicId,
      data.prerequisiteId
    );

  if (existingPrerequisite) {
    throw new Error(
      "PREREQUISITE_ALREADY_EXISTS"
    );
  }

  return createPrerequisite(data);
};

export const removeTopicPrerequisite = async (
  topicId: string,
  prerequisiteId: string
) => {
  const existingPrerequisite =
    await findPrerequisite(
      topicId,
      prerequisiteId
    );

  if (!existingPrerequisite) {
    throw new Error(
      "PREREQUISITE_NOT_FOUND"
    );
  }

  await deletePrerequisite(
    topicId,
    prerequisiteId
  );
};

export const getUserTopicMasteries = async (
  userId: string
) => {
  return findUserTopicMasteries(userId);
};

export const updateUserTopicMastery = async (
  data: {
    userId: string;
    topicId: string;
    score: number;
    status: string;
  }
) => {
  const topic = await findTopicById(data.topicId);

  if (!topic) {
    throw new Error("TOPIC_NOT_FOUND");
  }

  const existingMastery =
    await findTopicMastery(
      data.userId,
      data.topicId
    );

  if (existingMastery) {
    return updateTopicMastery(
      data.userId,
      data.topicId,
      {
        score: data.score,
        status: data.status,
      }
    );
  }

  return createTopicMastery({
    userId: data.userId,
    topicId: data.topicId,
    score: data.score,
    status: data.status,
  });
};

// ========================================
// TOPIC ↔ RESOURCE
// ========================================

export const addResourceToTopic = async (
  topicId: string,
  resourceId: string
) => {
  const topic = await findTopicById(topicId);

  if (!topic) {
    throw new Error("TOPIC_NOT_FOUND");
  }

  const resource = await findResourceById(
    resourceId
  );

  if (!resource) {
    throw new Error("RESOURCE_NOT_FOUND");
  }

  const existingRelation =
    await findTopicResource(
      topicId,
      resourceId
    );

  if (existingRelation) {
    throw new Error(
      "RESOURCE_ALREADY_ADDED_TO_TOPIC"
    );
  }

  return createTopicResource({
    topicId,
    resourceId,
  });
};

export const getResourcesForTopic = async (
  topicId: string
) => {
  const topic = await findTopicById(topicId);

  if (!topic) {
    throw new Error("TOPIC_NOT_FOUND");
  }

  return findResourcesForTopic(topicId);
};

export const removeResourceFromTopic = async (
  topicId: string,
  resourceId: string
) => {
  const topic = await findTopicById(topicId);

  if (!topic) {
    throw new Error("TOPIC_NOT_FOUND");
  }

  const relation = await findTopicResource(
    topicId,
    resourceId
  );

  if (!relation) {
    throw new Error(
      "RESOURCE_NOT_ASSOCIATED_WITH_TOPIC"
    );
  }

  await deleteTopicResource(
    topicId,
    resourceId
  );
};