import prisma from "../config/prisma";

// --------------------------------------------------
// GOAL ANALYTICS
// --------------------------------------------------

export const getGoalAnalytics = async (
  userId: string
) => {
  const [total, active, completed] =
    await Promise.all([
      prisma.goal.count({
        where: {
          userId,
        },
      }),

      prisma.goal.count({
        where: {
          userId,
          status: "ACTIVE",
        },
      }),

      prisma.goal.count({
        where: {
          userId,
          status: "COMPLETED",
        },
      }),
    ]);

  return {
    total,
    active,
    completed,
  };
};

// --------------------------------------------------
// PROGRESS ANALYTICS
// --------------------------------------------------

export const getProgressAnalytics = async (
  userId: string
) => {
  return prisma.progress.findMany({
    where: {
      userId,
    },
    select: {
      progress: true,
      status: true,
    },
  });
};

// --------------------------------------------------
// QUIZ ANALYTICS
// --------------------------------------------------

export const getQuizAnalytics = async (
  userId: string
) => {
  return prisma.quizAttempt.aggregate({
    where: {
      userId,
    },
    _avg: {
      score: true,
    },
    _count: {
      id: true,
    },
  });
};

// --------------------------------------------------
// TOPIC MASTERY ANALYTICS
// --------------------------------------------------

export const getTopicMasteryAnalytics =
  async (userId: string) => {
    return prisma.topicMastery.aggregate({
      where: {
        userId,
      },
      _avg: {
        score: true,
      },
      _count: {
        id: true,
      },
    });
  };