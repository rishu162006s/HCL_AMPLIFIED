import {
  createQuiz,
  createQuizAnswer,
  createQuizAttempt,
  createQuizQuestion,
  deleteQuiz,
  deleteQuizAnswer,
  deleteQuizQuestion,
  findAllQuizzes,
  findQuizAnswerById,
  findQuizById,
  findQuizQuestionById,
  findQuizAttemptsByQuiz,
  findQuizAttemptsByUser,
  findQuizzesByTopicId,
  updateQuiz,
  updateQuizAnswer,
  updateQuizQuestion,
} from "../repositories/quiz.repository";

import { findTopicById } from "../repositories/topic.repository";


// --------------------------------------------------
// CREATE QUIZ
// --------------------------------------------------

export const createNewQuiz = async (
  data: {
    title: string;
    topicId: string;
  }
) => {
  const topic = await findTopicById(
    data.topicId
  );

  if (!topic) {
    throw new Error("TOPIC_NOT_FOUND");
  }

  return createQuiz({
    title: data.title.trim(),
    topicId: data.topicId,
  });
};


// --------------------------------------------------
// GET ALL QUIZZES
// --------------------------------------------------

export const getQuizzes = async () => {
  return findAllQuizzes();
};


// --------------------------------------------------
// GET QUIZ BY ID
// --------------------------------------------------

export const getQuiz = async (
  quizId: string
) => {
  const quiz = await findQuizById(
    quizId
  );

  if (!quiz) {
    throw new Error("QUIZ_NOT_FOUND");
  }

  return quiz;
};


// --------------------------------------------------
// GET QUIZZES BY TOPIC
// --------------------------------------------------

export const getQuizzesForTopic = async (
  topicId: string
) => {
  const topic = await findTopicById(
    topicId
  );

  if (!topic) {
    throw new Error(
      "TOPIC_NOT_FOUND"
    );
  }

  return findQuizzesByTopicId(
    topicId
  );
};


// --------------------------------------------------
// UPDATE QUIZ
// --------------------------------------------------

export const updateExistingQuiz = async (
  quizId: string,
  data: {
    title?: string;
  }
) => {
  await getQuiz(quizId);

  return updateQuiz(quizId, {
    title: data.title?.trim(),
  });
};


// --------------------------------------------------
// DELETE QUIZ
// --------------------------------------------------

export const removeQuiz = async (
  quizId: string
) => {
  await getQuiz(quizId);

  await deleteQuiz(quizId);
};


// --------------------------------------------------
// ADD QUESTION
// --------------------------------------------------

export const addQuestion = async (
  quizId: string,
  question: string
) => {
  await getQuiz(quizId);

  return createQuizQuestion({
    quizId,
    question: question.trim(),
  });
};


// --------------------------------------------------
// GET QUESTION
// --------------------------------------------------

export const getQuestion = async (
  questionId: string
) => {
  const question =
    await findQuizQuestionById(
      questionId
    );

  if (!question) {
    throw new Error(
      "QUESTION_NOT_FOUND"
    );
  }

  return question;
};


// --------------------------------------------------
// UPDATE QUESTION
// --------------------------------------------------

export const updateQuestion = async (
  questionId: string,
  question: string
) => {
  await getQuestion(questionId);

  return updateQuizQuestion(
    questionId,
    {
      question: question.trim(),
    }
  );
};


// --------------------------------------------------
// DELETE QUESTION
// --------------------------------------------------

export const removeQuestion = async (
  questionId: string
) => {
  await getQuestion(questionId);

  await deleteQuizQuestion(
    questionId
  );
};


// --------------------------------------------------
// ADD ANSWER
// --------------------------------------------------

export const addAnswer = async (
  questionId: string,
  data: {
    answerText: string;
    isCorrect?: boolean;
  }
) => {
  await getQuestion(questionId);

  return createQuizAnswer({
    questionId,
    answerText:
      data.answerText.trim(),
    isCorrect:
      data.isCorrect ?? false,
  });
};


// --------------------------------------------------
// UPDATE ANSWER
// --------------------------------------------------

export const updateAnswer = async (
  answerId: string,
  data: {
    answerText?: string;
    isCorrect?: boolean;
  }
) => {
  const answer =
    await findQuizAnswerById(
      answerId
    );

  if (!answer) {
    throw new Error(
      "ANSWER_NOT_FOUND"
    );
  }

  return updateQuizAnswer(
    answerId,
    {
      answerText:
        data.answerText?.trim(),
      isCorrect:
        data.isCorrect,
    }
  );
};


// --------------------------------------------------
// DELETE ANSWER
// --------------------------------------------------

export const removeAnswer = async (
  answerId: string
) => {
  const answer =
    await findQuizAnswerById(
      answerId
    );

  if (!answer) {
    throw new Error(
      "ANSWER_NOT_FOUND"
    );
  }

  await deleteQuizAnswer(
    answerId
  );
};


// --------------------------------------------------
// SUBMIT QUIZ
// --------------------------------------------------

export const submitQuiz = async (
  userId: string,
  quizId: string,
  submittedAnswers: {
    questionId: string;
    answerId: string;
  }[]
) => {
  const quiz = await findQuizById(
    quizId
  );

  if (!quiz) {
    throw new Error(
      "QUIZ_NOT_FOUND"
    );
  }

  if (quiz.questions.length === 0) {
    throw new Error(
      "QUIZ_HAS_NO_QUESTIONS"
    );
  }

  const questionMap = new Map(
    quiz.questions.map(
      (question) => [
        question.id,
        question,
      ]
    )
  );

  let correctAnswers = 0;

  for (
    const submitted of submittedAnswers
  ) {
    const question =
      questionMap.get(
        submitted.questionId
      );

    if (!question) {
      throw new Error(
        "INVALID_QUESTION"
      );
    }

    const answer =
      question.answers.find(
        (item) =>
          item.id ===
          submitted.answerId
      );

    if (!answer) {
      throw new Error(
        "INVALID_ANSWER"
      );
    }

    if (answer.isCorrect) {
      correctAnswers++;
    }
  }

  const score = Math.round(
    (correctAnswers /
      quiz.questions.length) *
      100
  );

  const attempt =
    await createQuizAttempt({
      userId,
      quizId,
      score,
    });

  return {
    attempt,
    score,
    correctAnswers,
    totalQuestions:
      quiz.questions.length,
  };
};


// --------------------------------------------------
// GET MY QUIZ ATTEMPTS
// --------------------------------------------------

export const getMyQuizAttempts =
  async (
    userId: string
  ) => {
    return findQuizAttemptsByUser(
      userId
    );
  };


// --------------------------------------------------
// GET QUIZ ATTEMPTS
// --------------------------------------------------

export const getQuizAttempts =
  async (
    quizId: string
  ) => {
    await getQuiz(quizId);

    return findQuizAttemptsByQuiz(
      quizId
    );
  };