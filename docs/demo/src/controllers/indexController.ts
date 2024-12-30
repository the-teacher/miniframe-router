import { Request, Response } from "express";

export const home = (req: Request, res: Response) => {
  res.send("Welcome to the Demo App!");
};
