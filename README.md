# `MiniframeJS/Router`

A simple yet powerful routing solution for `Express.js` applications that provides a clean and intuitive way to organize routes and controllers.

## Features

- Simple route definition syntax
- Controller-based actions
- Scoped routes for better organization
- Automatic controller loading

## Documentation

- Development: [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- Development (RU): [docs/DEVELOPMENT.ru.md](docs/DEVELOPMENT.ru.md)
- Demo app Skeleton: [docs/demo/README.md](docs/demo/README.md)

## Installation

```bash
npm install miniframe-router
```

```bash
yarn add miniframe-router
```

```bash
pnpm add miniframe-router
```

## Usage

### Basic Routes

`routes/index.ts`

```ts
import { root, get, post, getRouter } from "miniframe-router";

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

### Routes with Middleware

You can add middleware to any route:

```ts
import { authenticate } from "./middlewares/auth";
import { validateUser } from "./middlewares/validation";

// Single middleware
get("/users/:id", "users#show", {
  withMiddlewares: [authenticate],
});

// Multiple middleware in execution order
post("/users", "users#create", {
  withMiddlewares: [authenticate, validateUser],
});

// Middleware with scoped routes
scope("admin", () => {
  get("/users", "users#show", {
    withMiddlewares: [authenticate],
  });

  post("/users", "users#create", {
    withMiddlewares: [authenticate, validateUser],
  });
});
```

### Scoped Routes with Middleware

You can add middleware to both individual routes and entire scopes:

```ts
import { authenticate } from "./middlewares/auth";
import { validateUser } from "./middlewares/validation";
import { logRequest } from "./middlewares/logging";

// Apply middleware to all routes within scope
scope(
  "admin",
  () => {
    // These routes will require authentication
    get("/users", "users#index");
    post("/users", "users#create");

    // This route will require both authentication and validation
    post("/users/:id", "users#update", {
      withMiddlewares: [validateUser],
    });
  },
  {
    withMiddlewares: [authenticate],
  }
);

// Combine multiple middleware for scope
scope(
  "api",
  () => {
    get("/stats", "stats#index");
    get("/health", "health#check");
  },
  {
    withMiddlewares: [authenticate, logRequest],
  }
);
```

Middleware specified in the scope options will be applied to all routes within that scope.
You can still add route-specific middleware that will be executed after the scope middleware.

Application files structure:

```bash
src
  index.ts

  routes/
      index.ts
  controllers/
      indexController.ts
      usersController.ts
      postsController.ts
```

`index.ts`

```ts
import cors from "cors";
import cookieParser from "cookie-parser";
import getRoutes from "./routes";

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

`routes/index.ts`

```ts
import {
  root,
  get,
  post,
  getRouter,
  routeScope as scope,
} from "miniframe-router";

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

`controllers/usersController.ts`

```typescript
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

### License

MIT.

### Author

Ilya N. Zykin | [the-teacher](https://github.com/the-teacher)
