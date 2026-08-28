import {
  getGoalAnalytics,
  getProgressAnalytics,
  getQuizAnalytics,
  getTopicMasteryAnalytics,
} from "../repositories/analytics.repository";

// --------------------------------------------------
// GET LEARNING ANALYTICS
// --------------------------------------------------

export const getLearningAnalytics = async (
  userId: string
) => {
  const [
    goals,
    progressRecords,
    quizAnalytics,
    masteryAnalytics,
  ] = await Promise.all([
    getGoalAnalytics(userId),
    getProgressAnalytics(userId),
    getQuizAnalytics(userId),
    getTopicMasteryAnalytics(userId),
  ]);

  // --------------------------------------------------
  // RESOURCE PROGRESS
  // --------------------------------------------------

  const totalResources =
    progressRecords.length;

  const completedResources =
    progressRecords.filter(
      (item) =>
        item.status === "COMPLETED" ||
        item.progress === 100
    ).length;

  const inProgressResources =
    progressRecords.filter(
      (item) =>
        item.status === "IN_PROGRESS" &&
        item.progress > 0 &&
        item.progress < 100
    ).length;

  const notStartedResources =
    progressRecords.filter(
      (item) =>
        item.status === "NOT_STARTED" ||
        item.progress === 0
    ).length;

  // --------------------------------------------------
  // OVERALL RESOURCE PROGRESS
  // --------------------------------------------------

  let overallProgress = 0;

  if (totalResources > 0) {
    const totalProgress =
      progressRecords.reduce(
        (sum, item) =>
          sum + item.progress,
        0
      );

    overallProgress = Math.round(
      totalProgress / totalResources
    );
  }

  // --------------------------------------------------
  // AVERAGE QUIZ SCORE
  // --------------------------------------------------

  const averageQuizScore =
    quizAnalytics._avg.score !== null
      ? Math.round(
          quizAnalytics._avg.score
        )
      : 0;

  // --------------------------------------------------
  // AVERAGE TOPIC MASTERY
  // --------------------------------------------------

  const averageTopicMastery =
    masteryAnalytics._avg.score !== null
      ? Math.round(
          masteryAnalytics._avg.score
        )
      : 0;

  // --------------------------------------------------
  // FINAL RESPONSE
  // --------------------------------------------------

  return {
    overallProgress,

    goals: {
      total: goals.total,
      active: goals.active,
      completed: goals.completed,
    },

    resources: {
      total: totalResources,
      completed: completedResources,
      inProgress: inProgressResources,
      notStarted: notStartedResources,
    },

    averageQuizScore,

    averageTopicMastery,

    quizzesAttempted:
      quizAnalytics._count.id,

    topicsTracked:
      masteryAnalytics._count.id,
  };
};