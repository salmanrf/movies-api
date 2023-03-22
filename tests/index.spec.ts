import supertest from "supertest";
import { Server } from "../src/server";

describe("API Test", () => {
  let app: Server;

  beforeAll(() => {
    app = new Server();

    app.config();
    app.setupRoutes();
  });

  test("Health Check", async () => {
    const res = await supertest(app.getApp()).get("/health");

    expect(res.body).toEqual({ message: "I am healthy" });
  });
});
