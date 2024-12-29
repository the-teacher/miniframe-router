import { Router } from "express";

import {
  getRouter,
  getRouterCotrollersPath,
  setRouterCotrollersPath,
  resetRouter,
  routeScope,
} from "./base";

import { parseControllerString, loadController } from "./utils";

export const root = (controllerAction: string) => {
  const { controller, action } =
    typeof controllerAction === "string"
      ? parseControllerString(controllerAction)
      : controllerAction;

  getRouter().get("/", loadController(controller, action));
};

export const get = (urlPath: string, controllerAction: string) => {
  const { controller, action } =
    typeof controllerAction === "string"
      ? parseControllerString(controllerAction)
      : controllerAction;

  const normalizedPath = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
  getRouter().get(`/${normalizedPath}`, loadController(controller, action));
};

export const post = (urlPath: string, controllerAction: string) => {
  const { controller, action } =
    typeof controllerAction === "string"
      ? parseControllerString(controllerAction)
      : controllerAction;

  const normalizedPath = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
  getRouter().post(`/${normalizedPath}`, loadController(controller, action));
};

export {
  getRouter,
  getRouterCotrollersPath,
  setRouterCotrollersPath,
  resetRouter,
  routeScope,
};
