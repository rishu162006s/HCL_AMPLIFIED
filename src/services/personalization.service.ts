import {
  getPersonalizationData,
} from "../repositories/personalization.repository";

export const getPersonalization =
  async (userId: string) => {
    const data =
      await getPersonalizationData(
        userId
      );

    if (!data.user) {
      throw new Error(
        "USER_NOT_FOUND"
      );
    }

    const weakTopics =
      data.masteries
        .filter(
          (topic) =>
            topic.score < 50
        )
        .sort(
          (a, b) =>
            a.score - b.score
        );

    const strongTopics =
      data.masteries
        .filter(
          (topic) =>
            topic.score >= 80
        )
        .sort(
          (a, b) =>
            b.score - a.score
        );

    const averageQuizScore =
      data.quizAttempts.length === 0
        ? 0
        : data.quizAttempts.reduce(
            (sum, attempt) =>
              sum + attempt.score,
            0
          ) /
          data.quizAttempts.length;

    let recommendedDifficulty =
      data.user.technicalLevel;

    if (averageQuizScore >= 80) {
      recommendedDifficulty =
        "ADVANCED";
    } else if (
      averageQuizScore < 40
    ) {
      recommendedDifficulty =
        "BEGINNER";
    }

    const practiceGoal =
      data.goals.find(
        (goal) =>
          goal.theoryPracticeRatio ===
          "MORE_PRACTICE"
      );

    const averageProgress =
      data.progress.length === 0
        ? 0
        : data.progress.reduce(
            (sum, item) =>
              sum + item.progress,
            0
          ) / data.progress.length;

    return {
      learningLevel:
        data.user.technicalLevel,

      recommendedDifficulty,

      averageQuizScore:
        Number(
          averageQuizScore.toFixed(2)
        ),

      averageProgress:
        Number(
          averageProgress.toFixed(2)
        ),

      weakTopics,

      strongTopics,

      focusTopics:
        weakTopics.slice(0, 5),

      preferredLearningMode:
        practiceGoal
          ? "MORE_PRACTICE"
          : "BALANCED",

      activeGoals: data.goals,

      skills: data.skills,
    };
  };