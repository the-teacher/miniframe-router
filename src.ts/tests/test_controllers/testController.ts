import { Request, Response } from "express";

export const indexAction = (req: Request, res: Response) => {
  return res.send("Hello Index!");
};

export const getAction = (req: Request, res: Response) => {
  return res.send("Hello Get!");
};

export const postAction = (req: Request, res: Response) => {
  return res.send("Hello Post!");
};

export const getUserAction = (req: Request, res: Response) => {
  const { id } = req.params;
  return res.json({ id, message: `Get user ${id}` });
};

export const updateUserAction = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;
  return res.json({ id, name, email, message: `User ${id} updated` });
};

export const middlewareAction = (req: Request, res: Response) => {
  return res.json({ testData: (req as any).testData });
};

export const protectedAction = (req: Request, res: Response) => {
  return res.json({
    testData: (req as any).testData,
    message: "Protected resource accessed",
  });
};
