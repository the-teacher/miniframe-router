import { Request, Response } from "express";

export const perform = (req: Request, res: Response) => {
  const { id } = req.params;
  return res.json({ id, message: `Get user ${id}` });
};
