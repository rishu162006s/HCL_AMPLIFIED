import prisma from "../config/prisma";

const goalLearningInclude = (userId?: string) => ({
  requiredSkills: {
    include: {
      skill: true,
    },
  },
  learningPaths: {
    orderBy: {
      createdAt: "desc" as const,
    },
    include: {
      steps: {
        orderBy: {
          order: "asc" as const,
        },
        include: {
          resource: {
            include: {
              progress: userId
                ? {
                    where: {
                      userId,
                    },
                  }
                : false,
            },
          },
        },
      },
    },
  },
});

export const findGoalById = async (
  id: string,
  userId?: string
) => {
  return prisma.goal.findUnique({
    where: {
      id,
    },
    include: goalLearningInclude(userId),
  });
};

export const findUserGoals = async (
  userId: string
) => {
  return prisma.goal.findMany({
    where: {
      userId,
    },
    include: goalLearningInclude(userId),
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createGoal = async (data: {
  title: string;
  description?: string;
  objective:
    | "PERSONAL"
    | "CAREER"
    | "ACADEMIC"
    | "INTERVIEW"
    | "PROJECT";
  targetDate?: Date;
  weeklyHours?: number;
  preferredResourceTypes?:
    | (
        | "COURSE"
        | "PROJECT"
        | "ARTICLE"
        | "VIDEO"
        | "BOOK"
        | "ASSESSMENT"
      )
    | (
        | "COURSE"
        | "PROJECT"
        | "ARTICLE"
        | "VIDEO"
        | "BOOK"
        | "ASSESSMENT"
      )[];
  theoryPracticeRatio?:
    | "MORE_THEORY"
    | "BALANCED"
    | "MORE_PRACTICE";
  userId: string;
}) => {
  return prisma.goal.create({
    data: {
      title: data.title,
      description: data.description,
      objective: data.objective,
      targetDate: data.targetDate,
      weeklyHours: data.weeklyHours,

      ...(data.preferredResourceTypes !== undefined
        ? {
            preferredResourceTypes: Array.isArray(
              data.preferredResourceTypes
            )
              ? data.preferredResourceTypes
              : [data.preferredResourceTypes],
          }
        : {}),

      theoryPracticeRatio:
        data.theoryPracticeRatio,

      userId: data.userId,
    },
  });
};

export const updateGoal = async (
  id: string,
  data: {
    title?: string;
    description?: string | null;
    status?:
      | "ACTIVE"
      | "COMPLETED"
      | "PAUSED";
    objective?:
      | "PERSONAL"
      | "CAREER"
      | "ACADEMIC"
      | "INTERVIEW"
      | "PROJECT";
    targetDate?: Date | null;
    weeklyHours?: number | null;
    preferredResourceTypes?:
      | (
          | "COURSE"
          | "PROJECT"
          | "ARTICLE"
          | "VIDEO"
          | "BOOK"
          | "ASSESSMENT"
        )
      | (
          | "COURSE"
          | "PROJECT"
          | "ARTICLE"
          | "VIDEO"
          | "BOOK"
          | "ASSESSMENT"
        )[];
    theoryPracticeRatio?:
      | "MORE_THEORY"
      | "BALANCED"
      | "MORE_PRACTICE"
      | null;
  }
) => {
  return prisma.goal.update({
    where: {
      id,
    },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      objective: data.objective,
      targetDate: data.targetDate,
      weeklyHours: data.weeklyHours,

      ...(data.preferredResourceTypes !== undefined
        ? {
            preferredResourceTypes: Array.isArray(
              data.preferredResourceTypes
            )
              ? data.preferredResourceTypes
              : [data.preferredResourceTypes],
          }
        : {}),

      theoryPracticeRatio:
        data.theoryPracticeRatio,
    },

    include: {
      requiredSkills: {
        include: {
          skill: true,
        },
      },
    },
  });
};

export const deleteGoal = async (id: string) => {
  return prisma.goal.delete({
    where: {
      id,
    },
  });
};

export const findGoalSkill = async (
  goalId: string,
  skillId: string
) => {
  return prisma.goalSkill.findUnique({
    where: {
      goalId_skillId: {
        goalId,
        skillId,
      },
    },
    include: {
      skill: true,
    },
  });
};

export const createGoalSkill = async (data: {
  goalId: string;
  skillId: string;
  currentLevel:
    | "NONE"
    | "BASIC"
    | "INTERMEDIATE"
    | "EXPERT";
  targetLevel:
    | "NONE"
    | "BASIC"
    | "INTERMEDIATE"
    | "EXPERT";
}) => {
  return prisma.goalSkill.create({
    data,
    include: {
      skill: true,
    },
  });
};

export const updateGoalSkill = async (
  goalId: string,
  skillId: string,
  data: {
    currentLevel?:
      | "NONE"
      | "BASIC"
      | "INTERMEDIATE"
      | "EXPERT";
    targetLevel?:
      | "NONE"
      | "BASIC"
      | "INTERMEDIATE"
      | "EXPERT";
  }
) => {
  return prisma.goalSkill.update({
    where: {
      goalId_skillId: {
        goalId,
        skillId,
      },
    },
    data,
    include: {
      skill: true,
    },
  });
};

export const deleteGoalSkill = async (
  goalId: string,
  skillId: string
) => {
  return prisma.goalSkill.delete({
    where: {
      goalId_skillId: {
        goalId,
        skillId,
      },
    },
  });
};

