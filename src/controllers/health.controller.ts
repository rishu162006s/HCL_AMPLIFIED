import { Request, Response } from "express";
import prisma from "../config/prisma";

export const healthCheck = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "Server and database are healthy",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
      database: "disconnected",
    });
  }
};