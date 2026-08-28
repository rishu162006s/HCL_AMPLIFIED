import { Request, Response } from "express";

import {
  createNewSkill,
  getAllSkills,
  getSkill,
  getMySkills,
  removeSkill,
  updateExistingSkill,
  updateMySkill,
} from "../services/skill.service";

import {
  createSkillSchema,
  updateSkillSchema,
  userSkillSchema,
} from "../validators/skill.validators";

import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const createSkillController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = createSkillSchema.parse(
      req.body
    );

    const skill = await createNewSkill(data);

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "SKILL_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        success: false,
        message: "Skill already exists",
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

export const getAllSkillsController = async (
  req: Request,
  res: Response
) => {
  try {
    const skills = await getAllSkills();

    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSkillController = async (
  req: Request,
  res: Response
) => {
  try {
    const skillId = req.params.skillId;

    if (!skillId) {
      res.status(400).json({
        success: false,
        message: "Skill ID is required",
      });
      return;
    }

    const skill = await getSkill(skillId as string);

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
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

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateSkillController = async (
  req: Request,
  res: Response
) => {
  try {
    const skillId = req.params.skillId;

    if (!skillId) {
      res.status(400).json({
        success: false,
        message: "Skill ID is required",
      });
      return;
    }

    const data = updateSkillSchema.parse(
      req.body
    );

    const skill = await updateExistingSkill(
      skillId as string,
      data
    );

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
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

export const deleteSkillController = async (
  req: Request,
  res: Response
) => {
  try {
    const skillId = req.params.skillId;

    if (!skillId) {
      res.status(400).json({
        success: false,
        message: "Skill ID is required",
      });
      return;
    }

    await removeSkill(skillId as string);

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
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

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMySkillsController = async (
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

    const skills = await getMySkills(userId);

    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateMySkillController = async (
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

    const data = userSkillSchema.parse(
      req.body
    );

    const skill = await updateMySkill({
      userId,
      skillId: data.skillId,
      level: data.level,
    });

    res.status(200).json({
      success: true,
      message: "Skill proficiency updated",
      data: skill,
    });
  } catch (error) {
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