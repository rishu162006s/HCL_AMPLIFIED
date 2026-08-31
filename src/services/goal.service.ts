import {
  createGoal,
  createGoalSkill,
  deleteGoal,
  deleteGoalSkill,
  findGoalById,
  findGoalSkill,
  findUserGoals,
  updateGoal,
  updateGoalSkill,
} from "../repositories/goal.repository";

import { findSkillById } from "../repositories/skill.repository";

type GoalWithPaths = NonNullable<
  Awaited<ReturnType<typeof findGoalById>>
>;

const serializeGoal = (goal: GoalWithPaths) => {
  const learningPath = goal.learningPaths[0] ?? null;
  const steps = learningPath?.steps ?? [];
  const totalResources = steps.length;

  const completedResources = steps.filter((step) => {
    const records = Array.isArray(step.resource.progress)
      ? step.resource.progress
      : [];
    return records[0]?.status === "COMPLETED";
  }).length;

  const progress =
    totalResources === 0
      ? 0
      : Math.round((completedResources / totalResources) * 100);

  const nextStep = steps.find((step) => {
    const records = Array.isArray(step.resource.progress)
      ? step.resource.progress
      : [];
    return records[0]?.status !== "COMPLETED";
  });

  return {
    ...goal,
    skills: goal.requiredSkills,
    learningPath,
    progress,
    completedResources,
    totalResources,
    resume: nextStep
      ? {
          learningPathId: learningPath?.id ?? null,
          stepId: nextStep.id,
          resourceId: nextStep.resource.id,
          resourceTitle: nextStep.resource.title,
          resourceUrl: nextStep.resource.url,
        }
      : null,
  };
};

export const createNewGoal = async (data: {
  title: string;
  description?: string;
  objective:
    | "PERSONAL"
    | "CAREER"
    | "ACADEMIC"
    | "INTERVIEW"
    | "PROJECT";
  targetDate?: Date;
  weeklyHours?: number;
  preferredResourceTypes?:
    | (
        | "COURSE"
        | "PROJECT"
        | "ARTICLE"
        | "VIDEO"
        | "BOOK"
        | "ASSESSMENT"
      )
    | (
        | "COURSE"
        | "PROJECT"
        | "ARTICLE"
        | "VIDEO"
        | "BOOK"
        | "ASSESSMENT"
      )[];
  theoryPracticeRatio?:
    | "MORE_THEORY"
    | "BALANCED"
    | "MORE_PRACTICE";
  userId: string;
}) => {
  return createGoal(data);
};

export const getMyGoals = async (
  userId: string
) => {
  const goals = await findUserGoals(userId);
  return goals.map(serializeGoal);
};

export const getGoal = async (
  goalId: string,
  userId: string
) => {
  const goal = await findGoalById(goalId, userId);

  if (!goal) {
    throw new Error("GOAL_NOT_FOUND");
  }

  if (goal.userId !== userId) {
    throw new Error("FORBIDDEN");
  }

  return serializeGoal(goal);
};

export const updateExistingGoal = async (
  goalId: string,
  userId: string,
  data: {
    title?: string;
    description?: string | null;
    status?:
      | "ACTIVE"
      | "COMPLETED"
      | "PAUSED";
    objective?:
      | "PERSONAL"
      | "CAREER"
      | "ACADEMIC"
      | "INTERVIEW"
      | "PROJECT";
    targetDate?: Date | null;
    weeklyHours?: number | null;
    preferredResourceTypes?:
      | (
          | "COURSE"
          | "PROJECT"
          | "ARTICLE"
          | "VIDEO"
          | "BOOK"
          | "ASSESSMENT"
        )
      | (
          | "COURSE"
          | "PROJECT"
          | "ARTICLE"
          | "VIDEO"
          | "BOOK"
          | "ASSESSMENT"
        )[];
    theoryPracticeRatio?:
      | "MORE_THEORY"
      | "BALANCED"
      | "MORE_PRACTICE"
      | null;
  }
) => {
  const goal = await findGoalById(goalId);

  if (!goal) {
    throw new Error("GOAL_NOT_FOUND");
  }

  if (goal.userId !== userId) {
    throw new Error("FORBIDDEN");
  }

  return updateGoal(goalId, data);
};

export const removeGoal = async (
  goalId: string,
  userId: string
) => {
  const goal = await findGoalById(goalId);

  if (!goal) {
    throw new Error("GOAL_NOT_FOUND");
  }

  if (goal.userId !== userId) {
    throw new Error("FORBIDDEN");
  }

  await deleteGoal(goalId);
};

export const addSkillToGoal = async (data: {
  goalId: string;
  userId: string;
  skillId: string;
  currentLevel:
    | "NONE"
    | "BASIC"
    | "INTERMEDIATE"
    | "EXPERT";
  targetLevel:
    | "NONE"
    | "BASIC"
    | "INTERMEDIATE"
    | "EXPERT";
}) => {
  const goal = await findGoalById(data.goalId);

  if (!goal) {
    throw new Error("GOAL_NOT_FOUND");
  }

  if (goal.userId !== data.userId) {
    throw new Error("FORBIDDEN");
  }

  const skill = await findSkillById(data.skillId);

  if (!skill) {
    throw new Error("SKILL_NOT_FOUND");
  }

  const existing = await findGoalSkill(
    data.goalId,
    data.skillId
  );

  if (existing) {
    throw new Error(
      "SKILL_ALREADY_REQUIRED_BY_GOAL"
    );
  }

  return createGoalSkill({
    goalId: data.goalId,
    skillId: data.skillId,
    currentLevel: data.currentLevel,
    targetLevel: data.targetLevel,
  });
};

export const updateGoalRequiredSkill =
  async (data: {
    goalId: string;
    userId: string;
    skillId: string;
    currentLevel?:
      | "NONE"
      | "BASIC"
      | "INTERMEDIATE"
      | "EXPERT";
    targetLevel?:
      | "NONE"
      | "BASIC"
      | "INTERMEDIATE"
      | "EXPERT";
  }) => {
    const goal = await findGoalById(data.goalId);

    if (!goal) {
      throw new Error("GOAL_NOT_FOUND");
    }

    if (goal.userId !== data.userId) {
      throw new Error("FORBIDDEN");
    }

    const existing = await findGoalSkill(
      data.goalId,
      data.skillId
    );

    if (!existing) {
      throw new Error("GOAL_SKILL_NOT_FOUND");
    }

    return updateGoalSkill(
      data.goalId,
      data.skillId,
      {
        currentLevel: data.currentLevel,
        targetLevel: data.targetLevel,
      }
    );
  };

export const removeSkillFromGoal =
  async (
    goalId: string,
    userId: string,
    skillId: string
  ) => {
    const goal = await findGoalById(goalId);

    if (!goal) {
      throw new Error("GOAL_NOT_FOUND");
    }

    if (goal.userId !== userId) {
      throw new Error("FORBIDDEN");
    }

    const existing = await findGoalSkill(
      goalId,
      skillId
    );

    if (!existing) {
      throw new Error("GOAL_SKILL_NOT_FOUND");
    }

    await deleteGoalSkill(goalId, skillId);
  };