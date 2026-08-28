import {
  createSkill,
  createUserSkill,
  deleteSkill,
  findAllSkills,
  findSkillById,
  findSkillByName,
  findUserSkill,
  findUserSkills,
  updateSkill,
  updateUserSkill,
} from "../repositories/skill.repository";

export const createNewSkill = async (data: {
  name: string;
  description?: string;
}) => {
  const existing = await findSkillByName(
    data.name.trim()
  );

  if (existing) {
    throw new Error("SKILL_ALREADY_EXISTS");
  }

  return createSkill({
    name: data.name.trim(),
    description: data.description?.trim(),
  });
};

export const getAllSkills = async () => {
  return findAllSkills();
};

export const getSkill = async (id: string) => {
  const skill = await findSkillById(id);

  if (!skill) {
    throw new Error("SKILL_NOT_FOUND");
  }

  return skill;
};

export const updateExistingSkill = async (
  id: string,
  data: {
    name?: string;
    description?: string | null;
  }
) => {
  const skill = await findSkillById(id);

  if (!skill) {
    throw new Error("SKILL_NOT_FOUND");
  }

  return updateSkill(id, {
    name: data.name?.trim(),
    description: data.description?.trim(),
  });
};

export const removeSkill = async (id: string) => {
  const skill = await findSkillById(id);

  if (!skill) {
    throw new Error("SKILL_NOT_FOUND");
  }

  await deleteSkill(id);
};

export const getMySkills = async (
  userId: string
) => {
  return findUserSkills(userId);
};

export const updateMySkill = async (data: {
  userId: string;
  skillId: string;
  level:
    | "NONE"
    | "BASIC"
    | "INTERMEDIATE"
    | "EXPERT";
}) => {
  const skill = await findSkillById(data.skillId);

  if (!skill) {
    throw new Error("SKILL_NOT_FOUND");
  }

  const existing = await findUserSkill(
    data.userId,
    data.skillId
  );

  if (existing) {
    return updateUserSkill(
      data.userId,
      data.skillId,
      data.level
    );
  }

  return createUserSkill(data);
};