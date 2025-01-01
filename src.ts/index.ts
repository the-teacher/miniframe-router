import { Router, RequestHandler } from "express";

import {
  getRouter,
  getRouterCotrollersPath,
  setRouterCotrollersPath,
  resetRouter,
  routeScope,
  getScopeMiddlewares,
} from "./base";

import { parseControllerString, loadController } from "./utils";

// Type definition for route options with optional middleware array
type RouteOptions = {
  withMiddlewares?: RequestHandler[];
};

export const root = (controllerAction: string, options: RouteOptions = {}) => {
  const { controller, action } =
    typeof controllerAction === "string"
      ? parseControllerString(controllerAction)
      : controllerAction;

  const handlers = [
    ...getScopeMiddlewares(),
    ...(options.withMiddlewares || []),
    loadController(controller, action),
  ];

  getRouter().get("/", ...handlers);
};

export const get = (
  urlPath: string,
  controllerAction: string,
  options: RouteOptions = {}
) => {
  const { controller, action } =
    typeof controllerAction === "string"
      ? parseControllerString(controllerAction)
      : controllerAction;

  const normalizedPath = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
  const handlers = [
    ...getScopeMiddlewares(),
    ...(options.withMiddlewares || []),
    loadController(controller, action),
  ];

  getRouter().get(`/${normalizedPath}`, ...handlers);
};

export const post = (
  urlPath: string,
  controllerAction: string,
  options: RouteOptions = {}
) => {
  const { controller, action } =
    typeof controllerAction === "string"
      ? parseControllerString(controllerAction)
      : controllerAction;

  const normalizedPath = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
  const handlers = [
    ...getScopeMiddlewares(),
    ...(options.withMiddlewares || []),
    loadController(controller, action),
  ];

  getRouter().post(`/${normalizedPath}`, ...handlers);
};

// Export scope as an alias for routeScope
export const scope = routeScope;

export {
  getRouter,
  getRouterCotrollersPath,
  setRouterCotrollersPath,
  resetRouter,
  routeScope,
};
