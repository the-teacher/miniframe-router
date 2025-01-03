import path from "path";
import { getRouter } from "../base";
import { parseScopeActionString, buildActionPath, loadAction } from "../utils";
import {
  getActionsPath,
  setActionsPath,
  resetRouter,
  setRouterScope,
} from "../base";

describe("Utils", () => {
  beforeEach(() => {
    resetRouter();
    setActionsPath(path.join(__dirname, "./test_actions"));
  });

  describe("parseScopeActionString", () => {
    test("should correctly parse scope and action", () => {
      const result = parseScopeActionString("users#show");
      expect(result).toEqual({ scope: "users", action: "show" });
    });

    test("should throw an error for an invalid format (missing action)", () => {
      expect(() => {
        parseScopeActionString("user#");
      }).toThrow(
        "Invalid format for scope action: user#. Expected format is 'scope#action'."
      );
    });

    test("should throw an error for an invalid format (missing controller)", () => {
      const input = "#create";

      expect(() => {
        parseScopeActionString(input);
      }).toThrow(
        "Invalid format for scope action: #create. Expected format is 'scope#action'."
      );
    });

    test("should throw an error for an empty string", () => {
      const input = "";

      expect(() => {
        parseScopeActionString(input);
      }).toThrow(
        "Invalid format for scope action: . Expected format is 'scope#action'."
      );
    });

    test('should throw an error for a string without a "#" separator', () => {
      const input = "usercreate";

      expect(() => {
        parseScopeActionString(input);
      }).toThrow(
        "Invalid format for scope action: usercreate. Expected format is 'scope#action'."
      );
    });
  });

  describe("buildActionPath", () => {
    test("should build correct path without scope", () => {
      const result = buildActionPath("users", "show");
      expect(result).toContain("/test_actions/users/showAction");
    });
  });

  describe("loadAction", () => {
    test("should load existing action", () => {
      const scopeName = "test";
      const action = "get";

      const handler = loadAction(scopeName, action);
      expect(typeof handler).toBe("function");
    });

    test("should throw error when action doesn't exist", () => {
      const scopeName = "test";
      const action = "nonExistent";

      expect(() => {
        loadAction(scopeName, action);
      }).toThrow(/Cannot find module/);
    });
  });

  describe("resetRouter", () => {
    test("should reset router and actions path", () => {
      const initialRouter = getRouter();
      const customPath = path.join(__dirname, "custom/path");

      setActionsPath(customPath);
      expect(getActionsPath()).toBe(customPath);

      resetRouter();

      const newRouter = getRouter();
      expect(newRouter).not.toBe(initialRouter);
      expect(getActionsPath()).toBe("src/actions");
    });
  });
});
