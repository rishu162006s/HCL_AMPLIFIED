import prisma from "../config/prisma";

export const findSkillById = async (id: string) => {
  return prisma.skill.findUnique({
    where: {
      id,
    },
  });
};

export const findSkillByName = async (name: string) => {
  return prisma.skill.findUnique({
    where: {
      name,
    },
  });
};

export const findAllSkills = async () => {
  return prisma.skill.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const createSkill = async (data: {
  name: string;
  description?: string;
}) => {
  return prisma.skill.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });
};

export const updateSkill = async (
  id: string,
  data: {
    name?: string;
    description?: string | null;
  }
) => {
  return prisma.skill.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteSkill = async (id: string) => {
  return prisma.skill.delete({
    where: {
      id,
    },
  });
};

export const findUserSkill = async (
  userId: string,
  skillId: string
) => {
  return prisma.userSkill.findUnique({
    where: {
      userId_skillId: {
        userId,
        skillId,
      },
    },
    include: {
      skill: true,
    },
  });
};

export const findUserSkills = async (userId: string) => {
  return prisma.userSkill.findMany({
    where: {
      userId,
    },
    include: {
      skill: true,
    },
    orderBy: {
      skill: {
        name: "asc",
      },
    },
  });
};

export const createUserSkill = async (data: {
  userId: string;
  skillId: string;
  level:
    | "NONE"
    | "BASIC"
    | "INTERMEDIATE"
    | "EXPERT";
}) => {
  return prisma.userSkill.create({
    data: {
      userId: data.userId,
      skillId: data.skillId,
      level: data.level,
    },
    include: {
      skill: true,
    },
  });
};

export const updateUserSkill = async (
  userId: string,
  skillId: string,
  level:
    | "NONE"
    | "BASIC"
    | "INTERMEDIATE"
    | "EXPERT"
) => {
  return prisma.userSkill.update({
    where: {
      userId_skillId: {
        userId,
        skillId,
      },
    },
    data: {
      level,
    },
    include: {
      skill: true,
    },
  });
};

export const deleteUserSkill = async (
  userId: string,
  skillId: string
) => {
  return prisma.userSkill.delete({
    where: {
      userId_skillId: {
        userId,
        skillId,
      },
    },
  });
};