import {
  createProgress,
  deleteProgress,
  findProgressById,
  findProgressByStatus,
  findProgressByUserAndResource,
  findProgressByUserId,
  updateProgress,
} from "../repositories/progress.repository";

import { findResourceById } from "../repositories/resource.repository";

export const createNewProgress = async (
  userId: string,
  data: {
    resourceId: string;
    status?:
      | "NOT_STARTED"
      | "IN_PROGRESS"
      | "COMPLETED";
    progress?: number;
  }
) => {
  const resource = await findResourceById(
    data.resourceId
  );

  if (!resource) {
    throw new Error("RESOURCE_NOT_FOUND");
  }

  const existing =
    await findProgressByUserAndResource(
      userId,
      data.resourceId
    );

  if (existing) {
    throw new Error(
      "PROGRESS_ALREADY_EXISTS"
    );
  }

  let status = data.status;
  let progress = data.progress;

  if (progress === 100) {
    status = "COMPLETED";
  }

  if (
    progress !== undefined &&
    progress > 0 &&
    progress < 100 &&
    status === undefined
  ) {
    status = "IN_PROGRESS";
  }

  return createProgress({
    userId,
    resourceId: data.resourceId,
    status,
    progress,
  });
};

export const getMyProgress = async (
  userId: string
) => {
  return findProgressByUserId(userId);
};

export const getProgress = async (
  userId: string,
  progressId: string
) => {
  const progress =
    await findProgressById(progressId);

  if (!progress) {
    throw new Error("PROGRESS_NOT_FOUND");
  }

  if (progress.userId !== userId) {
    throw new Error(
      "UNAUTHORIZED_PROGRESS_ACCESS"
    );
  }

  return progress;
};

export const getProgressByStatus = async (
  userId: string,
  status:
    | "NOT_STARTED"
    | "IN_PROGRESS"
    | "COMPLETED"
) => {
  return findProgressByStatus(
    userId,
    status
  );
};

export const updateMyProgress = async (
  userId: string,
  progressId: string,
  data: {
    status?:
      | "NOT_STARTED"
      | "IN_PROGRESS"
      | "COMPLETED";
    progress?: number;
  }
) => {
  await getProgress(
    userId,
    progressId
  );

  let status = data.status;
  let progress = data.progress;

  if (progress === 100) {
    status = "COMPLETED";
  } else if (
    progress !== undefined &&
    progress > 0 &&
    progress < 100 &&
    status === undefined
  ) {
    status = "IN_PROGRESS";
  }

  if (
    status === "COMPLETED" &&
    progress === undefined
  ) {
    progress = 100;
  }

  if (
    status === "NOT_STARTED" &&
    progress === undefined
  ) {
    progress = 0;
  }

  return updateProgress(
    progressId,
    {
      status,
      progress,
    }
  );
};

export const removeProgress = async (
  userId: string,
  progressId: string
) => {
  await getProgress(
    userId,
    progressId as string
  );

  await deleteProgress(progressId as string);
};