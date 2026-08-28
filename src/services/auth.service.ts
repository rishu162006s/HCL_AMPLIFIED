import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../repositories/user.repository";

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }
const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
  },
  process.env.JWT_SECRET as string,
  {
    expiresIn: "7d",
  }
);


  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      technicalLevel: user.technicalLevel,
    },
  };
};