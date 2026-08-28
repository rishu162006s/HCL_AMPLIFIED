import prisma from "../config/prisma";

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

export const deleteQuiz = async (
  id: string
) => {
  return prisma.quiz.delete({
    where: {
      id,
    },
  });
};

export const createQuizQuestion =
  async (data: {
    question: string;
    quizId: string;
  }) => {
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

export const updateQuizQuestion =
  async (
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

export const deleteQuizQuestion =
  async (id: string) => {
    return prisma.quizQuestion.delete({
      where: {
        id,
      },
    });
  };

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
      isCorrect:
        data.isCorrect ?? false,
      questionId: data.questionId,
    },
  });
};

export const findQuizAnswerById = async (
  id: string
) => {
  return prisma.quizAnswer.findUnique({
    where: {
      id,
    },
  });
};

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

export const deleteQuizAnswer = async (
  id: string
) => {
  return prisma.quizAnswer.delete({
    where: {
      id,
    },
  });
};

export const createQuizAttempt =
  async (data: {
    userId: string;
    quizId: string;
    score: number;
  }) => {
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

export const findQuizAttemptById =
  async (id: string) => {
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

export const findQuizAttemptsByUser =
  async (userId: string) => {
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

export const findQuizAttemptsByQuiz =
  async (quizId: string) => {
    return prisma.quizAttempt.findMany({
      where: {
        quizId,
      },
      orderBy: {
        completedAt: "desc",
      },
    });
  };