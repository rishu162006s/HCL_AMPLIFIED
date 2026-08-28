import {
  createLearningHistory,
  deleteLearningHistory,
  findLearningHistoryById,
  findLearningHistoryByUserAndResource,
  findLearningHistoryByUserId,
  updateLearningHistory,
} from "../repositories/learning-history.repository";

import { findResourceById } from "../repositories/resource.repository";

export const addLearningHistory = async (
  userId: string,
  data: {
    resourceId: string;
    completedAt?: string;
  }
) => {
  const resource = await findResourceById(
    data.resourceId
  );

  if (!resource) {
    throw new Error("RESOURCE_NOT_FOUND");
  }

  const existing =
    await findLearningHistoryByUserAndResource(
      userId,
      data.resourceId
    );

  if (existing) {
    throw new Error(
      "RESOURCE_ALREADY_IN_HISTORY"
    );
  }

  return createLearningHistory({
    userId,
    resourceId: data.resourceId,
    completedAt: data.completedAt
      ? new Date(data.completedAt)
      : undefined,
  });
};

export const getMyLearningHistory = async (
  userId: string
) => {
  return findLearningHistoryByUserId(userId);
};

export const getLearningHistory = async (
  userId: string,
  historyId: string
) => {
  const history =
    await findLearningHistoryById(historyId);

  if (!history) {
    throw new Error(
      "LEARNING_HISTORY_NOT_FOUND"
    );
  }

  if (history.userId !== userId) {
    throw new Error(
      "UNAUTHORIZED_HISTORY_ACCESS"
    );
  }

  return history;
};

export const updateMyLearningHistory =
  async (
    userId: string,
    historyId: string,
    data: {
      completedAt?: string | null;
    }
  ) => {
    await getLearningHistory(
      userId,
      historyId
    );

    return updateLearningHistory(
      historyId,
      {
        completedAt:
          data.completedAt === undefined
            ? undefined
            : data.completedAt === null
              ? null
              : new Date(data.completedAt),
      }
    );
  };

export const removeLearningHistory =
  async (
    userId: string,
    historyId: string
  ) => {
    await getLearningHistory(
      userId,
      historyId
    );

    await deleteLearningHistory(historyId);
  };