# `MiniframeJS/Router`

A simple yet powerful routing solution for `Express.js` applications that provides a clean and intuitive way to organize routes and controllers.

## Features

- Simple route definition syntax
- Controller-based actions
- Scoped routes for better organization
- Automatic controller loading

## Usage

### Basic Routes

`routes/index.ts`

```ts
import { root, get, post, getRouter } from "@framework-core/routes";

// Define root route
root("index#index");

// Define GET and POST routes
get("/users", "users#show");
post("/users", "users#update");

// Define GET and POST routes
get("/posts", "posts#show");
post("/posts", "posts#update");

export default getRouter;
```

Application files structure:

```bash
src
  index.ts

  framework/
    routes/
        index.ts
    controllers/
        indexController.ts
        usersController.ts
        postsController.ts
```

```ts
import cors from "cors";
import cookieParser from "cookie-parser";
import getRoutes from "./framework/routes";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(getRoutes()); // <<< USE ROUTES

app.listen(4000, () => {
  console.log(`Server is running on port: 4000`);
});
```

### Scoped Routes

Group related routes under a common prefix:

```ts
import {
  root,
  get,
  post,
  getRouter,
  routeScope as scope,
} from "@framework-core/routes";

scope("admin", () => {
  get("/users", "users#show");
  post("/users", "users#update");

  get("/posts", "posts#show");
  post("/posts", "posts#update");
});

export default getRouter;
```

This will create routes:

- GET `/admin/users` -> `controllers/admin/usersController.ts` (`show` action)
- POST `/admin/users` -> `controllers/admin/usersController.ts` (`update` action)
- GET `/admin/posts` -> `controllers/admin/postsController.ts` (`show` action)
- POST `/admin/posts` -> `controllers/admin/postsController.ts` (`update` action)

### Controllers Structure

Controllers should be placed in the `controllers` directory. For scoped routes, controllers are automatically looked up in the corresponding subdirectory.

```bash
src
  index.ts

  framework/
    routes/
        index.ts
    controllers/
        indexController.ts
        usersController.ts
        postsController.ts

        admin/
            usersController.ts
            postsController.ts
```

Example controller:

```typescript
// controllers/usersController.ts
import { Request, Response } from "express";

export const show = (req: Request, res: Response) => {
  res.send("Users list");
};

export const update = (req: Request, res: Response) => {
  res.send("User updated");
};
```

## API Reference

- `root(controllerAction)`: Define root route (/)
- `get(path, controllerAction)`: Define GET route
- `post(path, controllerAction)`: Define POST route
- `routeScope(prefix, callback)`: Group routes under a common prefix
