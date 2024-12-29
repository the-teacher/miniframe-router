import path from "path";

import {
  parseControllerString,
  buildControllerPath,
  loadController,
} from "../utils";

import {
  getRouterCotrollersPath,
  setRouterCotrollersPath,
  getRouter,
  resetRouter,
} from "../index";

describe("parseControllerString", () => {
  beforeEach(() => {
    setRouterCotrollersPath(path.join(__dirname, "./test_controllers"));
  });

  test("should correctly parse a valid controller action string", () => {
    const input = "user#create";
    const expected = { controller: "user", action: "create" };
    const result = parseControllerString(input);

    expect(result).toEqual(expected);
  });

  test("should throw an error for an invalid format (missing action)", () => {
    const input = "user#";

    expect(() => {
      parseControllerString(input);
    }).toThrow(
      "Invalid format for controller action: user#. Expected format is 'controller#action'."
    );
  });

  test("should throw an error for an invalid format (missing controller)", () => {
    const input = "#create";

    expect(() => {
      parseControllerString(input);
    }).toThrow(
      "Invalid format for controller action: #create. Expected format is 'controller#action'."
    );
  });

  test("should throw an error for an empty string", () => {
    const input = "";

    expect(() => {
      parseControllerString(input);
    }).toThrow(
      "Invalid format for controller action: . Expected format is 'controller#action'."
    );
  });

  test('should throw an error for a string without a "#" separator', () => {
    const input = "usercreate";

    expect(() => {
      parseControllerString(input);
    }).toThrow(
      "Invalid format for controller action: usercreate. Expected format is 'controller#action'."
    );
  });
});

describe("buildControllerPath", () => {
  test("should build correct controller path", () => {
    const controllerName = "test";
    const expectedPath = path.join(
      __dirname,
      ".",
      "test_controllers",
      "testController"
    );

    const result = buildControllerPath(controllerName);
    expect(result).toBe(expectedPath);
  });
});

describe("loadController", () => {
  test("should load existing controller action", () => {
    const controllerName = "test";
    const action = "indexAction";

    const controller = loadController(controllerName, action);
    expect(typeof controller).toBe("function");
  });

  test("should throw error when action doesn't exist", () => {
    const controllerName = "test";
    const action = "nonExistentAction";

    expect(() => {
      loadController(controllerName, action);
    }).toThrow(`Action ${action} not found in controller ${controllerName}`);
  });

  test("should throw error when controller doesn't exist", () => {
    const controllerName = "nonExistent";
    const action = "indexAction";

    expect(() => {
      loadController(controllerName, action);
    }).toThrow(/Cannot find module/);
  });
});

describe("resetRouter", () => {
  test("should reset router and controllers path", () => {
    const initialRouter = getRouter();
    const customPath = path.join(__dirname, "custom/path");

    setRouterCotrollersPath(customPath);
    expect(getRouterCotrollersPath()).toBe(customPath);

    resetRouter();

    const newRouter = getRouter();
    expect(newRouter).not.toBe(initialRouter);
    expect(getRouterCotrollersPath()).toBe("../controllers");
  });
});
