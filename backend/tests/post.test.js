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

  test("Creating a Post", async () => {
    const fakeData = Math.random().toString().slice(4, 8);
    const res = await request(app)
      .post(`/api/post/create/${tokenData._id}`)
      .set("Cookie", token)
      .send({
        content: "New Test Post" + fakeData,
      });
    expect(res.body.message).toBe("Post Created Successfully");
    expect(res.statusCode).toBe(200);
  });

  test("Get all Posts made by a User", async () => {
    const res = await request(app)
      .get(`/api/post/getPosts/${tokenData._id}`)
      .set("Cookie", token);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("All Posts Found Successfully");
    expect(res.body.data).toBeDefined();
  });
});

export default token;
