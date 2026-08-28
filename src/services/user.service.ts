import bcrypt from "bcrypt";

import {
  createUser,
  findUserByEmail,
} from "../repositories/user.repository";

import {
  registerUserSchema,
} from "../validators/user.validators";

export const registerUser = async (input: unknown) => {
  const data = registerUserSchema.parse(input);

  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    10
  );

  const user = await createUser({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    technicalLevel: data.technicalLevel,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    technicalLevel: user.technicalLevel,
    createdAt: user.createdAt,
  };
};