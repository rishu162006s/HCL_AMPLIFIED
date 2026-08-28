import prisma from "../config/prisma";
import { ExperienceLevel } from "../generated/prisma/client";
export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  technicalLevel: ExperienceLevel;
}) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      technicalLevel: data.technicalLevel,
    },
  });
};