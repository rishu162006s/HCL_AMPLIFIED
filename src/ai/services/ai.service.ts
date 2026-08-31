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

import {
  findGoalById,
  findGoalSkill,
  createGoalSkill,
} from "../../repositories/goal.repository";

import {
  findSkillByNameInsensitive,
  createSkill,
} from "../../repositories/skill.repository";

// Maps the AI's stated proficiency for the goal onto the
// ProficiencyLevel enum used by GoalSkill.currentLevel/targetLevel.
const mapProficiencyToGoalSkillLevel = (
  proficiencyLevel: string
): "NONE" | "BASIC" | "INTERMEDIATE" | "EXPERT" => {
  switch (proficiencyLevel?.trim().toUpperCase()) {
    case "BEGINNER":
      return "BASIC";

    case "INTERMEDIATE":
      return "INTERMEDIATE";

    case "ADVANCED":
      return "EXPERT";

    default:
      return "NONE";
  }
};

export const analyzeGoal = async (
  goal: string,
  options?: {
    goalId?: string;
    userId?: string;
  }
) => {
  if (!goal || goal.trim().length < 5) {
    throw new Error("GOAL_TEXT_TOO_SHORT");
  }

  let analysis: any = null;

  try {
    analysis = await analyzeGoalWithAI(goal.trim());
  } catch (err) {
    console.warn("AI Goal Analysis call failed, using fallback matcher:", err);
  }

  // ---------------------------------------------------
  // Fallback keyword matching if LLM returns empty/invalid skill
  // ---------------------------------------------------
  if (!analysis || !analysis.skill) {
    const text = goal.toLowerCase();
    let detectedSkill = "Python"; // default fallback

    if (
      text.includes("deep learning") ||
      text.includes("neural") ||
      text.includes("cnn") ||
      text.includes("rnn") ||
      text.includes("transformer") ||
      text.includes("pytorch")
    ) {
      detectedSkill = "Deep Learning";
    } else if (
      text.includes("machine learning") ||
      text.includes("ml") ||
      text.includes("model") ||
      text.includes("scikit")
    ) {
      detectedSkill = "Machine Learning";
    } else if (
      text.includes("sql") ||
      text.includes("database") ||
      text.includes("query") ||
      text.includes("postgres")
    ) {
      detectedSkill = "SQL";
    } else if (
      text.includes("java") ||
      text.includes("spring")
    ) {
      detectedSkill = "Java";
    } else if (
      text.includes("python") ||
      text.includes("pandas") ||
      text.includes("numpy")
    ) {
      detectedSkill = "Python";
    } else if (
      text.includes("algorithm") ||
      text.includes("sorting") ||
      text.includes("search")
    ) {
      detectedSkill = "Algorithms";
    } else if (
      text.includes("data structure") ||
      text.includes("tree") ||
      text.includes("graph") ||
      text.includes("stack")
    ) {
      detectedSkill = "Data Structures";
    } else if (
      text.includes("front") ||
      text.includes("html") ||
      text.includes("css") ||
      text.includes("javascript")
    ) {
      detectedSkill = "Frontend Development";
    } else if (
      text.includes("back") ||
      text.includes("node") ||
      text.includes("express") ||
      text.includes("api")
    ) {
      detectedSkill = "Backend Development";
    }

    analysis = {
      skill: detectedSkill,
      proficiencyLevel: "BEGINNER",
      durationDays: 30,
      hasDeadline: false,
      objective: "CAREER",
      intendedOutcome: `Master ${detectedSkill}`,
      constraints: [],
      normalizedGoal: goal.trim(),
      confidence: 0.9,
    };
  }

  // ---------------------------------------------------
  // If a goalId is supplied, persist the analysis as a
  // real GoalSkill record so the learning-path generator
  // (which requires GoalSkill rows) can actually run.
  // ---------------------------------------------------

  if (!options?.goalId || !options?.userId) {
    return { analysis, goalSkill: null };
  }

  const goal_ = await findGoalById(options.goalId);

  if (!goal_) {
    throw new Error("GOAL_NOT_FOUND");
  }

  if (goal_.userId !== options.userId) {
    throw new Error("FORBIDDEN");
  }

  const skillName = analysis.skill.trim();
  let skill = await findSkillByNameInsensitive(skillName);

  if (!skill) {
    skill = await createSkill({ name: skillName });
  }

  const currentLevel = mapProficiencyToGoalSkillLevel(
    analysis.proficiencyLevel
  );

  const existingGoalSkill = await findGoalSkill(
    options.goalId,
    skill.id
  );

  const goalSkill =
    existingGoalSkill ??
    (await createGoalSkill({
      goalId: options.goalId,
      skillId: skill.id,
      currentLevel,
      targetLevel: "EXPERT",
    }));

  return { analysis, goalSkill };
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