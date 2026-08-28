import {
  findDashboardData,
} from "../repositories/dashboard.repository";

// --------------------------------------------------
// GET USER DASHBOARD
// --------------------------------------------------

export const getDashboard = async (
  userId: string
) => {
  const {
    user,
    goals,
    quizAttempts,
  } = await findDashboardData(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // --------------------------------------------------
  // GOAL STATISTICS
  // --------------------------------------------------

  const totalGoals = goals.length;

  const activeGoals = goals.filter(
    (goal) => goal.status === "ACTIVE"
  ).length;

  // --------------------------------------------------
  // GOAL-WISE PROGRESS
  // --------------------------------------------------

  const goalProgress = goals.map((goal) => {
    /*
     * A goal can have multiple learning paths.
     * Each learning path can contain multiple steps.
     *
     * We flatten all steps belonging to this goal.
     */

    const steps = goal.learningPaths.flatMap(
      (path) => path.steps
    );

    const totalResources = steps.length;

    const completedResources =
      steps.filter((step) => {
        const progress =
          step.resource.progress[0];

        return (
          progress &&
          progress.status === "COMPLETED"
        );
      }).length;

    const progress =
      totalResources === 0
        ? 0
        : Math.round(
            (completedResources /
              totalResources) *
              100
          );

    // --------------------------------------------------
    // FIND NEXT RESOURCE TO RESUME
    // --------------------------------------------------

    const nextStep = steps.find((step) => {
      const resourceProgress =
        step.resource.progress[0];

      return (
        !resourceProgress ||
        resourceProgress.status !==
          "COMPLETED"
      );
    });

    return {
      goalId: goal.id,
      title: goal.title,
      status: goal.status,
      progress,
      completedResources,
      totalResources,

      resume: nextStep
        ? {
            stepId: nextStep.id,
            resourceId:
              nextStep.resource.id,
            resourceTitle:
              nextStep.resource.title,
            resourceUrl:
              nextStep.resource.url,
          }
        : null,
    };
  });

  // --------------------------------------------------
  // QUIZ PERFORMANCE
  // --------------------------------------------------

  const quizAttemptsCount =
    quizAttempts.length;

  const quizPercentage =
    quizAttemptsCount === 0
      ? 0
      : Math.round(
          quizAttempts.reduce(
            (sum, attempt) =>
              sum + attempt.score,
            0
          ) / quizAttemptsCount
        );

  // --------------------------------------------------
  // FINAL DASHBOARD RESPONSE
  // --------------------------------------------------

  return {
    user: {
      name: user.name,
    },

    totalGoals,

    activeGoals,

    goalProgress,

    quizPercentage,
  };
};