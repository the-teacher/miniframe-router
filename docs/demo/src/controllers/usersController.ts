import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
  res.send("List of all users");
};

export const show = (req: Request, res: Response) => {
  const { id } = req.params;
  res.send(`Showing details for user ${id}`);
};

export const create = (req: Request, res: Response) => {
  const userData = req.body;
  res.send(`Creating new user with data: ${JSON.stringify(userData)}`);
};

export const update = (req: Request, res: Response) => {
  const { id } = req.params;
  const userData = req.body;
  res.send(`Updating user ${id} with data: ${JSON.stringify(userData)}`);
};

export const destroy = (req: Request, res: Response) => {
  const { id } = req.params;
  res.send(`Deleting user ${id}`);
};
