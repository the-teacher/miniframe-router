import path from "path";
import { getRouterCotrollersPath, getRouterScope } from "./base";

export const parseControllerString = (controllerActionString: string) => {
  const [controller, action] = controllerActionString.split("#");
  if (!controller || !action) {
    throw new Error(
      `Invalid format for controller action: ${controllerActionString}. Expected format is 'controller#action'.`
    );
  }
  return { controller, action };
};

export const requireController = (controllerPath: string) =>
  require(controllerPath);

export const buildControllerPath = (controllerName: string) => {
  const scope = getRouterScope();

  if (controllerName.includes("/")) {
    return path.join(getRouterCotrollersPath(), `${controllerName}Controller`);
  }

  // If we have active scope, look for controller in scope directory
  if (scope) {
    return path.join(
      getRouterCotrollersPath(),
      scope,
      `${controllerName}Controller`
    );
  }

  return path.join(getRouterCotrollersPath(), `${controllerName}Controller`);
};

export const loadController = (controllerName: string, action: string) => {
  const controllerPath = buildControllerPath(controllerName);
  const controller = requireController(controllerPath);

  if (controller[action]) {
    return controller[action];
  } else {
    throw new Error(
      `Action ${action} not found in controller ${controllerName}`
    );
  }
};
