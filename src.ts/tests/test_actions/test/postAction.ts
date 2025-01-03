import { Request, Response } from "express";

export const perform = (req: Request, res: Response) => {
  return res.send("Hello Post!");
};
