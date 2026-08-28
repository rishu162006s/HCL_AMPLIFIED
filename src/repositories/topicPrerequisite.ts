import prisma from "../config/prisma";

// --------------------------------------------------
// FIND TOPIC BY ID
// --------------------------------------------------

export const findTopicById = async (
  topicId: string
) => {
  return prisma.topic.findUnique({
    where: {
      id: topicId,
    },
    include: {
      skill: true,
    },
  });
};

// --------------------------------------------------
// FIND PREREQUISITE
// --------------------------------------------------

export const findTopicPrerequisite = async (
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
    include: {
      prerequisite: {
        include: {
          skill: true,
        },
      },
      topic: {
        include: {
          skill: true,
        },
      },
    },
  });
};

// --------------------------------------------------
// GET ALL PREREQUISITES
// --------------------------------------------------

export const findTopicPrerequisites = async (
  topicId: string
) => {
  return prisma.topicPrerequisite.findMany({
    where: {
      topicId,
    },
    include: {
      prerequisite: {
        include: {
          skill: true,
        },
      },
    },
  });
};

// --------------------------------------------------
// CREATE PREREQUISITE
// --------------------------------------------------

export const createTopicPrerequisite =
  async (data: {
    topicId: string;
    prerequisiteId: string;
  }) => {
    return prisma.topicPrerequisite.create({
      data: {
        topicId: data.topicId,
        prerequisiteId:
          data.prerequisiteId,
      },
      include: {
        prerequisite: {
          include: {
            skill: true,
          },
        },
        topic: {
          include: {
            skill: true,
          },
        },
      },
    });
  };

// --------------------------------------------------
// DELETE PREREQUISITE
// --------------------------------------------------

export const deleteTopicPrerequisite =
  async (
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