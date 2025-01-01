import express from "express";
import request from "supertest";
import path from "path";

import {
  root,
  get,
  post,
  getRouter,
  setRouterCotrollersPath,
  resetRouter,
} from "../index";

import { addDataMiddleware, authMiddleware } from "./middlewares";

describe("Routes with Middlewares", () => {
  beforeEach(() => {
    resetRouter();
    setRouterCotrollersPath(path.join(__dirname, "./test_controllers"));
  });

  test("should execute middleware before controller action", async () => {
    get("/middleware-test", "test#middlewareAction", {
      withMiddlewares: [addDataMiddleware],
    });

    const app = express();
    app.use(getRouter());

    const response = await request(app).get("/middleware-test");
    expect(response.body.testData).toBe("middleware data");
  });

  test("should execute multiple middlewares in order", async () => {
    get("/protected", "test#protectedAction", {
      withMiddlewares: [authMiddleware, addDataMiddleware],
    });

    const app = express();
    app.use(getRouter());

    // Request without auth token should fail
    const failedResponse = await request(app).get("/protected");
    expect(failedResponse.status).toBe(401);

    // Request with valid auth token should succeed and include middleware data
    const successResponse = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer valid-token");

    expect(successResponse.status).toBe(200);
    expect(successResponse.body.testData).toBe("middleware data");
    expect(successResponse.body.message).toBe("Protected resource accessed");
  });

  test("should work with root route", async () => {
    root("test#indexAction", {
      withMiddlewares: [addDataMiddleware],
    });

    const app = express();
    app.use(getRouter());

    const response = await request(app).get("/");
    expect(response.text).toBe("Hello Index!");
  });

  test("should work with POST routes", async () => {
    post("/secure-post", "test#postAction", {
      withMiddlewares: [authMiddleware],
    });

    const app = express();
    app.use(getRouter());

    // Unauthorized POST request should fail
    const failedResponse = await request(app).post("/secure-post");
    expect(failedResponse.status).toBe(401);

    // Authorized POST request should succeed
    const successResponse = await request(app)
      .post("/secure-post")
      .set("Authorization", "Bearer valid-token");

    expect(successResponse.status).toBe(200);
    expect(successResponse.text).toBe("Hello Post!");
  });
});
