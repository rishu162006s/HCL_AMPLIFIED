import {
  findLearningPathForUser,
  getUserLearningState,
  reorderLearningSteps,
} from "../repositories/adaptive-learning.repository";

export const getAdaptiveLearningPath =
  async (
    userId: string,
    pathId: string
  ) => {
    const path =
      await findLearningPathForUser(
        userId,
        pathId
      );

    if (!path) {
      throw new Error(
        "LEARNING_PATH_NOT_FOUND"
      );
    }

    const state =
      await getUserLearningState(
        userId
      );

    const completedResources =
      new Set(
        state.history.map(
          (item) =>
            item.resourceId
        )
      );

    const steps =
      path.steps.map(
        (step) => ({
          ...step,
          completed:
            completedResources.has(
              step.resourceId
            ),
        })
      );

    const completedSteps =
      steps.filter(
        (step) =>
          step.completed
      );

    const pendingSteps =
      steps
        .filter(
          (step) =>
            !step.completed
        )
        .sort(
          (a, b) =>
            a.order - b.order
        );

    return {
      path,

      steps,

      completedSteps,

      pendingSteps,

      totalSteps:
        steps.length,

      completedCount:
        completedSteps.length,

      pendingCount:
        pendingSteps.length,

      completionPercentage:
        steps.length === 0
          ? 0
          : Number(
              (
                (completedSteps.length /
                  steps.length) *
                100
              ).toFixed(2)
            ),
    };
  };

export const recalculateLearningPath =
  async (
    userId: string,
    pathId: string
  ) => {
    const path =
      await findLearningPathForUser(
        userId,
        pathId
      );

    if (!path) {
      throw new Error(
        "LEARNING_PATH_NOT_FOUND"
      );
    }

    const state =
      await getUserLearningState(
        userId
      );

    const completedResources =
      new Set(
        state.history.map(
          (item) =>
            item.resourceId
        )
      );

    const completedSteps =
      path.steps.filter(
        (step) =>
          completedResources.has(
            step.resourceId
          )
      );

    const pendingSteps =
      path.steps
        .filter(
          (step) =>
            !completedResources.has(
              step.resourceId
            )
        )
        .sort(
          (a, b) =>
            a.order - b.order
        );

    const reorderedSteps = [
      ...completedSteps,
      ...pendingSteps,
    ];

    await reorderLearningSteps(
      reorderedSteps.map(
        (step, index) => ({
          id: step.id,
          order: index + 1,
        })
      )
    );

    return getAdaptiveLearningPath(
      userId,
      pathId
    );
  };