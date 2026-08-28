import {
  createFeedback,
  deleteFeedback,
  findFeedbackById,
  findFeedbackByUserId,
  updateFeedback,
} from "../repositories/feedback.repository";

// --------------------------------------------------
// CREATE FEEDBACK
// --------------------------------------------------

export const createNewFeedback = async (data: {
  userId: string;
  rating: number;
  comment?: string;
}) => {
  return createFeedback({
    userId: data.userId,
    rating: data.rating,
    comment: data.comment?.trim(),
  });
};

// --------------------------------------------------
// GET MY FEEDBACK
// --------------------------------------------------

export const getMyFeedback = async (
  userId: string
) => {
  return findFeedbackByUserId(userId);
};

// --------------------------------------------------
// GET ONE FEEDBACK
// --------------------------------------------------

export const getMyFeedbackById = async (
  userId: string,
  feedbackId: string
) => {
  const feedback =
    await findFeedbackById(feedbackId);

  if (!feedback) {
    throw new Error("FEEDBACK_NOT_FOUND");
  }

  if (feedback.userId !== userId) {
    throw new Error(
      "UNAUTHORIZED_FEEDBACK_ACCESS"
    );
  }

  return feedback;
};

// --------------------------------------------------
// UPDATE FEEDBACK
// --------------------------------------------------

export const updateMyFeedback = async (
  userId: string,
  feedbackId: string,
  data: {
    rating?: number;
    comment?: string | null;
  }
) => {
  await getMyFeedbackById(
    userId,
    feedbackId
  );

  return updateFeedback(feedbackId, {
    rating: data.rating,
    comment:
      data.comment === null
        ? null
        : data.comment?.trim(),
  });
};

// --------------------------------------------------
// DELETE FEEDBACK
// --------------------------------------------------

export const removeMyFeedback = async (
  userId: string,
  feedbackId: string
) => {
  await getMyFeedbackById(
    userId,
    feedbackId
  );

  await deleteFeedback(feedbackId);
};