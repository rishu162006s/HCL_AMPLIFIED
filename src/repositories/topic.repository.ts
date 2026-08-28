import prisma from "../config/prisma";

export const findTopicById = async (id: string) => {
  return prisma.topic.findUnique({
    where: {
      id,
    },
    include: {
      skill: true,
      prerequisites: {
        include: {
          prerequisite: true,
        },
      },
      dependents: {
        include: {
          topic: true,
        },
      },
      resources: {
        include: {
          resource: true,
        },
      },
    },
  });
};

export const findTopicByName = async (
  skillId: string,
  name: string
) => {
  return prisma.topic.findUnique({
    where: {
      skillId_name: {
        skillId,
        name,
      },
    },
  });
};

export const findAllTopics = async () => {
  return prisma.topic.findMany({
    include: {
      skill: true,
      prerequisites: {
        include: {
          prerequisite: true,
        },
      },
      resources: {
        include: {
          resource: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const findTopicsBySkill = async (
  skillId: string
) => {
  return prisma.topic.findMany({
    where: {
      skillId,
    },
    include: {
      skill: true,
      prerequisites: {
        include: {
          prerequisite: true,
        },
      },
      resources: {
        include: {
          resource: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const createTopic = async (data: {
  name: string;
  description?: string;
  skillId: string;
}) => {
  return prisma.topic.create({
    data: {
      name: data.name,
      description: data.description,
      skillId: data.skillId,
    },
    include: {
      skill: true,
    },
  });
};

export const updateTopic = async (
  id: string,
  data: {
    name?: string;
    description?: string | null;
  }
) => {
  return prisma.topic.update({
    where: {
      id,
    },
    data,
    include: {
      skill: true,
    },
  });
};

export const deleteTopic = async (id: string) => {
  return prisma.topic.delete({
    where: {
      id,
    },
  });
};

export const findPrerequisite = async (
  topicId: string,
  prerequisiteId: string
) => {
  return prisma.topicPrerequisite.findUnique({
    where: {
      topicId_prerequisiteId: {
        topicId,
        prerequisiteId,
      },
    },
  });
};

export const createPrerequisite = async (data: {
  topicId: string;
  prerequisiteId: string;
}) => {
  return prisma.topicPrerequisite.create({
    data,
    include: {
      topic: true,
      prerequisite: true,
    },
  });
};

export const deletePrerequisite = async (
  topicId: string,
  prerequisiteId: string
) => {
  return prisma.topicPrerequisite.delete({
    where: {
      topicId_prerequisiteId: {
        topicId,
        prerequisiteId,
      },
    },
  });
};

export const findTopicMastery = async (
  userId: string,
  topicId: string
) => {
  return prisma.topicMastery.findUnique({
    where: {
      userId_topicId: {
        userId,
        topicId,
      },
    },
    include: {
      topic: {
        include: {
          skill: true,
        },
      },
    },
  });
};

export const findUserTopicMasteries = async (
  userId: string
) => {
  return prisma.topicMastery.findMany({
    where: {
      userId,
    },
    include: {
      topic: {
        include: {
          skill: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const createTopicMastery = async (data: {
  userId: string;
  topicId: string;
  score: number;
  status: string;
}) => {
  return prisma.topicMastery.create({
    data,
    include: {
      topic: {
        include: {
          skill: true,
        },
      },
    },
  });
};

export const updateTopicMastery = async (
  userId: string,
  topicId: string,
  data: {
    score: number;
    status: string;
  }
) => {
  return prisma.topicMastery.update({
    where: {
      userId_topicId: {
        userId,
        topicId,
      },
    },
    data,
    include: {
      topic: {
        include: {
          skill: true,
        },
      },
    },
  });
};

export const deleteTopicMastery = async (
  userId: string,
  topicId: string
) => {
  return prisma.topicMastery.delete({
    where: {
      userId_topicId: {
        userId,
        topicId,
      },
    },
  });
};

// ===============================
// TOPIC ↔ RESOURCE
// ===============================

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

export const createTopicResource = async (data: {
  topicId: string;
  resourceId: string;
}) => {
  return prisma.topicResource.create({
    data,
    include: {
      topic: true,
      resource: true,
    },
  });
};

export const findResourcesForTopic = async (
  topicId: string
) => {
  return prisma.topicResource.findMany({
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
};

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