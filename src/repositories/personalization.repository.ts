import prisma from "../config/prisma";

export const getPersonalizationData =
  async (userId: string) => {
    const [
      user,
      skills,
      goals,
      masteries,
      progress,
      quizAttempts,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          technicalLevel: true,
        },
      }),

      prisma.userSkill.findMany({
        where: {
          userId,
        },
        select: {
          skillId: true,
          level: true,
          skill: {
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
          status: "ACTIVE",
        },
        select: {
          id: true,
          title: true,
          objective: true,
          theoryPracticeRatio: true,
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
          topic: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      prisma.progress.findMany({
        where: {
          userId,
        },
        select: {
          resourceId: true,
          progress: true,
          status: true,
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
          completedAt: "desc",
        },
        take: 10,
      }),
    ]);

    return {
      user,
      skills,
      goals,
      masteries,
      progress,
      quizAttempts,
    };
  };