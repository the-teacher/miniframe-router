import {
  root,
  get,
  post,
  routeScope as scope,
  getRouter,
  setRouterCotrollersPath,
} from "miniframe-router";

// Set the path to the controllers
// default is "src/controllers"
setRouterCotrollersPath("src/controllers");

// Root routes
root("index#home");

// Basic CRUD routes
get("/users", "users#index");
get("/users/:id", "users#show");
post("/users", "users#create");
post("/users/:id", "users#update");
post("/users/:id/destroy", "users#destroy");

// Posts routes with scope
scope("blog", () => {
  get("/posts", "posts#index");
  get("/posts/:id", "posts#show");
  post("/posts", "posts#create");
  post("/posts/:id", "posts#update");
  post("/posts/:id/destroy", "posts#destroy");
});

export default getRouter;
