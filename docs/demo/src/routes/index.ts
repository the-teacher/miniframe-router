import {
  root,
  get,
  post,
  routeScope as scope,
  getRouter,
  setRouterCotrollersPath,
} from "miniframe-router";

import { authenticate } from "../middlewares/auth";
import { validatePost } from "../middlewares/validation";

// Set the path to the controllers
setRouterCotrollersPath("src/controllers");

// Public routes
root("index#home");
get("/posts", "blog/posts#index");
get("/posts/:id", "blog/posts#show");

// Protected admin routes with authentication
scope(
  "admin",
  () => {
    get("/posts", "blog/posts#index");

    // Additional validation for create/update operations
    post("/posts", "blog/posts#create", {
      withMiddlewares: [validatePost],
    });

    post("/posts/:id", "blog/posts#update", {
      withMiddlewares: [validatePost],
    });

    post("/posts/:id/destroy", "blog/posts#destroy");
  },
  {
    withMiddlewares: [authenticate],
  }
);

export default getRouter;
