import { Request, Response } from "express";

export const showAction = (req: Request, res: Response) => {
  return res.send("Admin Show!");
};

export const updateAction = (req: Request, res: Response) => {
  return res.send("Admin Update!");
};
