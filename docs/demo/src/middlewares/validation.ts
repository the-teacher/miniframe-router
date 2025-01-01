import { Request, Response, NextFunction } from "express";

export const validatePost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  if (title.length < 3) {
    return res
      .status(400)
      .json({ error: "Title must be at least 3 characters long" });
  }

  next();
};
