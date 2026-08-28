import prisma from "../config/prisma";

export const findLearningPathForUser =
  async (
    userId: string,
    pathId: string
  ) => {
    return prisma.learningPath.findFirst({
      where: {
        id: pathId,
        userId,
      },
      include: {
        goal: {
          include: {
            requiredSkills: {
              include: {
                skill: true,
              },
            },
          },
        },
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

export const getUserLearningState =
  async (userId: string) => {
    const [
      masteries,
      progress,
      history,
    ] = await Promise.all([
      prisma.topicMastery.findMany({
        where: {
          userId,
        },
        select: {
          topicId: true,
          score: true,
          status: true,
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

      prisma.learningHistory.findMany({
        where: {
          userId,
          completedAt: {
            not: null,
          },
        },
        select: {
          resourceId: true,
          completedAt: true,
        },
      }),
    ]);

    return {
      masteries,
      progress,
      history,
    };
  };

export const reorderLearningSteps =
  async (
    steps: {
      id: number;
      order: number;
    }[]
  ) => {
    await prisma.$transaction(
      async (tx) => {
        for (
          let i = 0;
          i < steps.length;
          i++
        ) {
          await tx.learningStep.update({
            where: {
              id: steps[i].id,
            },
            data: {
              order: -(
                i + 1
              ),
            },
          });
        }

        for (
          let i = 0;
          i < steps.length;
          i++
        ) {
          await tx.learningStep.update({
            where: {
              id: steps[i].id,
            },
            data: {
              order: i + 1,
            },
          });
        }
      }
    );
  };