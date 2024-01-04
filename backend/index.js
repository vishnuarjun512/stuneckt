import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import userRouter from "./routers/user.router.js";
import postRouter from "./routers/post.router.js";
import followerRouter from "./routers/follower.router.js";
dotenv.config();

const app = express();
const server = createServer(app);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Test Done" });
  } catch (error) {
    res.status(404).json({ message: "Test Failed" });
  }
});

app.use("/api/user/", userRouter);
app.use("/api/post/", postRouter);
app.use("/api/follower/", followerRouter);

export { app, server };
export default app;
