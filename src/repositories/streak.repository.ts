import prisma from "../config/prisma";

export const findCompletedLearningDates = async (
  userId: string
) => {
  return prisma.learningHistory.findMany({
    where: {
      userId,
      completedAt: {
        not: null,
      },
    },
    select: {
      completedAt: true,
    },
    orderBy: {
      completedAt: "desc",
    },
  });
};