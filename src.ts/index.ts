import { Router, RequestHandler } from "express";

import {
  getRouter,
  getActionsPath,
  setActionsPath,
  resetRouter,
  routeScope,
  getScopeMiddlewares,
} from "./base";

import { parseScopeActionString, loadAction } from "./utils";

// Type definition for route options with optional middleware array
type RouteOptions = {
  withMiddlewares?: RequestHandler[];
};

export const root = (scopeAction: string, options: RouteOptions = {}) => {
  const { scope, action } =
    typeof scopeAction === "string"
      ? parseScopeActionString(scopeAction)
      : scopeAction;

  const handlers = [
    ...getScopeMiddlewares(),
    ...(options.withMiddlewares || []),
    loadAction(scope, action),
  ];

  getRouter().get("/", ...handlers);
};

export const get = (
  urlPath: string,
  scopeAction: string,
  options: RouteOptions = {}
) => {
  const { scope, action } =
    typeof scopeAction === "string"
      ? parseScopeActionString(scopeAction)
      : scopeAction;

  const normalizedPath = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
  const handlers = [
    ...getScopeMiddlewares(),
    ...(options.withMiddlewares || []),
    loadAction(scope, action),
  ];

  getRouter().get(`/${normalizedPath}`, ...handlers);
};

export const post = (
  urlPath: string,
  scopeAction: string,
  options: RouteOptions = {}
) => {
  const { scope, action } =
    typeof scopeAction === "string"
      ? parseScopeActionString(scopeAction)
      : scopeAction;

  const normalizedPath = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
  const handlers = [
    ...getScopeMiddlewares(),
    ...(options.withMiddlewares || []),
    loadAction(scope, action),
  ];

  getRouter().post(`/${normalizedPath}`, ...handlers);
};

// Export scope as an alias for routeScope
export const scope = routeScope;

export { getRouter, getActionsPath, setActionsPath, resetRouter, routeScope };
