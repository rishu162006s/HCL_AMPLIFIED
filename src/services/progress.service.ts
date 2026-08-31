import {
  createProgress,
  deleteProgress,
  findProgressById,
  findProgressByStatus,
  findProgressByUserAndResource,
  findProgressByUserId,
  updateProgress,
} from "../repositories/progress.repository";

import {
  findResourceById,
} from "../repositories/resource.repository";

import {
  createLearningHistory,
  findLearningHistoryByUserAndResource,
} from "../repositories/learning-history.repository";

// --------------------------------------------------
// RECORD COMPLETION IN LEARNING HISTORY
// --------------------------------------------------

const recordCompletionInHistory = async (
  userId: string,
  resourceId: string
) => {
  const existing =
    await findLearningHistoryByUserAndResource(
      userId,
      resourceId
    );

  if (existing) {
    return;
  }

  await createLearningHistory({
    userId,
    resourceId,
    completedAt: new Date(),
  });
};

// --------------------------------------------------
// CREATE PROGRESS
// --------------------------------------------------

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
  // -----------------------------------------------
  // VERIFY RESOURCE
  // -----------------------------------------------

  const resource = await findResourceById(
    data.resourceId
  );

  if (!resource) {
    throw new Error(
      "RESOURCE_NOT_FOUND"
    );
  }

  // -----------------------------------------------
  // VALIDATE PROGRESS RANGE
  // -----------------------------------------------

  if (
    data.progress !== undefined &&
    (data.progress < 0 ||
      data.progress > 100)
  ) {
    throw new Error(
      "INVALID_PROGRESS_VALUE"
    );
  }

  // -----------------------------------------------
  // CHECK DUPLICATE
  // -----------------------------------------------

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

  // -----------------------------------------------
  // DETERMINE STATUS
  // -----------------------------------------------

  let status = data.status;
  let progress = data.progress;

  if (progress === 100) {
    status = "COMPLETED";
  } else if (
    progress !== undefined &&
    progress > 0 &&
    progress < 100
  ) {
    status =
      status ?? "IN_PROGRESS";
  }

  if (
    status === "COMPLETED"
  ) {
    progress = 100;
  }

  if (
    status === "NOT_STARTED"
  ) {
    progress = 0;
  }

  if (
    status === undefined
  ) {
    status = "NOT_STARTED";
  }

  if (
    progress === undefined
  ) {
    progress = 0;
  }

  // -----------------------------------------------
  // CREATE
  // -----------------------------------------------

  const created =
    await createProgress({
      userId,
      resourceId:
        data.resourceId,
      status,
      progress,
    });

  // -----------------------------------------------
  // COMPLETION → HISTORY
  // -----------------------------------------------

  if (
    status === "COMPLETED"
  ) {
    await recordCompletionInHistory(
      userId,
      data.resourceId
    );
  }

  return created;
};

// --------------------------------------------------
// GET ALL MY PROGRESS
// --------------------------------------------------

export const getMyProgress = async (
  userId: string
) => {
  return findProgressByUserId(
    userId
  );
};

// --------------------------------------------------
// GET ONE PROGRESS
// --------------------------------------------------

export const getProgress = async (
  userId: string,
  progressId: string
) => {
  const progress =
    await findProgressById(
      progressId
    );

  if (!progress) {
    throw new Error(
      "PROGRESS_NOT_FOUND"
    );
  }

  if (
    progress.userId !== userId
  ) {
    throw new Error(
      "UNAUTHORIZED_PROGRESS_ACCESS"
    );
  }

  return progress;
};

// --------------------------------------------------
// GET PROGRESS BY STATUS
// --------------------------------------------------

export const getProgressByStatus =
  async (
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

// --------------------------------------------------
// UPDATE PROGRESS
// --------------------------------------------------

export const updateMyProgress =
  async (
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
    // ---------------------------------------------
    // VERIFY OWNERSHIP
    // ---------------------------------------------

    const existingProgress =
      await getProgress(
        userId,
        progressId
      );

    // ---------------------------------------------
    // VALIDATE PROGRESS
    // ---------------------------------------------

    if (
      data.progress !== undefined &&
      (data.progress < 0 ||
        data.progress > 100)
    ) {
      throw new Error(
        "INVALID_PROGRESS_VALUE"
      );
    }

    // ---------------------------------------------
    // DETERMINE NEW VALUES
    // ---------------------------------------------

    let status =
      data.status;

    let progress =
      data.progress;

    // 100% ALWAYS MEANS COMPLETED

    if (
      progress === 100
    ) {
      status =
        "COMPLETED";
    }

    // 0% means NOT_STARTED unless
    // the caller explicitly supplies another
    // valid status.

    if (
      progress === 0 &&
      status === undefined
    ) {
      status =
        "NOT_STARTED";
    }

    // Between 0 and 100 means IN_PROGRESS
    // when status is not explicitly supplied.

    if (
      progress !== undefined &&
      progress > 0 &&
      progress < 100 &&
      status === undefined
    ) {
      status =
        "IN_PROGRESS";
    }

    // COMPLETED always has 100%

    if (
      status === "COMPLETED"
    ) {
      progress = 100;
    }

    // NOT_STARTED always has 0%

    if (
      status === "NOT_STARTED"
    ) {
      progress = 0;
    }

    // If only status is supplied,
    // derive the corresponding progress.

    if (
      status === "IN_PROGRESS" &&
      progress === undefined
    ) {
      progress =
        existingProgress.progress > 0 &&
        existingProgress.progress < 100
          ? existingProgress.progress
          : 1;
    }

    if (
      status === undefined &&
      progress === undefined
    ) {
      throw new Error(
        "NO_PROGRESS_UPDATE"
      );
    }

    // ---------------------------------------------
    // UPDATE DATABASE
    // ---------------------------------------------

    const updated =
      await updateProgress(
        progressId,
        {
          status,
          progress,
        }
      );

    // ---------------------------------------------
    // COMPLETION → LEARNING HISTORY
    // ---------------------------------------------

    if (
      status === "COMPLETED" &&
      existingProgress.status !==
        "COMPLETED"
    ) {
      await recordCompletionInHistory(
        userId,
        existingProgress.resourceId
      );
    }

    return updated;
  };

// --------------------------------------------------
// DELETE PROGRESS
// --------------------------------------------------

export const removeProgress =
  async (
    userId: string,
    progressId: string
  ) => {
    // ---------------------------------------------
    // VERIFY OWNERSHIP
    // ---------------------------------------------

    await getProgress(
      userId,
      progressId
    );

    // ---------------------------------------------
    // DELETE
    // ---------------------------------------------

    await deleteProgress(
      progressId
    );
  };