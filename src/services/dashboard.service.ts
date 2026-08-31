
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
  // REMOVE DUPLICATE GOALS
  // --------------------------------------------------
  //
  // A user may already have duplicate goals in the
  // database from earlier testing.
  //
  // We keep the newest goal and ignore older goals
  // with the same normalized title.
  //
  // This does NOT delete anything from the database.
  // It only prevents duplicates from appearing
  // on the dashboard.
  // --------------------------------------------------

  const uniqueGoals = Array.from(
    new Map(
      goals.map((goal) => [
        goal.title.trim().toLowerCase(),
        goal,
      ])
    ).values()
  );

  // --------------------------------------------------
  // GOAL STATISTICS
  // --------------------------------------------------

  const totalGoals =
    uniqueGoals.length;

  const activeGoals =
    uniqueGoals.filter(
      (goal) =>
        goal.status === "ACTIVE"
    ).length;

  // --------------------------------------------------
  // GOAL-WISE PROGRESS
  // --------------------------------------------------

  const goalProgress =
    uniqueGoals.map((goal) => {

      // ------------------------------------------------
      // USE ONLY THE MOST RECENT LEARNING PATH
      // ------------------------------------------------

      const learningPath =
        goal.learningPaths?.[0];

      const steps =
        learningPath?.steps ?? [];

      const totalResources =
        steps.length;

      // ------------------------------------------------
      // COMPLETED RESOURCES
      // ------------------------------------------------

      const completedResources =
        steps.filter((step) => {

          const progress =
            step.resource.progress[0];

          return (
            progress &&
            progress.status ===
              "COMPLETED"
          );
        }).length;

      // ------------------------------------------------
      // CALCULATE PROGRESS
      // ------------------------------------------------

      const progress =
        totalResources === 0
          ? 0
          : Math.round(
              (completedResources /
                totalResources) *
                100
            );

      // ------------------------------------------------
      // FIND NEXT RESOURCE
      // ------------------------------------------------

      const nextStep =
        steps.find((step) => {

          const resourceProgress =
            step.resource.progress[0];

          return (
            !resourceProgress ||
            resourceProgress.status !==
              "COMPLETED"
          );
        });

      // ------------------------------------------------
      // RETURN GOAL DATA
      // ------------------------------------------------

      return {
        goalId: goal.id,

        title: goal.title,

        status: goal.status,

        progress,

        completedResources,

        totalResources,

        learningPathId: learningPath?.id ?? null,

        learningPathTitle: learningPath?.title ?? null,

        resume: nextStep
  ? {
      learningPathId:
        goal.learningPaths.find(
          (path) =>
            path.steps.some(
              (step) =>
                step.id === nextStep.id
            )
        )?.id ?? null,

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
          ) /
            quizAttemptsCount
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

