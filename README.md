# `MiniframeJS/Router`

A simple yet powerful routing solution for `Express.js` applications that provides a clean and intuitive way to organize routes and actions.

## Features

- Simple route definition syntax (similar to Rails framework)
- Action-based approach (similar to Hanami framework)
- Each action in a separate file for better maintainability
- Scoped routes for better organization
- Automatic action loading

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
root("index#index");  // Will use src/actions/index/indexAction.ts

// Define GET and POST routes
get("/users", "users#show");    // Will use src/actions/users/showAction.ts
post("/users", "users#create"); // Will use src/actions/users/createAction.ts
```

### Action Files Structure

Each action is defined in its own file and **must export a `perform` function**:

```bash
src/
  actions/
    index/
      indexAction.ts    # handles root("index#index")
    users/
      showAction.ts     # handles get("/users", "users#show")
      createAction.ts   # handles post("/users", "users#create")
    admin/
      users/
        listAction.ts   # handles get("/users", "admin/users#list") in admin scope
```

Action file example:

```typescript
// src/actions/users/showAction.ts
import { Request, Response } from "express";

// perform is a required method for each action
export const perform = (req: Request, res: Response) => {
  res.json({ message: "List of users" });
};
```

### Структура файлов действий

Каждое действие определяется в своём собственном файле и **должно экспортировать функцию `perform`**:

```typescript
// src/actions/users/showAction.ts
import { Request, Response } from "express";

// perform - обязательный метод для каждого действия
export const perform = (req: Request, res: Response) => {
  res.json({ message: "Список пользователей" });
};
```

### Scoped Routes

Group related routes under a common prefix:

```ts
scope("admin", () => {
  get("/users", "admin/users#list");   // Will use src/actions/admin/users/listAction.ts
  post("/users", "admin/users#create"); // Will use src/actions/admin/users/createAction.ts
});
```

### Routes with Middleware

You can add middleware to any route:

```ts
import { get, post, routeScope as scope } from "miniframe-router";

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
scope("admin", () => {
    // These routes will require authentication
    get("/users", "users#index");
    post("/users", "users#create");

    // This route will require both authentication and validation
    post("/users/:id", "users#update", {
      withMiddlewares: [validateUser],
    });
  },
  { withMiddlewares: [authenticate] }
);

// Combine multiple middleware for scope
scope("api", () => {
    get("/stats", "stats#index");
    get("/health", "health#check");
  },
  { withMiddlewares: [authenticate, logRequest] }
);
```

Middleware specified in the scope options will be applied to all routes within that scope.
You can still add route-specific middleware that will be executed after the scope middleware.

Application files structure:

```bash
src/
  index.ts
  routes/
    index.ts
  actions/
    index/
      indexAction.ts
    users/
      showAction.ts
      createAction.ts
      updateAction.ts
    posts/
      showAction.ts
      createAction.ts
    admin/
      users/
        listAction.ts
        createAction.ts
      posts/
        listAction.ts
        updateAction.ts
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
app.use(getRoutes());

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

// Root route
root("index#index");  // -> src/actions/index/indexAction.ts

// Basic routes
get("/users", "users#show");      // -> src/actions/users/showAction.ts
post("/users", "users#create");   // -> src/actions/users/createAction.ts

// Scoped routes
scope("admin", () => {
  get("/users", "admin/users#list");    // -> src/actions/admin/users/listAction.ts
  post("/users", "admin/users#create");  // -> src/actions/admin/users/createAction.ts
});

export default getRouter;
```

This will create routes:
- GET `/` -> `src/actions/index/indexAction.ts`
- GET `/users` -> `src/actions/users/showAction.ts`
- POST `/users` -> `src/actions/users/createAction.ts`
- GET `/admin/users` -> `src/actions/admin/users/listAction.ts`
- POST `/admin/users` -> `src/actions/admin/users/createAction.ts`

## API Reference

- `root(controllerAction)`: Define root route (/)
- `get(path, controllerAction)`: Define GET route
- `post(path, controllerAction)`: Define POST route
- `routeScope(prefix, callback)`: Group routes under a common prefix

### License

MIT.

### Author

Ilya N. Zykin | [the-teacher](https://github.com/the-teacher)
