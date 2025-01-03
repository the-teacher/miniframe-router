import path from "path";
import { getActionsPath, getRouterScope } from "./base";

const getProjectRoot = () => process.cwd();

export const parseScopeActionString = (scopeActionString: string) => {
  const [scope, action] = scopeActionString.split("#");
  if (!scope || !action) {
    throw new Error(
      `Invalid format for scope action: ${scopeActionString}. Expected format is 'scope#action'.`
    );
  }
  return { scope, action };
};

export const buildActionPath = (scopeName: string, actionName: string) => {
  const currentScope = getRouterScope();
  const projectRoot = getProjectRoot();
  const actionsBasePath = path.resolve(projectRoot, getActionsPath());

  if (currentScope) {
    if (scopeName === currentScope) {
      return path.join(actionsBasePath, currentScope, `${actionName}Action`);
    }
    return path.join(actionsBasePath, scopeName, `${actionName}Action`);
  }

  return path.join(actionsBasePath, scopeName, `${actionName}Action`);
};

export const loadAction = (scopeName: string, actionName: string) => {
  const actionPath = buildActionPath(scopeName, actionName);
  const action = require(actionPath);

  if (typeof action.perform !== "function") {
    throw new Error(
      `Action ${actionName} in scope ${scopeName} must export a 'perform' function`
    );
  }

  return action.perform;
};
