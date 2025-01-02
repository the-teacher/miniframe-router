"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src.ts/index.ts
var src_exports = {};
__export(src_exports, {
  get: () => get,
  getRouter: () => getRouter,
  getRouterCotrollersPath: () => getRouterCotrollersPath,
  post: () => post,
  resetRouter: () => resetRouter,
  root: () => root,
  routeScope: () => routeScope,
  scope: () => scope,
  setRouterCotrollersPath: () => setRouterCotrollersPath
});
module.exports = __toCommonJS(src_exports);

// src.ts/base.ts
var import_express = require("express");
var DEFAULT_CONTROLLERS_PATH = "src/controllers";
var globalRouter = null;
var currentScope = null;
var scopeMiddlewares = [];
var controllersPath = DEFAULT_CONTROLLERS_PATH;
var getRouter = () => {
  if (!globalRouter) {
    globalRouter = (0, import_express.Router)();
  }
  return globalRouter;
};
var resetRouter = () => {
  globalRouter = null;
  currentScope = null;
  scopeMiddlewares = [];
  controllersPath = DEFAULT_CONTROLLERS_PATH;
};
var setRouterCotrollersPath = (path2) => controllersPath = path2;
var getRouterCotrollersPath = () => controllersPath;
var setRouterScope = (scope2) => {
  currentScope = scope2;
};
var getRouterScope = () => currentScope;
var getScopeMiddlewares = () => scopeMiddlewares;
var setScopeMiddlewares = (middlewares) => {
  scopeMiddlewares = middlewares;
};
var routeScope = (scope2, routesDefinitionCallback, options = {}) => {
  const router = (0, import_express.Router)();
  const originalRouter = globalRouter;
  const originalScopeMiddlewares = scopeMiddlewares;
  globalRouter = router;
  setRouterScope(scope2);
  setScopeMiddlewares(options.withMiddlewares || []);
  routesDefinitionCallback();
  globalRouter = originalRouter;
  setRouterScope(null);
  setScopeMiddlewares(originalScopeMiddlewares);
  getRouter().use(`/${scope2}`, router);
};

// src.ts/utils.ts
var import_path = __toESM(require("path"));
var getProjectRoot = () => {
  let currentDir = process.cwd();
  return currentDir;
};
var parseControllerString = (controllerActionString) => {
  const [controller, action] = controllerActionString.split("#");
  if (!controller || !action) {
    throw new Error(
      `Invalid format for controller action: ${controllerActionString}. Expected format is 'controller#action'.`
    );
  }
  return { controller, action };
};
var requireController = (controllerPath) => require(controllerPath);
var buildControllerPath = (controllerName) => {
  const scope2 = getRouterScope();
  const projectRoot = getProjectRoot();
  const controllersBasePath = import_path.default.resolve(
    projectRoot,
    getRouterCotrollersPath()
  );
  if (controllerName.includes("/")) {
    return import_path.default.join(controllersBasePath, `${controllerName}Controller`);
  }
  if (scope2) {
    return import_path.default.join(controllersBasePath, scope2, `${controllerName}Controller`);
  }
  return import_path.default.join(controllersBasePath, `${controllerName}Controller`);
};
var loadController = (controllerName, action) => {
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

// src.ts/index.ts
var root = (controllerAction, options = {}) => {
  const { controller, action } = typeof controllerAction === "string" ? parseControllerString(controllerAction) : controllerAction;
  const handlers = [
    ...getScopeMiddlewares(),
    ...options.withMiddlewares || [],
    loadController(controller, action)
  ];
  getRouter().get("/", ...handlers);
};
var get = (urlPath, controllerAction, options = {}) => {
  const { controller, action } = typeof controllerAction === "string" ? parseControllerString(controllerAction) : controllerAction;
  const normalizedPath = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
  const handlers = [
    ...getScopeMiddlewares(),
    ...options.withMiddlewares || [],
    loadController(controller, action)
  ];
  getRouter().get(`/${normalizedPath}`, ...handlers);
};
var post = (urlPath, controllerAction, options = {}) => {
  const { controller, action } = typeof controllerAction === "string" ? parseControllerString(controllerAction) : controllerAction;
  const normalizedPath = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
  const handlers = [
    ...getScopeMiddlewares(),
    ...options.withMiddlewares || [],
    loadController(controller, action)
  ];
  getRouter().post(`/${normalizedPath}`, ...handlers);
};
var scope = routeScope;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  get,
  getRouter,
  getRouterCotrollersPath,
  post,
  resetRouter,
  root,
  routeScope,
  scope,
  setRouterCotrollersPath
});
//# sourceMappingURL=index.js.map
