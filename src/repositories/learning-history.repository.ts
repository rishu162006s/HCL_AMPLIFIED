import prisma from "../config/prisma";

export const findLearningHistoryById = async (
  id: string
) => {
  return prisma.learningHistory.findUnique({
    where: {
      id,
    },
    include: {
      resource: true,
    },
  });
};

export const findLearningHistoryByUserAndResource =
  async (
    userId: string,
    resourceId: string
  ) => {
    return prisma.learningHistory.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
      include: {
        resource: true,
      },
    });
  };

export const findLearningHistoryByUserId =
  async (userId: string) => {
    return prisma.learningHistory.findMany({
      where: {
        userId,
      },
      include: {
        resource: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

export const createLearningHistory = async (data: {
  userId: string;
  resourceId: string;
  completedAt?: Date;
}) => {
  return prisma.learningHistory.create({
    data: {
      userId: data.userId,
      resourceId: data.resourceId,
      completedAt: data.completedAt,
    },
    include: {
      resource: true,
    },
  });
};

export const updateLearningHistory = async (
  id: string,
  data: {
    completedAt?: Date | null;
  }
) => {
  return prisma.learningHistory.update({
    where: {
      id,
    },
    data,
    include: {
      resource: true,
    },
  });
};

export const deleteLearningHistory = async (
  id: string
) => {
  return prisma.learningHistory.delete({
    where: {
      id,
    },
  });
};