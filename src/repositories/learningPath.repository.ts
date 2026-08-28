import prisma from "../config/prisma";

// --------------------------------------------------
// FIND LEARNING PATH BY ID
// --------------------------------------------------

export const findLearningPathById = async (
  id: string
) => {
  return prisma.learningPath.findUnique({
    where: {
      id,
    },
    include: {
      goal: true,
      steps: {
        include: {
          resource: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });
};

// --------------------------------------------------
// FIND ALL LEARNING PATHS FOR USER
// --------------------------------------------------

export const findLearningPathsByUserId = async (
  userId: string
) => {
  return prisma.learningPath.findMany({
    where: {
      userId,
    },
    include: {
      goal: true,
      steps: {
        include: {
          resource: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// --------------------------------------------------
// CREATE LEARNING PATH
// --------------------------------------------------

export const createLearningPath = async (data: {
  title: string;
  description?: string;
  userId: string;
  goalId?: string;
}) => {
  return prisma.learningPath.create({
    data: {
      title: data.title,
      description: data.description,
      userId: data.userId,
      goalId: data.goalId,
    },
    include: {
      goal: true,
      steps: {
        include: {
          resource: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });
};

// --------------------------------------------------
// UPDATE LEARNING PATH
// --------------------------------------------------

export const updateLearningPath = async (
  id: string,
  data: {
    title?: string;
    description?: string | null;
  }
) => {
  return prisma.learningPath.update({
    where: {
      id,
    },
    data,
    include: {
      goal: true,
      steps: {
        include: {
          resource: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });
};

// --------------------------------------------------
// DELETE LEARNING PATH
// --------------------------------------------------

export const deleteLearningPath = async (
  id: string
) => {
  return prisma.learningPath.delete({
    where: {
      id,
    },
  });
};

// --------------------------------------------------
// FIND STEP BY ID
// --------------------------------------------------

export const findLearningStepById = async (
  id: number
) => {
  return prisma.learningStep.findUnique({
    where: {
      id,
    },
    include: {
      resource: true,
      learningPath: true,
    },
  });
};

// --------------------------------------------------
// FIND STEP BY PATH + RESOURCE
// --------------------------------------------------

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
    });
  };

// --------------------------------------------------
// CREATE LEARNING STEP
// --------------------------------------------------

export const createLearningStep = async (
  data: {
    learningPathId: string;
    resourceId: string;
    order: number;
    milestone?: string;
  }
) => {
  return prisma.learningStep.create({
    data: {
      learningPathId: data.learningPathId,
      resourceId: data.resourceId,
      order: data.order,
      milestone: data.milestone,
    },
    include: {
      resource: true,
    },
  });
};

// --------------------------------------------------
// DELETE LEARNING STEP
// --------------------------------------------------

export const deleteLearningStep = async (
  id: number
) => {
  return prisma.learningStep.delete({
    where: {
      id,
    },
  });
};

// --------------------------------------------------
// FIND MAX ORDER
// --------------------------------------------------

export const findMaxStepOrder = async (
  learningPathId: string
) => {
  const result = await prisma.learningStep.aggregate({
    where: {
      learningPathId,
    },
    _max: {
      order: true,
    },
  });

  return result._max.order;
};

// --------------------------------------------------
// UPDATE STEP ORDER
// --------------------------------------------------

export const updateLearningStepOrder = async (
  id: number,
  order: number
) => {
  return prisma.learningStep.update({
    where: {
      id,
    },
    data: {
      order,
    },
    include: {
      resource: true,
    },
  });
};