import { Request, Response } from "express";

import { registerUser } from "../services/user.service";
import { loginUser } from "../services/auth.service";
import { loginUserSchema } from "../validators/auth.validator";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const registerUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "USER_ALREADY_EXISTS"
    ) {
      res.status(409).json({
        success: false,
        message: "A user with this email already exists",
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

export const loginUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = loginUserSchema.parse(req.body);

    const result = await loginUser(
      data.email,
      data.password
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
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

export const getCurrentUserController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  res.status(200).json({
    success: true,
    data: {
      userId: req.user?.userId,
      email: req.user?.email,
    },
  });
};