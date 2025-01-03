import { Request, Response } from "express";

export const perform = (req: Request, res: Response) => {
  return res.json({
    testData: (req as any).testData,
    message: "Protected resource accessed",
  });
};
