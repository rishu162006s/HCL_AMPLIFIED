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

import {
  findTopicById,
  findTopicMastery,
  createTopicMastery,
  updateTopicMastery,
} from "../repositories/topic.repository";

// --------------------------------------------------
// CREATE QUIZ
// --------------------------------------------------

export const createNewQuiz = async (
  data: {
    title: string;
    topicId: string;
  }
) => {
  const topic =
    await findTopicById(
      data.topicId
    );

  if (!topic) {
    throw new Error(
      "TOPIC_NOT_FOUND"
    );
  }

  const title =
    data.title.trim();

  if (!title) {
    throw new Error(
      "INVALID_QUIZ_TITLE"
    );
  }

  return createQuiz({
    title,
    topicId:
      data.topicId,
  });
};

// --------------------------------------------------
// GET ALL QUIZZES
// --------------------------------------------------

export const getQuizzes =
  async () => {
    return findAllQuizzes();
  };

// --------------------------------------------------
// GET QUIZ BY ID
// --------------------------------------------------

export const getQuiz =
  async (
    quizId: string
  ) => {
    const quiz =
      await findQuizById(
        quizId
      );

    if (!quiz) {
      throw new Error(
        "QUIZ_NOT_FOUND"
      );
    }

    return quiz;
  };

// --------------------------------------------------
// GET QUIZZES BY TOPIC
// --------------------------------------------------

export const getQuizzesForTopic =
  async (
    topicId: string
  ) => {
    const topic =
      await findTopicById(
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

export const updateExistingQuiz =
  async (
    quizId: string,
    data: {
      title?: string;
    }
  ) => {
    await getQuiz(
      quizId
    );

    if (
      data.title !== undefined
    ) {
      const title =
        data.title.trim();

      if (!title) {
        throw new Error(
          "INVALID_QUIZ_TITLE"
        );
      }
    }

    return updateQuiz(
      quizId,
      {
        title:
          data.title?.trim(),
      }
    );
  };

// --------------------------------------------------
// DELETE QUIZ
// --------------------------------------------------

export const removeQuiz =
  async (
    quizId: string
  ) => {
    await getQuiz(
      quizId
    );

    await deleteQuiz(
      quizId
    );
  };

// --------------------------------------------------
// ADD QUESTION
// --------------------------------------------------

export const addQuestion =
  async (
    quizId: string,
    question: string
  ) => {
    await getQuiz(
      quizId
    );

    const cleanedQuestion =
      question.trim();

    if (!cleanedQuestion) {
      throw new Error(
        "INVALID_QUESTION"
      );
    }

    return createQuizQuestion({
      quizId,
      question:
        cleanedQuestion,
    });
  };

// --------------------------------------------------
// GET QUESTION
// --------------------------------------------------

export const getQuestion =
  async (
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

export const updateQuestion =
  async (
    questionId: string,
    question: string
  ) => {
    await getQuestion(
      questionId
    );

    const cleanedQuestion =
      question.trim();

    if (!cleanedQuestion) {
      throw new Error(
        "INVALID_QUESTION"
      );
    }

    return updateQuizQuestion(
      questionId,
      {
        question:
          cleanedQuestion,
      }
    );
  };

// --------------------------------------------------
// DELETE QUESTION
// --------------------------------------------------

export const removeQuestion =
  async (
    questionId: string
  ) => {
    await getQuestion(
      questionId
    );

    await deleteQuizQuestion(
      questionId
    );
  };

// --------------------------------------------------
// ADD ANSWER
// --------------------------------------------------

export const addAnswer =
  async (
    questionId: string,
    data: {
      answerText: string;
      isCorrect?: boolean;
    }
  ) => {
    await getQuestion(
      questionId
    );

    const answerText =
      data.answerText.trim();

    if (!answerText) {
      throw new Error(
        "INVALID_ANSWER"
      );
    }

    return createQuizAnswer({
      questionId,
      answerText,
      isCorrect:
        data.isCorrect ?? false,
    });
  };

// --------------------------------------------------
// UPDATE ANSWER
// --------------------------------------------------

export const updateAnswer =
  async (
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

    if (
      data.answerText !== undefined &&
      !data.answerText.trim()
    ) {
      throw new Error(
        "INVALID_ANSWER"
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

export const removeAnswer =
  async (
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

export const submitQuiz =
  async (
    userId: string,
    quizId: string,
    submittedAnswers: {
      questionId: string;
      answerId: string;
    }[]
  ) => {
    const quiz =
      await findQuizById(
        quizId
      );

    if (!quiz) {
      throw new Error(
        "QUIZ_NOT_FOUND"
      );
    }

    if (
      quiz.questions.length === 0
    ) {
      throw new Error(
        "QUIZ_HAS_NO_QUESTIONS"
      );
    }

    if (
      submittedAnswers.length === 0
    ) {
      throw new Error(
        "NO_ANSWERS_SUBMITTED"
      );
    }

    // ----------------------------------------------
    // PREVENT DUPLICATE QUESTION SUBMISSIONS
    // ----------------------------------------------

    const submittedQuestionIds =
      new Set<string>();

    for (
      const submitted of
        submittedAnswers
    ) {
      if (
        submittedQuestionIds.has(
          submitted.questionId
        )
      ) {
        throw new Error(
          "DUPLICATE_QUESTION_ANSWER"
        );
      }

      submittedQuestionIds.add(
        submitted.questionId
      );
    }

    // ----------------------------------------------
    // QUESTION MAP
    // ----------------------------------------------

    const questionMap =
      new Map(
        quiz.questions.map(
          (question) => [
            question.id,
            question,
          ]
        )
      );

    let correctAnswers = 0;

    // ----------------------------------------------
    // VALIDATE EVERY SUBMISSION
    // ----------------------------------------------

    for (
      const submitted of
        submittedAnswers
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

      if (
        answer.isCorrect
      ) {
        correctAnswers++;
      }
    }

    // ----------------------------------------------
    // REQUIRE ANSWER FOR EVERY QUESTION
    // ----------------------------------------------

    if (
      submittedAnswers.length !==
      quiz.questions.length
    ) {
      throw new Error(
        "INCOMPLETE_QUIZ_SUBMISSION"
      );
    }

    // ----------------------------------------------
    // CALCULATE SCORE
    // ----------------------------------------------

    const score =
      Math.round(
        (correctAnswers /
          quiz.questions.length) *
          100
      );

    // ----------------------------------------------
    // CREATE ATTEMPT
    // ----------------------------------------------

    const attempt =
      await createQuizAttempt({
        userId,
        quizId,
        score,
      });

    // ----------------------------------------------
    // UPDATE TOPIC MASTERY
    //
    // Mastery stores the BEST score achieved.
    // A lower retake never decreases mastery.
    // ----------------------------------------------

    const existingMastery =
      await findTopicMastery(
        userId,
        quiz.topicId
      );

    const newScore =
      Math.max(
        existingMastery?.score ?? 0,
        score
      );

    const status =
      newScore >= 80
        ? "PREPARED"
        : newScore >= 40
        ? "NEEDS_IMPROVEMENT"
        : "NOT_PREPARED";

    const mastery =
      existingMastery
        ? await updateTopicMastery(
            userId,
            quiz.topicId,
            {
              score:
                newScore,
              status,
            }
          )
        : await createTopicMastery({
            userId,
            topicId:
              quiz.topicId,
            score:
              newScore,
            status,
          });

    return {
      attempt,
      score,
      correctAnswers,
      totalQuestions:
        quiz.questions.length,
      mastery,
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
    await getQuiz(
      quizId
    );

    return findQuizAttemptsByQuiz(
      quizId
    );
  };