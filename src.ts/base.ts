import { Router } from "express";

let globalRouter: Router | null = null;
let currentScope: string | null = null;
let controllersPath: string = "../controllers";

export const getRouter = () => {
  if (!globalRouter) {
    globalRouter = Router();
  }

  return globalRouter;
};

export const resetRouter = () => {
  globalRouter = null;
  currentScope = null;
  controllersPath = "../controllers";
};

export const setRouterCotrollersPath = (path: string) =>
  (controllersPath = path);

export const getRouterCotrollersPath = () => controllersPath;

// Store current routing scope
export const setRouterScope = (scope: string | null) => {
  currentScope = scope;
};

// Get current routing scope
export const getRouterScope = () => currentScope;

export const routeScope = (
  scope: string,
  routesDefinitionCallback: () => void
) => {
  const router = Router();
  const originalRouter = globalRouter;

  // Temporarily replace global router with a new one
  globalRouter = router;

  // Set current scope
  setRouterScope(scope);

  // Execute callback that will add routes to the new router
  routesDefinitionCallback();

  // Restore original router and reset scope
  globalRouter = originalRouter;
  setRouterScope(null);

  // Mount scoped router to the main router with scope prefix
  getRouter().use(`/${scope}`, router);
};
