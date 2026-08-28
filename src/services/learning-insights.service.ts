import {
  getLearningInsightsData,
} from "../repositories/learning-insights.repository";

export const getLearningInsights =
  async (userId: string) => {
    const data =
      await getLearningInsightsData(
        userId
      );

    const totalResources =
      data.progress.length;

    const completedResources =
      data.progress.filter(
        (item) =>
          item.progress === 100
      ).length;

    const completionRate =
      totalResources === 0
        ? 0
        : Number(
            (
              (completedResources /
                totalResources) *
              100
            ).toFixed(2)
          );

    const averageProgress =
      totalResources === 0
        ? 0
        : Number(
            (
              data.progress.reduce(
                (sum, item) =>
                  sum + item.progress,
                0
              ) / totalResources
            ).toFixed(2)
          );

    const averageQuizScore =
      data.quizAttempts.length === 0
        ? 0
        : Number(
            (
              data.quizAttempts.reduce(
                (sum, attempt) =>
                  sum + attempt.score,
                0
              ) /
                data.quizAttempts
                  .length
            ).toFixed(2)
          );

    let quizTrend = "NO_DATA";

    if (
      data.quizAttempts.length >= 2
    ) {
      const first =
        data.quizAttempts[0].score;

      const last =
        data.quizAttempts[
          data.quizAttempts.length - 1
        ].score;

      if (last > first) {
        quizTrend = "IMPROVING";
      } else if (last < first) {
        quizTrend = "DECLINING";
      } else {
        quizTrend = "STABLE";
      }
    }

    const strongestTopics =
      [...data.topicMasteries]
        .sort(
          (a, b) =>
            b.score - a.score
        )
        .slice(0, 5);

    const weakestTopics =
      [...data.topicMasteries]
        .sort(
          (a, b) =>
            a.score - b.score
        )
        .slice(0, 5);

    const activeGoals =
      data.goals.filter(
        (goal) =>
          goal.status === "ACTIVE"
      );

    return {
      completionRate,
      averageProgress,
      averageQuizScore,
      quizTrend,
      totalLearningActivities:
        data.learningHistory.length,
      totalQuizAttempts:
        data.quizAttempts.length,
      activeGoals:
        activeGoals.length,
      strongestTopics,
      weakestTopics,
    };
  };