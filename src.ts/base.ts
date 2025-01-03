import { Router, RequestHandler } from "express";

const DEFAULT_ACTIONS_PATH = "src/actions";

let globalRouter: Router | null = null;
let currentScope: string | null = null;
let scopeMiddlewares: RequestHandler[] = [];
let actionsPath: string = DEFAULT_ACTIONS_PATH;

export const getRouter = () => {
  if (!globalRouter) {
    globalRouter = Router();
  }

  return globalRouter;
};

export const resetRouter = () => {
  globalRouter = null;
  currentScope = null;
  scopeMiddlewares = [];
  actionsPath = DEFAULT_ACTIONS_PATH;
};

export const setActionsPath = (path: string) => (actionsPath = path);

export const getActionsPath = () => actionsPath;

// Store current routing scope
export const setRouterScope = (scope: string | null) => {
  currentScope = scope;
};

// Get current routing scope
export const getRouterScope = () => currentScope;

// Get current scope middlewares
export const getScopeMiddlewares = () => scopeMiddlewares;

// Set scope middlewares
export const setScopeMiddlewares = (middlewares: RequestHandler[]) => {
  scopeMiddlewares = middlewares;
};

type ScopeOptions = {
  withMiddlewares?: RequestHandler[];
};

export const routeScope = (
  scope: string,
  routesDefinitionCallback: () => void,
  options: ScopeOptions = {}
) => {
  const router = Router();
  const originalRouter = globalRouter;
  const originalScopeMiddlewares = scopeMiddlewares;

  // Temporarily replace global router with a new one
  globalRouter = router;

  // Set current scope and its middlewares
  setRouterScope(scope);
  setScopeMiddlewares(options.withMiddlewares || []);

  // Execute callback that will add routes to the new router
  routesDefinitionCallback();

  // Restore original router, scope and middlewares
  globalRouter = originalRouter;
  setRouterScope(null);
  setScopeMiddlewares(originalScopeMiddlewares);

  // Mount scoped router to the main router with scope prefix
  getRouter().use(`/${scope}`, router);
};
