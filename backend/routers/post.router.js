import express from "express";
import {
  createPost,
  deleteAll,
  deletePost,
  getAllPosts,
  updatePost,
  getPost,
} from "../controllers/post.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create/:userId", verifyUser, createPost);
router.get("/getPost/:id", verifyUser, getPost);
router.get("/getPosts/:userId", verifyUser, getAllPosts);
router.delete("/deletePost/:id", verifyUser, deletePost);
router.put("/update/:id", verifyUser, updatePost);

//If the user deactivates his account then remove all Posts created by User
router.delete("/deleteAll/:userId", verifyUser, deleteAll);

export default router;
