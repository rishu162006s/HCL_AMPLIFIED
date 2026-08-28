import prisma from "../config/prisma";

export const getLearningInsightsData =
  async (userId: string) => {
    const [
      progress,
      learningHistory,
      quizAttempts,
      topicMasteries,
      goals,
    ] = await Promise.all([
      prisma.progress.findMany({
        where: {
          userId,
        },
        select: {
          progress: true,
          status: true,
          resourceId: true,
        },
      }),

      prisma.learningHistory.findMany({
        where: {
          userId,
        },
        select: {
          completedAt: true,
          createdAt: true,
          resourceId: true,
        },
      }),

      prisma.quizAttempt.findMany({
        where: {
          userId,
        },
        select: {
          score: true,
          completedAt: true,
        },
        orderBy: {
          completedAt: "asc",
        },
      }),

      prisma.topicMastery.findMany({
        where: {
          userId,
        },
        select: {
          topicId: true,
          score: true,
          status: true,
          updatedAt: true,
          topic: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      prisma.goal.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          title: true,
          status: true,
          targetDate: true,
        },
      }),
    ]);

    return {
      progress,
      learningHistory,
      quizAttempts,
      topicMasteries,
      goals,
    };
  };