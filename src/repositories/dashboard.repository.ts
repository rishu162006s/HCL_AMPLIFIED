import prisma from "../config/prisma";

// --------------------------------------------------
// GET DASHBOARD DATA FOR USER
// --------------------------------------------------

export const findDashboardData = async (
  userId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
    },
  });

  const goals = await prisma.goal.findMany({
    where: {
      userId,
    },

    include: {
      learningPaths: {
        include: {
          steps: {
            include: {
              resource: {
                include: {
                  progress: {
                    where: {
                      userId,
                    },
                  },
                },
              },
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const quizAttempts =
    await prisma.quizAttempt.findMany({
      where: {
        userId,
      },
      select: {
        score: true,
      },
    });

  return {
    user,
    goals,
    quizAttempts,
  };
};