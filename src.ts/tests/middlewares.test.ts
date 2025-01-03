import express from "express";
import request from "supertest";
import path from "path";

import {
  root,
  get,
  post,
  getRouter,
  setActionsPath,
  resetRouter,
  scope,
} from "../index";

import { addDataMiddleware, authMiddleware } from "./middlewares";

describe("Routes with Middlewares", () => {
  beforeEach(() => {
    resetRouter();
    setActionsPath(path.join(__dirname, "./test_actions"));
  });

  test("should work with root route", async () => {
    root("index#index", {
      withMiddlewares: [addDataMiddleware],
    });

    const app = express();
    app.use(getRouter());

    const response = await request(app).get("/");
    expect(response.text).toBe("Hello Index!");
  });

  test("should work with POST routes", async () => {
    post("/secure-post", "test#post", {
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

describe("Scoped Routes with Middlewares", () => {
  beforeEach(() => {
    resetRouter();
    setActionsPath(path.join(__dirname, "./test_actions"));
  });

  test("should apply scope middleware to all routes within scope", async () => {
    scope(
      "admin",
      () => {
        get("/show", "admin#show");
        post("/update", "admin#update");
      },
      {
        withMiddlewares: [authMiddleware],
      }
    );

    const app = express();
    app.use(getRouter());

    // Both routes should require authentication
    const getResponse = await request(app).get("/admin/show");
    expect(getResponse.status).toBe(401);

    const postResponse = await request(app).post("/admin/update");
    expect(postResponse.status).toBe(401);

    // With auth header, both should work
    const authedGetResponse = await request(app)
      .get("/admin/show")
      .set("Authorization", "Bearer valid-token");
    expect(authedGetResponse.status).toBe(200);

    const authedPostResponse = await request(app)
      .post("/admin/update")
      .set("Authorization", "Bearer valid-token");
    expect(authedPostResponse.status).toBe(200);
  });

  test("should combine scope and route middleware", async () => {
    scope(
      "admin",
      () => {
        get("/show", "admin#show", {
          withMiddlewares: [addDataMiddleware],
        });
      },
      {
        withMiddlewares: [authMiddleware],
      }
    );

    const app = express();
    app.use(getRouter());

    // Without auth should fail
    const failedResponse = await request(app).get("/admin/show");
    expect(failedResponse.status).toBe(401);

    // With auth should pass
    const successResponse = await request(app)
      .get("/admin/show")
      .set("Authorization", "Bearer valid-token");

    expect(successResponse.status).toBe(200);
  });
});
