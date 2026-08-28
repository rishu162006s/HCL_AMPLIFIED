import { Request, Response } from "express";

import {
  addSkillToGoal,
  createNewGoal,
  getGoal,
  getMyGoals,
  removeGoal,
  removeSkillFromGoal,
  updateExistingGoal,
  updateGoalRequiredSkill,
} from "../services/goal.service";

import {
  createGoalSchema,
  goalSkillSchema,
  updateGoalSchema,
} from "../validators/goal.validator";

import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const createGoalController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const data = createGoalSchema.parse(
      req.body
    );

    const goal = await createNewGoal({
      ...data,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      data: goal,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMyGoalsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const goals = await getMyGoals(userId);

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getGoalController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const goalId = req.params.goalId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!goalId) {
      res.status(400).json({
        success: false,
        message: "Goal ID is required",
      });
      return;
    }

    const goal = await getGoal(
      goalId as string,
      userId
    );

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "GOAL_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Goal not found",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      res.status(403).json({
        success: false,
        message: "You do not have access to this goal",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateGoalController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const goalId = req.params.goalId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!goalId) {
      res.status(400).json({
        success: false,
        message: "Goal ID is required",
      });
      return;
    }

    const data = updateGoalSchema.parse(
      req.body
    );

    const goal = await updateExistingGoal(
      goalId as string,
      userId,
      data
    );

    res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      data: goal,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "GOAL_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Goal not found",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      res.status(403).json({
        success: false,
        message: "You do not have access to this goal",
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteGoalController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const goalId = req.params.goalId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!goalId) {
      res.status(400).json({
        success: false,
        message: "Goal ID is required",
      });
      return;
    }

    await removeGoal(goalId as string, userId);

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "GOAL_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Goal not found",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      res.status(403).json({
        success: false,
        message: "You do not have access to this goal",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addGoalSkillController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;
    const goalId = req.params.goalId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    if (!goalId) {
      res.status(400).json({
        success: false,
        message: "Goal ID is required",
      });
      return;
    }

    const data = goalSkillSchema.parse(
      req.body
    );

    const goalSkill = await addSkillToGoal({
      goalId: goalId as string,
      userId,
      skillId: data.skillId,
      currentLevel: data.currentLevel,
      targetLevel: data.targetLevel,
    });

    res.status(201).json({
      success: true,
      message: "Skill added to goal",
      data: goalSkill,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "GOAL_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Goal not found",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "SKILL_NOT_FOUND"
    ) {
      res.status(404).json({
        success: false,
        message: "Skill not found",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      res.status(403).json({
        success: false,
        message: "You do not have access to this goal",
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        "SKILL_ALREADY_REQUIRED_BY_GOAL"
    ) {
      res.status(409).json({
        success: false,
        message: "Skill is already required by this goal",
      });
      return;
    }

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateGoalSkillController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user?.userId;
      const goalId = req.params.goalId;
      const skillId = req.params.skillId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      if (!goalId || !skillId) {
        res.status(400).json({
          success: false,
          message:
            "Goal ID and skill ID are required",
        });
        return;
      }

      const data = goalSkillSchema.partial().parse(
        req.body
      );

      const result =
        await updateGoalRequiredSkill({
          goalId: goalId as string,
          userId,
          skillId: skillId as string,
          currentLevel: data.currentLevel,
          targetLevel: data.targetLevel,
        });

      res.status(200).json({
        success: true,
        message: "Goal skill updated",
        data: result,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "GOAL_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Goal not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message === "GOAL_SKILL_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Goal skill not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message === "FORBIDDEN"
      ) {
        res.status(403).json({
          success: false,
          message: "You do not have access to this goal",
        });
        return;
      }

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

export const deleteGoalSkillController =
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const userId = req.user?.userId;
      const goalId = req.params.goalId;
      const skillId = req.params.skillId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      if (!goalId || !skillId) {
        res.status(400).json({
          success: false,
          message:
            "Goal ID and skill ID are required",
        });
        return;
      }

      await removeSkillFromGoal(
        goalId as string,
        userId,
        skillId as string
      );

      res.status(200).json({
        success: true,
        message: "Skill removed from goal",
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "GOAL_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Goal not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message === "GOAL_SKILL_NOT_FOUND"
      ) {
        res.status(404).json({
          success: false,
          message: "Goal skill not found",
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message === "FORBIDDEN"
      ) {
        res.status(403).json({
          success: false,
          message: "You do not have access to this goal",
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };