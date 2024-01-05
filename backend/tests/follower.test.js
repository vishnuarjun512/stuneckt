import { app, server } from "../index.js";
import request from "supertest";
import mongoose from "mongoose";

let token, tokenData;
describe("Posts Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const loginResponse = await request(app).post(`/api/user/login/`).send({
      username: "test",
      password: "test",
    });
    token = loginResponse.headers["set-cookie"]
      .find((cookie) => cookie.split("=")[0] === "auth_token")
      .split(";")[0];

    const res1 = await request(app)
      .get("/api/user/profile")
      .set("Cookie", token);

    tokenData = res1.body.user;
  });
  afterAll(async () => {
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
  });

  test("Get all followers of a user", async () => {
    const fakeData = Math.random().toString().slice(4, 8);
    const res = await request(app)
      .get(`/api/follower/getFollowers/${tokenData._id}`)
      .set("Cookie", token);
    expect(res.body.message).toBe("All Followers Found");
    expect(res.statusCode).toBe(200);
  });
});

export default token;
