import {
  getGoalAnalytics,
  getLearningPathAnalytics,
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
    learningPaths,
    quizAnalytics,
    masteryAnalytics,
  ] = await Promise.all([
    getGoalAnalytics(userId),
    getProgressAnalytics(userId),
    getLearningPathAnalytics(userId),
    getQuizAnalytics(userId),
    getTopicMasteryAnalytics(userId),
  ]);

  const progressByResourceId = new Map(
    progressRecords.map((item) => [item.resourceId, item])
  );

  const pathSteps = learningPaths.flatMap((path) => path.steps);
  const uniqueResourceIds = [
    ...new Set(pathSteps.map((step) => step.resourceId)),
  ];

  const resourceStatuses = uniqueResourceIds.map((resourceId) => {
    const record = progressByResourceId.get(resourceId);
    const nested = pathSteps.find(
      (step) => step.resourceId === resourceId
    )?.resource.progress[0];

    return nested ?? record ?? null;
  });

  const totalResources =
    uniqueResourceIds.length > 0
      ? uniqueResourceIds.length
      : progressRecords.length;

  const statusList =
    uniqueResourceIds.length > 0
      ? resourceStatuses
      : progressRecords;

  const completedResources = statusList.filter(
    (item) =>
      item?.status === "COMPLETED" || item?.progress === 100
  ).length;

  const inProgressResources = statusList.filter(
    (item) =>
      item?.status === "IN_PROGRESS" &&
      (item.progress ?? 0) > 0 &&
      (item.progress ?? 0) < 100
  ).length;

  const notStartedResources = Math.max(
    0,
    totalResources - completedResources - inProgressResources
  );

  const serializedLearningPaths = learningPaths.map((path) => {
    const totalSteps = path.steps.length;
    const completedSteps = path.steps.filter((step) => {
      const progress = step.resource.progress[0];
      return progress?.status === "COMPLETED";
    }).length;

    return {
      id: path.id,
      title: path.title,
      description: path.description,
      goal: path.goal,
      totalSteps,
      completedSteps,
      progress:
        totalSteps === 0
          ? 0
          : Math.round((completedSteps / totalSteps) * 100),
    };
  });

  // --------------------------------------------------
  // OVERALL RESOURCE PROGRESS
  // --------------------------------------------------

  let overallProgress = 0;

  if (serializedLearningPaths.length > 0) {
    overallProgress = Math.round(
      serializedLearningPaths.reduce(
        (sum, path) => sum + path.progress,
        0
      ) / serializedLearningPaths.length
    );
  } else if (totalResources > 0) {
    const totalProgress = progressRecords.reduce(
      (sum, item) => sum + item.progress,
      0
    );

    overallProgress = Math.round(totalProgress / totalResources);
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

    learningPaths: serializedLearningPaths,
  };
};