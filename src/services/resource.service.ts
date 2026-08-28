import {
  createResource,
  createTopicResource,
  deleteResource,
  deleteTopicResource,
  findAllResources,
  findResourceById,
  findResourcesByDifficulty,
  findResourcesByTopicId,
  findResourcesByType,
  findTopicResource,
  updateResource,
} from "../repositories/resource.repository";

export const createNewResource = async (data: {
  title: string;
  description?: string;
  url: string;
  type:
    | "COURSE"
    | "PROJECT"
    | "ARTICLE"
    | "VIDEO"
    | "BOOK"
    | "ASSESSMENT";
  difficulty?:
    | "BEGINNER"
    | "INTERMEDIATE"
    | "ADVANCED";
}) => {
  return createResource({
    title: data.title.trim(),
    description: data.description?.trim(),
    url: data.url,
    type: data.type,
    difficulty: data.difficulty,
  });
};

export const getResources = async () => {
  return findAllResources();
};

export const getResource = async (id: string) => {
  const resource = await findResourceById(id);

  if (!resource) {
    throw new Error("RESOURCE_NOT_FOUND");
  }

  return resource;
};

export const getResourcesByType = async (
  type:
    | "COURSE"
    | "PROJECT"
    | "ARTICLE"
    | "VIDEO"
    | "BOOK"
    | "ASSESSMENT"
) => {
  return findResourcesByType(type);
};

export const getResourcesByDifficulty = async (
  difficulty:
    | "BEGINNER"
    | "INTERMEDIATE"
    | "ADVANCED"
) => {
  return findResourcesByDifficulty(difficulty);
};

export const updateExistingResource = async (
  id: string,
  data: {
    title?: string;
    description?: string | null;
    url?: string;
    type?:
      | "COURSE"
      | "PROJECT"
      | "ARTICLE"
      | "VIDEO"
      | "BOOK"
      | "ASSESSMENT";
    difficulty?:
      | "BEGINNER"
      | "INTERMEDIATE"
      | "ADVANCED"
      | null;
  }
) => {
  const resource = await findResourceById(id);

  if (!resource) {
    throw new Error("RESOURCE_NOT_FOUND");
  }

  return updateResource(id, {
    ...data,
    title: data.title?.trim(),
    description: data.description?.trim(),
  });
};

export const removeResource = async (id: string) => {
  const resource = await findResourceById(id);

  if (!resource) {
    throw new Error("RESOURCE_NOT_FOUND");
  }

  await deleteResource(id);
};

/*
 * Get all resources belonging to a topic.
 */
export const getResourcesForTopic = async (
  topicId: string
) => {
  return findResourcesByTopicId(topicId);
};

/*
 * Connect a resource to a topic.
 */
export const addResourceToTopic = async (data: {
  topicId: string;
  resourceId: string;
}) => {
  const resource = await findResourceById(
    data.resourceId
  );

  if (!resource) {
    throw new Error("RESOURCE_NOT_FOUND");
  }

  const existingTopicResource =
    await findTopicResource(
      data.topicId,
      data.resourceId
    );

  if (existingTopicResource) {
    throw new Error(
      "RESOURCE_ALREADY_CONNECTED_TO_TOPIC"
    );
  }

  return createTopicResource(data);
};

/*
 * Remove a resource from a topic.
 */
export const removeResourceFromTopic = async (
  topicId: string,
  resourceId: string
) => {
  const existingTopicResource =
    await findTopicResource(
      topicId,
      resourceId
    );

  if (!existingTopicResource) {
    throw new Error(
      "RESOURCE_NOT_CONNECTED_TO_TOPIC"
    );
  }

  await deleteTopicResource(
    topicId,
    resourceId
  );
};