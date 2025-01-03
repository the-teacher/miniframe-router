import { Request, Response } from "express";

export const perform = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  return res.json({ id, name, email, message: `User ${id} updated` });
};
