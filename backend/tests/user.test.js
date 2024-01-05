import { app, server } from "../index.js";
import request from "supertest";
import mongoose from "mongoose";

let token;
describe("User Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });
  afterAll(async () => {
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
  });

  test("Logging a Genuine User", async () => {
    const res = await request(app).post("/api/user/login").send({
      username: "test",
      password: "test",
    });
    expect(res.body.message).toBe("Login Success");
    expect(res.statusCode).toBe(200);
    token = res.headers["set-cookie"]
      .find((cookie) => cookie.split("=")[0] === "auth_token")
      .split(";")[0];
  });

  test("Getting User's Basic Details", async () => {
    const res = await request(app)
      .get("/api/user/profile")
      .set("Cookie", token);
    expect(res.statusCode).toBe(200);
    token = res.body.user;
  });
});

export default token;
