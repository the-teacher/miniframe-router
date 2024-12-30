import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
  res.send("List of all blog posts");
};

export const show = (req: Request, res: Response) => {
  const { id } = req.params;
  res.send(`Showing blog post ${id}`);
};

export const create = (req: Request, res: Response) => {
  const postData = req.body;
  res.send(`Creating new blog post with data: ${JSON.stringify(postData)}`);
};

export const update = (req: Request, res: Response) => {
  const { id } = req.params;
  const postData = req.body;
  res.send(`Updating blog post ${id} with data: ${JSON.stringify(postData)}`);
};

export const destroy = (req: Request, res: Response) => {
  const { id } = req.params;
  res.send(`Deleting blog post ${id}`);
};
