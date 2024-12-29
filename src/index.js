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
  setRouterCotrollersPath: () => setRouterCotrollersPath
});
module.exports = __toCommonJS(src_exports);

// src.ts/base.ts
var import_express = require("express");
var globalRouter = null;
var currentScope = null;
var controllersPath = "../controllers";
var getRouter = () => {
  if (!globalRouter) {
    globalRouter = (0, import_express.Router)();
  }
  return globalRouter;
};
var resetRouter = () => {
  globalRouter = null;
  currentScope = null;
  controllersPath = "../controllers";
};
var setRouterCotrollersPath = (path2) => controllersPath = path2;
var getRouterCotrollersPath = () => controllersPath;
var setRouterScope = (scope) => {
  currentScope = scope;
};
var getRouterScope = () => currentScope;
var routeScope = (scope, routesDefinitionCallback) => {
  const router = (0, import_express.Router)();
  const originalRouter = globalRouter;
  globalRouter = router;
  setRouterScope(scope);
  routesDefinitionCallback();
  globalRouter = originalRouter;
  setRouterScope(null);
  getRouter().use(`/${scope}`, router);
};

// src.ts/utils.ts
var import_path = __toESM(require("path"));
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
  const scope = getRouterScope();
  if (controllerName.includes("/")) {
    return import_path.default.join(getRouterCotrollersPath(), `${controllerName}Controller`);
  }
  if (scope) {
    return import_path.default.join(
      getRouterCotrollersPath(),
      scope,
      `${controllerName}Controller`
    );
  }
  return import_path.default.join(getRouterCotrollersPath(), `${controllerName}Controller`);
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
var root = (controllerAction) => {
  const { controller, action } = typeof controllerAction === "string" ? parseControllerString(controllerAction) : controllerAction;
  getRouter().get("/", loadController(controller, action));
};
var get = (urlPath, controllerAction) => {
  const { controller, action } = typeof controllerAction === "string" ? parseControllerString(controllerAction) : controllerAction;
  const normalizedPath = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
  getRouter().get(`/${normalizedPath}`, loadController(controller, action));
};
var post = (urlPath, controllerAction) => {
  const { controller, action } = typeof controllerAction === "string" ? parseControllerString(controllerAction) : controllerAction;
  const normalizedPath = urlPath.startsWith("/") ? urlPath.slice(1) : urlPath;
  getRouter().post(`/${normalizedPath}`, loadController(controller, action));
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  get,
  getRouter,
  getRouterCotrollersPath,
  post,
  resetRouter,
  root,
  routeScope,
  setRouterCotrollersPath
});
//# sourceMappingURL=index.js.map
