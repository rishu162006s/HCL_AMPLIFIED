import prisma from "../config/prisma";

// --------------------------------------------------
// CREATE FEEDBACK
// --------------------------------------------------

export const createFeedback = async (data: {
  userId: string;
  rating: number;
  comment?: string;
}) => {
  return prisma.feedback.create({
    data: {
      userId: data.userId,
      rating: data.rating,
      comment: data.comment,
    },
  });
};

// --------------------------------------------------
// FIND FEEDBACK BY ID
// --------------------------------------------------

export const findFeedbackById = async (
  id: string
) => {
  return prisma.feedback.findUnique({
    where: {
      id,
    },
  });
};

// --------------------------------------------------
// FIND ALL FEEDBACK BY USER
// --------------------------------------------------

export const findFeedbackByUserId = async (
  userId: string
) => {
  return prisma.feedback.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// --------------------------------------------------
// UPDATE FEEDBACK
// --------------------------------------------------

export const updateFeedback = async (
  id: string,
  data: {
    rating?: number;
    comment?: string | null;
  }
) => {
  return prisma.feedback.update({
    where: {
      id,
    },
    data,
  });
};

// --------------------------------------------------
// DELETE FEEDBACK
// --------------------------------------------------

export const deleteFeedback = async (
  id: string
) => {
  return prisma.feedback.delete({
    where: {
      id,
    },
  });
};