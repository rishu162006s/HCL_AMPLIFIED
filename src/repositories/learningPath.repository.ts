import prisma from "../config/prisma";

// ==================================================
// LEARNING PATH INCLUDE
// ==================================================

const learningPathInclude = {
  goal: true,

  steps: {
    orderBy: {
      order: "asc" as const,
    },

    include: {
      resource: true,
    },
  },
};

// ==================================================
// CREATE LEARNING PATH
// ==================================================

export const createLearningPath = async (data: {
  userId: string;
  title: string;
  description?: string | null;
  goalId?: string | null;
}) => {
  return prisma.learningPath.create({
    data: {
      userId: data.userId,

      title: data.title,

      description:
        data.description ?? null,

      goalId:
        data.goalId ?? null,
    },

    include:
      learningPathInclude,
  });
};

// ==================================================
// FIND LEARNING PATH BY ID
// ==================================================

export const findLearningPathById = async (
  learningPathId: string
) => {
  return prisma.learningPath.findUnique({
    where: {
      id: learningPathId,
    },

    include:
      learningPathInclude,
  });
};

// ==================================================
// FIND ALL LEARNING PATHS FOR USER
// ==================================================

export const findLearningPathsByUserId = async (
  userId: string
) => {
  return prisma.learningPath.findMany({
    where: {
      userId,
    },

    include:
      learningPathInclude,

    orderBy: {
      createdAt: "desc",
    },
  });
};

// ==================================================
// FIND LEARNING PATH BY GOAL
// ==================================================

export const findLearningPathByGoalId = async (
  goalId: string,
  userId: string
) => {
  return prisma.learningPath.findFirst({
    where: {
      goalId,

      userId,
    },

    include:
      learningPathInclude,

    orderBy: {
      createdAt: "desc",
    },
  });
};

// ==================================================
// UPDATE LEARNING PATH
// ==================================================

export const updateLearningPath = async (
  learningPathId: string,
  data: {
    title?: string;
    description?: string | null;
  }
) => {
  return prisma.learningPath.update({
    where: {
      id: learningPathId,
    },

    data: {
      ...(data.title !== undefined && {
        title: data.title,
      }),

      ...(data.description !== undefined && {
        description:
          data.description,
      }),
    },

    include:
      learningPathInclude,
  });
};

// ==================================================
// DELETE LEARNING PATH
// ==================================================

export const deleteLearningPath = async (
  learningPathId: string
) => {
  return prisma.learningPath.delete({
    where: {
      id: learningPathId,
    },
  });
};

// ==================================================
// CREATE LEARNING STEP
// ==================================================

export const createLearningStep = async (data: {
  learningPathId: string;
  resourceId: string;
  order: number;
  milestone?: string | null;
}) => {
  return prisma.learningStep.create({
    data: {
      learningPathId:
        data.learningPathId,

      resourceId:
        data.resourceId,

      order:
        data.order,

      milestone:
        data.milestone ?? null,
    },

    include: {
      resource: true,
    },
  });
};

// ==================================================
// FIND LEARNING STEP BY ID
// ==================================================

export const findLearningStepById = async (
  stepId: number
) => {
  return prisma.learningStep.findUnique({
    where: {
      id: stepId,
    },

    include: {
      resource: true,

      learningPath: true,
    },
  });
};

// ==================================================
// FIND STEP BY PATH + RESOURCE
// ==================================================

export const findLearningStepByPathAndResource =
  async (
    learningPathId: string,
    resourceId: string
  ) => {
    return prisma.learningStep.findFirst({
      where: {
        learningPathId,

        resourceId,
      },

      include: {
        resource: true,
      },
    });
  };

// ==================================================
// FIND MAX STEP ORDER
// ==================================================

export const findMaxStepOrder = async (
  learningPathId: string
) => {
  const result =
    await prisma.learningStep.aggregate({
      where: {
        learningPathId,
      },

      _max: {
        order: true,
      },
    });

  return result._max.order;
};

// ==================================================
// UPDATE STEP ORDER
// ==================================================

export const updateLearningStepOrder = async (
  stepId: number,
  order: number
) => {
  return prisma.learningStep.update({
    where: {
      id: stepId,
    },

    data: {
      order,
    },

    include: {
      resource: true,
    },
  });
};

// ==================================================
// DELETE LEARNING STEP
// ==================================================

export const deleteLearningStep = async (
  stepId: number
) => {
  return prisma.learningStep.delete({
    where: {
      id: stepId,
    },
  });
};