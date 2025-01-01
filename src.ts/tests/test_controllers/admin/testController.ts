import { Request, Response } from "express";

export const middlewareAction = (req: Request, res: Response) => {
  return res.json({ testData: (req as any).testData });
};

export const postAction = (req: Request, res: Response) => {
  return res.send("Hello Post!");
};
