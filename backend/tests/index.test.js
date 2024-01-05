import { app, server } from "../index.js";
import request from "supertest";
import mongoose from "mongoose";

describe("Testing the Index.js", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });
  afterAll(async () => {
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
  });

  test("Testing ...", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Test Done");
  });
});
