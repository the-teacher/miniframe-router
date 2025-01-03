import { Request, Response } from "express";

export const perform = (req: Request, res: Response) => {
  const userData = req.body;
  res.json({ message: "User created", data: userData });
};
