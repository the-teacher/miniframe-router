import { Request, Response, NextFunction } from "express";

// Test middleware that adds data to request
export const addDataMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  (req as any).testData = "middleware data";
  next();
};

// Test middleware that checks authorization
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer valid-token") {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};
