import {
  analyzeGoalWithAI,
} from "../chains/goal-analysis.chain";

import {
  generateLearningPathWithAI,
} from "../chains/learning-path.chain";

import {
  generateRecommendationsWithAI,
} from "../chains/recommendation.chain";

import {
  generateInsightsWithAI,
} from "../chains/insights.chain";

import {
  generateQuizWithAI,
} from "../chains/quiz-generation.chain";

import {
  explainConceptWithAI,
} from "../chains/explanation.chain";

export const analyzeGoal = async (
  goal: string
) => {
  if (!goal || goal.trim().length < 5) {
    throw new Error("GOAL_TEXT_TOO_SHORT");
  }

  return analyzeGoalWithAI(goal.trim());
};

export const generateLearningPath = async (
  data: {
    goal: string;
    skill: string;
    currentLevel: string;
    targetLevel: string;
    durationDays: number | null;
    objective: string;
    constraints: string[];
  }
) => {
  return generateLearningPathWithAI(data);
};

export const generateRecommendations = async (
  data: {
    goal: string;
    skill: string;
    currentLevel: string;
    weakTopics: string[];
    completedTopics: string[];
    recentProgress: string;
    availableTime: string;
  }
) => {
  return generateRecommendationsWithAI(data);
};

export const generateInsights = async (
  data: {
    goal: string;
    learningHistory: string;
    progress: string;
    masteries: string;
    quizPerformance: string;
    streak: string;
  }
) => {
  return generateInsightsWithAI(data);
};

export const generateQuiz = async (
  data: {
    topic: string;
    description: string;
    difficulty: string;
    questionCount: number;
  }
) => {
  if (
    data.questionCount < 1 ||
    data.questionCount > 20
  ) {
    throw new Error(
      "QUESTION_COUNT_MUST_BE_BETWEEN_1_AND_20"
    );
  }

  return generateQuizWithAI(data);
};

export const explainConcept = async (
  data: {
    concept: string;
    level: string;
    context: string;
  }
) => {
  return explainConceptWithAI(data);
};