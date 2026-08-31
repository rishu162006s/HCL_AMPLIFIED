import prisma from "../config/prisma";

// --------------------------------------------------
// GET QUIZ BY ID
// --------------------------------------------------

export const findQuizById = async (
  id: string
) => {
  return prisma.quiz.findUnique({
    where: {
      id,
    },
    include: {
      topic: {
        include: {
          skill: true,
        },
      },
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });
};

// --------------------------------------------------
// GET QUIZZES BY TOPIC
// --------------------------------------------------

export const findQuizzesByTopicId = async (
  topicId: string
) => {
  return prisma.quiz.findMany({
    where: {
      topicId,
    },
    include: {
      topic: true,
      questions: {
        include: {
          answers: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// --------------------------------------------------
// GET ALL QUIZZES
// --------------------------------------------------

export const findAllQuizzes = async () => {
  return prisma.quiz.findMany({
    include: {
      topic: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// --------------------------------------------------
// CREATE QUIZ
// --------------------------------------------------

export const createQuiz = async (data: {
  title: string;
  topicId: string;
}) => {
  return prisma.quiz.create({
    data: {
      title: data.title,
      topicId: data.topicId,
    },
    include: {
      topic: true,
    },
  });
};

// --------------------------------------------------
// UPDATE QUIZ
// --------------------------------------------------

export const updateQuiz = async (
  id: string,
  data: {
    title?: string;
  }
) => {
  return prisma.quiz.update({
    where: {
      id,
    },
    data,
    include: {
      topic: true,
    },
  });
};

// --------------------------------------------------
// DELETE QUIZ
// --------------------------------------------------

export const deleteQuiz = async (
  id: string
) => {
  return prisma.quiz.delete({
    where: {
      id,
    },
  });
};

// --------------------------------------------------
// CREATE QUESTION
// --------------------------------------------------

export const createQuizQuestion = async (
  data: {
    question: string;
    quizId: string;
  }
) => {
  return prisma.quizQuestion.create({
    data: {
      question: data.question,
      quizId: data.quizId,
    },
    include: {
      answers: true,
    },
  });
};

// --------------------------------------------------
// GET QUESTION BY ID
// --------------------------------------------------

export const findQuizQuestionById = async (
  id: string
) => {
  return prisma.quizQuestion.findUnique({
    where: {
      id,
    },
    include: {
      quiz: true,
      answers: true,
    },
  });
};

// --------------------------------------------------
// UPDATE QUESTION
// --------------------------------------------------

export const updateQuizQuestion = async (
  id: string,
  data: {
    question?: string;
  }
) => {
  return prisma.quizQuestion.update({
    where: {
      id,
    },
    data,
    include: {
      answers: true,
    },
  });
};

// --------------------------------------------------
// DELETE QUESTION
// --------------------------------------------------

export const deleteQuizQuestion = async (
  id: string
) => {
  return prisma.quizQuestion.delete({
    where: {
      id,
    },
  });
};

// --------------------------------------------------
// CREATE ANSWER
// --------------------------------------------------

export const createQuizAnswer = async (
  data: {
    answerText: string;
    isCorrect?: boolean;
    questionId: string;
  }
) => {
  return prisma.quizAnswer.create({
    data: {
      answerText: data.answerText,
      isCorrect: data.isCorrect ?? false,
      questionId: data.questionId,
    },
  });
};

// --------------------------------------------------
// GET ANSWER BY ID
// --------------------------------------------------

export const findQuizAnswerById = async (
  id: string
) => {
  return prisma.quizAnswer.findUnique({
    where: {
      id,
    },
  });
};

// --------------------------------------------------
// UPDATE ANSWER
// --------------------------------------------------

export const updateQuizAnswer = async (
  id: string,
  data: {
    answerText?: string;
    isCorrect?: boolean;
  }
) => {
  return prisma.quizAnswer.update({
    where: {
      id,
    },
    data,
  });
};

// --------------------------------------------------
// DELETE ANSWER
// --------------------------------------------------

export const deleteQuizAnswer = async (
  id: string
) => {
  return prisma.quizAnswer.delete({
    where: {
      id,
    },
  });
};

// --------------------------------------------------
// CREATE QUIZ ATTEMPT
// --------------------------------------------------

export const createQuizAttempt = async (
  data: {
    userId: string;
    quizId: string;
    score: number;
  }
) => {
  return prisma.quizAttempt.create({
    data: {
      userId: data.userId,
      quizId: data.quizId,
      score: data.score,
    },
    include: {
      quiz: {
        include: {
          topic: true,
        },
      },
    },
  });
};

// --------------------------------------------------
// GET QUIZ ATTEMPT BY ID
// --------------------------------------------------

export const findQuizAttemptById = async (
  id: string
) => {
  return prisma.quizAttempt.findUnique({
    where: {
      id,
    },
    include: {
      quiz: {
        include: {
          topic: true,
        },
      },
    },
  });
};

// --------------------------------------------------
// GET USER QUIZ ATTEMPTS
// --------------------------------------------------

export const findQuizAttemptsByUser = async (
  userId: string
) => {
  return prisma.quizAttempt.findMany({
    where: {
      userId,
    },
    include: {
      quiz: {
        include: {
          topic: true,
        },
      },
    },
    orderBy: {
      completedAt: "desc",
    },
  });
};

// --------------------------------------------------
// GET QUIZ ATTEMPTS
// --------------------------------------------------

export const findQuizAttemptsByQuiz = async (
  quizId: string
) => {
  return prisma.quizAttempt.findMany({
    where: {
      quizId,
    },
    orderBy: {
      completedAt: "desc",
    },
  });
};

