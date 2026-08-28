import prisma from "../config/prisma";

export const createResource = async (data: {
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
  return prisma.resource.create({
    data: {
      title: data.title,
      description: data.description,
      url: data.url,
      type: data.type,
      difficulty: data.difficulty,
    },
  });
};

export const findResourceById = async (id: string) => {
  return prisma.resource.findUnique({
    where: {
      id,
    },
  });
};

export const findAllResources = async () => {
  return prisma.resource.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findResourcesByType = async (
  type:
    | "COURSE"
    | "PROJECT"
    | "ARTICLE"
    | "VIDEO"
    | "BOOK"
    | "ASSESSMENT"
) => {
  return prisma.resource.findMany({
    where: {
      type,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findResourcesByDifficulty = async (
  difficulty:
    | "BEGINNER"
    | "INTERMEDIATE"
    | "ADVANCED"
) => {
  return prisma.resource.findMany({
    where: {
      difficulty,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateResource = async (
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
  return prisma.resource.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteResource = async (id: string) => {
  return prisma.resource.delete({
    where: {
      id,
    },
  });
};

/*
 * Get all resources connected to a topic.
 */
export const findResourcesByTopicId = async (
  topicId: string
) => {
  const topicResources =
    await prisma.topicResource.findMany({
      where: {
        topicId,
      },
      include: {
        resource: true,
      },
      orderBy: {
        resource: {
          createdAt: "desc",
        },
      },
    });

  return topicResources.map(
    (item) => item.resource
  );
};

/*
 * Connect an existing resource to an existing topic.
 */
export const createTopicResource = async (data: {
  topicId: string;
  resourceId: string;
}) => {
  return prisma.topicResource.create({
    data: {
      topicId: data.topicId,
      resourceId: data.resourceId,
    },
    include: {
      topic: true,
      resource: true,
    },
  });
};

/*
 * Check whether a resource is already connected
 * to a topic.
 */
export const findTopicResource = async (
  topicId: string,
  resourceId: string
) => {
  return prisma.topicResource.findUnique({
    where: {
      topicId_resourceId: {
        topicId,
        resourceId,
      },
    },
  });
};

/*
 * Remove a resource from a topic.
 */
export const deleteTopicResource = async (
  topicId: string,
  resourceId: string
) => {
  return prisma.topicResource.delete({
    where: {
      topicId_resourceId: {
        topicId,
        resourceId,
      },
    },
  });
};