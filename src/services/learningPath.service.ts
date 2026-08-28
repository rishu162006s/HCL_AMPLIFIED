import {
  createLearningPath,
  createLearningStep,
  deleteLearningPath,
  deleteLearningStep,
  findLearningPathById,
  findLearningPathsByUserId,
  findLearningStepById,
  findLearningStepByPathAndResource,
  findMaxStepOrder,
  updateLearningPath,
  updateLearningStepOrder,
} from "../repositories/learningPath.repository";

import { findGoalById } from "../repositories/goal.repository";
import { findResourceById } from "../repositories/resource.repository";

// --------------------------------------------------
// CREATE LEARNING PATH
// --------------------------------------------------

export const createNewLearningPath = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    goalId?: string;
  }
) => {
  if (data.goalId) {
    const goal = await findGoalById(data.goalId);

    if (!goal) {
      throw new Error("GOAL_NOT_FOUND");
    }

    if (goal.userId !== userId) {
      throw new Error("UNAUTHORIZED_GOAL_ACCESS");
    }
  }

  return createLearningPath({
    userId,
    title: data.title.trim(),
    description: data.description?.trim(),
    goalId: data.goalId,
  });
};

// --------------------------------------------------
// GET MY LEARNING PATHS
// --------------------------------------------------

export const getMyLearningPaths = async (
  userId: string
) => {
  return findLearningPathsByUserId(userId);
};

// --------------------------------------------------
// GET ONE LEARNING PATH
// --------------------------------------------------

export const getMyLearningPath = async (
  userId: string,
  learningPathId: string
) => {
  const learningPath =
    await findLearningPathById(
      learningPathId
    );

  if (!learningPath) {
    throw new Error(
      "LEARNING_PATH_NOT_FOUND"
    );
  }

  if (learningPath.userId !== userId) {
    throw new Error(
      "UNAUTHORIZED_LEARNING_PATH_ACCESS"
    );
  }

  return learningPath;
};

// --------------------------------------------------
// UPDATE LEARNING PATH
// --------------------------------------------------

export const updateMyLearningPath =
  async (
    userId: string,
    learningPathId: string,
    data: {
      title?: string;
      description?: string | null;
    }
  ) => {
    await getMyLearningPath(
      userId,
      learningPathId
    );

    return updateLearningPath(
      learningPathId,
      {
        title: data.title?.trim(),
        description:
          data.description?.trim(),
      }
    );
  };

// --------------------------------------------------
// DELETE LEARNING PATH
// --------------------------------------------------

export const removeLearningPath = async (
  userId: string,
  learningPathId: string
) => {
  await getMyLearningPath(
    userId,
    learningPathId
  );

  await deleteLearningPath(
    learningPathId
  );
};

// --------------------------------------------------
// ADD RESOURCE TO LEARNING PATH
// --------------------------------------------------

export const addResourceToLearningPath =
  async (
    userId: string,
    learningPathId: string,
    data: {
      resourceId: string;
      milestone?: string;
    }
  ) => {
    await getMyLearningPath(
      userId,
      learningPathId
    );

    const resource =
      await findResourceById(
        data.resourceId
      );

    if (!resource) {
      throw new Error(
        "RESOURCE_NOT_FOUND"
      );
    }

    const existing =
      await findLearningStepByPathAndResource(
        learningPathId,
        data.resourceId
      );

    if (existing) {
      throw new Error(
        "RESOURCE_ALREADY_IN_PATH"
      );
    }

    const maxOrder =
      await findMaxStepOrder(
        learningPathId
      );

    const order =
      maxOrder === null
        ? 1
        : maxOrder + 1;

    return createLearningStep({
      learningPathId,
      resourceId: data.resourceId,
      order,
      milestone:
        data.milestone?.trim(),
    });
  };

// --------------------------------------------------
// REMOVE STEP FROM LEARNING PATH
// --------------------------------------------------

export const removeLearningStep =
  async (
    userId: string,
    learningPathId: string,
    stepId: number
  ) => {
    await getMyLearningPath(
      userId,
      learningPathId
    );

    const step =
      await findLearningStepById(
        stepId
      );

    if (!step) {
      throw new Error(
        "LEARNING_STEP_NOT_FOUND"
      );
    }

    if (
      step.learningPathId !==
      learningPathId
    ) {
      throw new Error(
        "LEARNING_STEP_NOT_IN_PATH"
      );
    }

    await deleteLearningStep(stepId);
  };

// --------------------------------------------------
// REORDER LEARNING STEP
// --------------------------------------------------

export const reorderLearningStep =
  async (
    userId: string,
    learningPathId: string,
    stepId: number,
    order: number
  ) => {
    await getMyLearningPath(
      userId,
      learningPathId
    );

    const step =
      await findLearningStepById(
        stepId
      );

    if (!step) {
      throw new Error(
        "LEARNING_STEP_NOT_FOUND"
      );
    }

    if (
      step.learningPathId !==
      learningPathId
    ) {
      throw new Error(
        "LEARNING_STEP_NOT_IN_PATH"
      );
    }

    return updateLearningStepOrder(
      stepId,
      order
    );
  };