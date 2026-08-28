import prisma from "../config/prisma";

export const findProgressById = async (
  id: string
) => {
  return prisma.progress.findUnique({
    where: {
      id,
    },
    include: {
      resource: true,
    },
  });
};

export const findProgressByUserAndResource =
  async (
    userId: string,
    resourceId: string
  ) => {
    return prisma.progress.findUnique({
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

export const findProgressByUserId = async (
  userId: string
) => {
  return prisma.progress.findMany({
    where: {
      userId,
    },
    include: {
      resource: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const findProgressByStatus = async (
  userId: string,
  status:
    | "NOT_STARTED"
    | "IN_PROGRESS"
    | "COMPLETED"
) => {
  return prisma.progress.findMany({
    where: {
      userId,
      status,
    },
    include: {
      resource: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const createProgress = async (data: {
  userId: string;
  resourceId: string;
  status?:
    | "NOT_STARTED"
    | "IN_PROGRESS"
    | "COMPLETED";
  progress?: number;
}) => {
  return prisma.progress.create({
    data: {
      userId: data.userId,
      resourceId: data.resourceId,
      status:
        data.status ?? "NOT_STARTED",
      progress:
        data.progress ?? 0,
    },
    include: {
      resource: true,
    },
  });
};

export const updateProgress = async (
  id: string,
  data: {
    status?:
      | "NOT_STARTED"
      | "IN_PROGRESS"
      | "COMPLETED";
    progress?: number;
  }
) => {
  return prisma.progress.update({
    where: {
      id,
    },
    data,
    include: {
      resource: true,
    },
  });
};

export const deleteProgress = async (
  id: string
) => {
  return prisma.progress.delete({
    where: {
      id,
    },
  });
};