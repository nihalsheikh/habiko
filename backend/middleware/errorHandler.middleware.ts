import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";

// For routes that don't exist, this runs when no route matches the incoming request
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// All error land in this route
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  const status =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  const message = err instanceof Error ? err.message : "Server error";
  res.status(status).json({ message });
};
