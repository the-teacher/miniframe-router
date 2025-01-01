import {
  root,
  get,
  post,
  routeScope as scope,
  getRouter,
  setRouterCotrollersPath,
} from "miniframe-router";

import { authenticate } from "../middlewares/auth";

// Set the path to the controllers
setRouterCotrollersPath("src/controllers");

// Public routes
root("index#home");
get("/posts", "blog/posts#index");
get("/posts/:id", "blog/posts#show");

// Protected routes with middleware
scope("admin", () => {
  get("/posts", "blog/posts#index", {
    withMiddlewares: [authenticate],
  });

  post("/posts", "blog/posts#create", {
    withMiddlewares: [authenticate],
  });

  post("/posts/:id", "blog/posts#update", {
    withMiddlewares: [authenticate],
  });

  post("/posts/:id/destroy", "blog/posts#destroy", {
    withMiddlewares: [authenticate],
  });
});

export default getRouter;
