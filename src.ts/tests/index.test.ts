import path from "path";
import express from "express";
import request from "supertest";

import {
  root,
  get,
  post,
  getRouter,
  setActionsPath,
  resetRouter,
  routeScope as scope,
} from "../index";

describe("Routes", () => {
  beforeEach(() => {
    resetRouter();
    setActionsPath(path.join(__dirname, "./test_actions"));
  });

  describe("Basic routes", () => {
    beforeEach(() => {
      root("index#index");
      get("/get", "test#get");
      post("/post", "test#post");
    });

    test("should return the correct response for the root route", async () => {
      const app = express();
      app.use(getRouter());

      const response = await request(app).get("/");
      expect(response.text).toBe("Hello Index!");
    });

    test("should return the correct response for the GET route", async () => {
      const app = express();
      app.use(getRouter());

      const response = await request(app).get("/get");
      expect(response.text).toBe("Hello Get!");
    });

    test("should return the correct response for the POST route", async () => {
      const app = express();
      app.use(getRouter());

      const response = await request(app).post("/post");
      expect(response.text).toBe("Hello Post!");
    });
  });

  describe("Scoped routes", () => {
    beforeEach(() => {
      scope("admin", () => {
        get("show", "admin#show");
        post("update", "admin#update");
      });
    });

    test("should return correct response for scoped GET route", async () => {
      const app = express();
      app.use(getRouter());

      const response = await request(app).get("/admin/show");
      expect(response.text).toBe("Admin Show!");
    });

    test("should return correct response for scoped POST route", async () => {
      const app = express();
      app.use(getRouter());

      const response = await request(app).post("/admin/update");
      expect(response.text).toBe("Admin Update!");
    });

    test("should return 404 for invalid scoped route", async () => {
      const app = express();
      app.use(getRouter());

      const response = await request(app).get("/admin/invalid");
      expect(response.status).toBe(404);
    });
  });

  describe("Routes with parameters", () => {
    beforeEach(() => {
      resetRouter();
      setActionsPath(path.join(__dirname, "./test_actions"));

      get("/users/:id", "test#getUser");
      post("/users/:id", "test#updateUser");
    });

    test("should handle route parameters in GET request", async () => {
      const app = express();
      app.use(getRouter());

      const response = await request(app).get("/users/123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: "123",
        message: "Get user 123",
      });
    });

    test("should handle route parameters and body in POST request", async () => {
      const app = express();
      app.use(express.json());
      app.use(getRouter());

      const userData = {
        name: "John Doe",
        email: "john@example.com",
      };

      const response = await request(app).post("/users/123").send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: "123",
        name: "John Doe",
        email: "john@example.com",
        message: "User 123 updated",
      });
    });
  });
});
