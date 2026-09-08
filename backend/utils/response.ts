import type { Response } from "express";

export const handleControllerError = (
  res: Response,
  error: unknown,
  fallbackMessage = "Internal server error",
  statusCode = 500,
) => {
  const message = error instanceof Error ? error.message : fallbackMessage;
  console.error(`${message}:`, error);
  return res.status(statusCode).json({ message });
};
